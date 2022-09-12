import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import * as AuthActions from "./auth.actions";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

export interface AuthResponseData {
  kind?: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const signinUrl =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
const signupUrl =
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

@Injectable()
export class AuthEffects {
  authLogin = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
          return this.http
            .post<AuthResponseData>(signinUrl + environment.apiKey, {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            })
            .pipe(
              map((resData) => {
                const expirationDate = new Date(
                  new Date().getTime() + +resData.expiresIn * 1000
                );
                return new AuthActions.Login({
                  email: resData.email,
                  userId: resData.localId,
                  token: resData.idToken,
                  expirationDate: expirationDate,
                });
              }),
              catchError((errorRes) => {
                let errorMessage = "An unknown error occured!";
                if (!errorRes.error || !errorRes.error.error) {
                  return of(new AuthActions.LoginFail(errorMessage));
                }
                switch (errorRes.error.error.message) {
                  case "EMAIL_EXISTS":
                    errorMessage = "This email already exists.";
                    break;
                  case "EMAIL_NOT_FOUND":
                    errorMessage = "Password or email is wrong";
                    break;
                  case "INVALID_PASSWORD":
                    errorMessage = "Password or email is wrong";
                }
                return of(new AuthActions.LoginFail(errorMessage));
              })
            );
        })
      ),
    { dispatch: true }
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN_SUCCESS),
        tap(() => {
          this.router.navigate(["/"]);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}

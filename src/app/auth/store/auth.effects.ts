import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import * as AuthActions from "./auth.actions";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";

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
                return of(
                  new AuthActions.Login({
                    email: resData.email,
                    userId: resData.localId,
                    token: resData.idToken,
                    expirationDate: expirationDate,
                  })
                );
              }),
              catchError((error) => {
                //
                return of();
              })
            );
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}

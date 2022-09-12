import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import * as AuthActions from "./auth.actions";
import { environment } from "src/environments/environment";

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
              catchError((error) => {
                //
                of();
              }),
              map((resData) => {
                of();
              })
            );
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Subject, tap, throwError } from "rxjs";
import { User } from "./user.model";

// https://firebase.google.com/docs/reference/rest/auth/#section-create-email-password
export interface AuthResponseData {
  kind?: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  signIn_url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAX_pG0lQyteKQLsTGQrAPSoYIkPJ9jHiQ";
  signUp_url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAX_pG0lQyteKQLsTGQrAPSoYIkPJ9jHiQ";
  $user = new Subject<User>();

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return (
      this.http
        .post<AuthResponseData>(this.signUp_url, {
          email: email,
          password: password,
          returnSecureToken: true,
        })
        // the parameter will automatically be passed under the hood
        .pipe(
          catchError(this.handleError),
          tap((resData) => {
            this.handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
            // Timestamp in ms
            /* const expirationDate = new Date(
              new Date().getTime() + +resData.expiresIn * 1000
            );
            const user = new User(
              resData.email,
              resData.localId,
              resData.idToken,
              expirationDate
            );
            this.user.next(user); */
          })
        )
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.signIn_url, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => this.handleError(error)),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
    // .pipe(catchError(this.handleError));
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.$user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occured!";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => {
        return new Error(errorMessage);
      });
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
    return throwError(() => {
      return new Error(errorMessage);
    });
  }
}

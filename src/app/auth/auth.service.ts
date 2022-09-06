import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

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

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.signUp_url, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((errorRes) => {
          let errorMessage = "An unknown error occured!";
          if (!errorRes.error || !errorRes.error.error) {
            return throwError(() => {
              return new Error(errorMessage);
            });
          }
          switch (errorRes.error.error.message) {
            case "EMAIL_EXISTS":
              errorMessage = "This email already exists.";
          }
          return throwError(() => {
            return new Error(errorMessage);
          });
        })
      );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(this.signIn_url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
  }
}

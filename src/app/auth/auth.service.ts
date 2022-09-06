import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

// https://firebase.google.com/docs/reference/rest/auth/#section-create-email-password
interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  endpoint_url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAX_pG0lQyteKQLsTGQrAPSoYIkPJ9jHiQ";

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.endpoint_url, {
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
}

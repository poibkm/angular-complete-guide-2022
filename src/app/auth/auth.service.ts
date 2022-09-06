import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

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
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[AIzaSyAX_pG0lQyteKQLsTGQrAPSoYIkPJ9jHiQ]";

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(this.endpoint_url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
  }
}

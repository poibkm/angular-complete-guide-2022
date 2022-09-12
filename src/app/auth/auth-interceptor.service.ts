import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, map, take } from "rxjs";
import { AuthService } from "./auth.service";
import * as fromApp from "../store/app.reducer";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.store.select("auth", "user").pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(request);
        }
        const modifiedReq = request.clone({
          params: new HttpParams().set("auth", user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}

import {
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export default class AuthInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // To Restrict Requests
    if (request.url) {
    }
    console.log("Request is on its way");
    console.log(request.url);
    // const modifiedRequest = request.clone({url: 'some-new-url'});
    const modifiedRequest = request.clone({
      headers: request.headers.append("Auth", "xyz"),
    });

    /* const newReq = req.clone({
      setHeaders: {
        'New-Header-1': 'some value',
        'New-Header-2': 'some other value',
        'New-Header-3': 'yet another value'
      }
    }); */

    return next.handle(modifiedRequest).pipe(
      tap((event) => {
        console.log(event);
        if (event.type === HttpEventType.Response) {
          console.log("Response arrived, body data:");
          console.log(event.body);
        }
      })
    );
  }
}

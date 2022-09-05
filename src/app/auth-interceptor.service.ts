import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";

export class AuthInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // To Restrict Requests
    if (request.url) {
    }
    console.log("Request is on its way");
    return next.handle(request);
  }
}

import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  private DATABASE_URL =
    "https://ng-complete-guide-f22ba-default-rtdb.europe-west1.firebasedatabase.app/posts.json";
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(this.DATABASE_URL, postData, {
        observe: "response",
      })
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    let searchParam = new HttpParams();
    searchParam = searchParam.append("print", "pretty");
    searchParam = searchParam.append("custom", "key");
    return this.http
      .get<{ [key: string]: Post }>(this.DATABASE_URL, {
        headers: new HttpHeaders({ "Custom-Header": "Whatever" }),
        // params: new HttpParams().set("print", "pretty"),
        params: searchParam,
        responseType: "json",
        // Another way
        /* params: new HttpParams()
          .set("print", "pretty")
          .set("param2", "val2")
          .set("param3", "val3"), */
      })
      .pipe(
        // map - rewrap data into an observable
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          // Send to analytics server – some generic task
          return throwError(errorRes);
        })
        // Suggestion by Jost
        /* map((resData) =>
          Object.entries(resData).map(([id, post]) => ({ ...post, id }))
        ) */
      );
  }

  deletePosts() {
    return this.http
      .delete(this.DATABASE_URL, {
        observe: "events",
        responseType: "text",
      })
      .pipe(
        // It's a good practice to use tap instead of map if we don't want to transform the response, just performing a side effect.
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            //
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}

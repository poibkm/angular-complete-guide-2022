import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  private DATABASE_URL =
    "https://ng-complete-guide-f22ba-default-rtdb.europe-west1.firebasedatabase.app/posts.json";

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(this.DATABASE_URL, postData)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  fetchPosts() {
    return this.http.get<{ [key: string]: Post }>(this.DATABASE_URL).pipe(
      // map - rewrap data into an observable
      map((responseData) => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }
        return postsArray;
      })
      // Suggestion by Jost
      /* map((resData) =>
          Object.entries(resData).map(([id, post]) => ({ ...post, id }))
        ) */
    );
  }
}

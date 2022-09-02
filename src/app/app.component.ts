import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  private DATABASE_URL =
    "https://ng-complete-guide-f22ba-default-rtdb.europe-west1.firebasedatabase.app";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    console.log(postData);
    // Angular will transform it automatically to JSON
    this.http
      .post(`${this.DATABASE_URL}/posts.json`, postData)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    this.http
      .get(`${this.DATABASE_URL}/posts.json`)
      .pipe(
        // map - rewrap data into an observable
        map((responseData) => {
          const postsArray = [];
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
      )
      .subscribe((posts) => {
        console.log(posts);
      });
  }
}

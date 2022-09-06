import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({
  providedIn: "root",
})
export class DataStorageService {
  private DB_URL =
    "https://ng-complete-guide-f22ba-default-rtdb.europe-west1.firebasedatabase.app/";

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    // Depends on API, could also be POST
    this.http
      .put(`${this.DB_URL}/recipes.json`, recipes)
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    // take: Takes 1 value from obersvable and after that unsubscribe
    return this.authService.$user.pipe(
      take(1),
      // exhaustMap: It waits for the first observable ($user) to complete
      // Then gets replaced by the new observable
      exhaustMap((user) => {
        return this.http.get<Recipe[]>(`${this.DB_URL}/recipes.json`, {
          params: new HttpParams().set("auth", user.token),
        });
      }),
      map((recipes) => {
        // map is called on an array; normal JS map method
        return recipes.map((recipe) => {
          /* return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          }; */
          // Merging objects => will be overwritten if it existsr
          return {
            ingredients: [],
            ...recipe,
          };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}

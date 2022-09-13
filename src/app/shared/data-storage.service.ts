import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, tap } from "rxjs";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import * as fromApp from "../store/app.reducer";
import * as RecipesActions from "../recipes/store/recipe.actions";

@Injectable({
  providedIn: "root",
})
export class DataStorageService {
  private DB_URL =
    "https://ng-complete-guide-f22ba-default-rtdb.europe-west1.firebasedatabase.app/";

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
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
    return this.http.get<Recipe[]>(`${this.DB_URL}/recipes.json`).pipe(
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
        // this.recipeService.setRecipes(recipes);
        this.store.dispatch(new RecipesActions.SetRecipes(recipes));
      })
    );
  }
}

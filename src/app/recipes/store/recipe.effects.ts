import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs";
import { Recipe } from "../recipe.model";
import * as RecipesActions from "./recipe.actions";
import * as fromApp from "src/app/store/app.reducer";

@Injectable()
export class RecipeEffects {
  private DB_URL =
    "https://ng-complete-guide-f22ba-default-rtdb.europe-west1.firebasedatabase.app/";

  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(`${this.DB_URL}recipes.json`);
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
      map((recipes) => {
        return new RecipesActions.SetRecipes(recipes);
      })
    )
  );

  storeRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select("recipes")),
        // Array Destructuring; recipesState => withLatestFrom
        switchMap(([actionData, recipesState]) => {
          return this.http.put(
            `${this.DB_URL}recipes.json`,
            recipesState.recipes
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}

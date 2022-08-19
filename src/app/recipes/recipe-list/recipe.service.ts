import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "../recipe.model";

@Injectable({
  providedIn: "root",
})
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      "A Test Recipe",
      "This is simply a test recipe",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1453&q=80"
    ),
    new Recipe(
      "Another Test Recipe",
      "This is simply a test recipe",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1453&q=80"
    ),
  ];

  constructor() {}

  getRecipes() {
    return this.recipes.slice();
  }
}

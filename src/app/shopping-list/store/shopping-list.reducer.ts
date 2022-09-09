import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";
import { ADD_INGREDIENT } from "./shopping-list.actions";

// Recommended to use a JS object
const initialState = {
  // TS automatically assumes that it is of type Ingredient[]
  ingredients: [new Ingredient("Onions", 1), new Ingredient("Tomatoes", 10)],
};

export function shoppingListReducer(state = initialState, action: Action) {
  switch (action.type) {
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action],
      };
      break;

    default:
      break;
  }
}

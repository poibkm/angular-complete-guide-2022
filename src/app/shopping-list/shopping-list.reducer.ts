import { Ingredient } from "../shared/ingredient.model";

// Recommended to use a JS object
const initialState = {
  // TS automatically assumes that it is of type Ingredient[]
  ingredients: [new Ingredient("Onions", 1), new Ingredient("Tomatoes", 10)],
};

export function shoppingListReducer(state = initialState, action) {}

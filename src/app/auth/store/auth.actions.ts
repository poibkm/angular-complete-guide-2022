import { Action } from "@ngrx/store";

export const LOGIN_START = "[Auth] Login Start";
export const LOGIN_SUCCESS = "[Auth] Login";
export const LOGOUT = "[Auth] Logout";

export class Login implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions = Login | Logout;

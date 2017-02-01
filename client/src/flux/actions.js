import dispatcher from "./dispatcher.js";

export function setUser(user) {
  dispatcher.dispatch({
    type: "LOGIN",
    payload: user
  });
}

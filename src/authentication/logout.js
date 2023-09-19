
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("Successfully logged out.");
      })
      .catch((error) => {
        console.error(error.code);
      });
  };
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Load user data from Firebase
export async function userDataLoader({ params }) {
  const docRef = doc(db, "users", params.userId);
  const docSnap = await getDoc(docRef);

  let userData = {};

  // Check if document with userId exists on Firestore
  if (docSnap.exists()) {
    console.log("Document found:", params.userId);
    userData = docSnap.data();
  } else {
    console.error("Document not found!");
  }

  return userData;
}
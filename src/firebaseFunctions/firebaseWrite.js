//import React from 'react'
import {
    //arrayUnion,
    //updateDoc,
    //setDoc,
    //getDoc,
    doc,
    addDoc,
    collection
    //arrayRemove,
  } from "firebase/firestore";
  import { db } from "../firebaseConfig";

export async function storeItemsSell(userId, form_item){

  const docRef = doc(db, "users", userId);
  const collectionVal = collection(docRef, "ItemsToSell")

  await addDoc(
    collectionVal,
    {
      productName: form_item.productName,
      email: form_item.email,
      price: form_item.price,
      description: form_item.description
    },
    //{ merge: true }
  );

}


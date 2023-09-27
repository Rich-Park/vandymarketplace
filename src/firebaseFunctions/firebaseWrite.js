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
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

export async function storeItemsSell(userId, form_item){

  const docRef = doc(db, "users", userId);

  const collectionVal = collection(docRef, "ItemsToSell");

  const imageURLs = [];

  for (const image of form_item.images) {
    const storageRef = ref(storage, `${userId}/${image.name}`);
    await uploadBytes(storageRef, image);

      // Get the download URL for the uploaded image
    const downloadURL = await getDownloadURL(storageRef);
    imageURLs.push(downloadURL);
  }
  console.log("adding document")
  await addDoc(collectionVal, {
    productName: form_item.productName,
    email: form_item.email,
    price: form_item.price,
    description: form_item.description,
    imageURLs: imageURLs,
  });
  console.log("finished adding document")

}


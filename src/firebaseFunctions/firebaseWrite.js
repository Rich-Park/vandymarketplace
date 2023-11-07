import {
  doc,
  addDoc,
  collection,
  increment,
  arrayUnion,
  arrayRemove,
  runTransaction,
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

export async function storeItemsSell(userId, form_item) {
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

  await addDoc(collectionVal, {
    productName: form_item.productName,
    email: form_item.email,
    price: parseFloat(form_item.price),
    description: form_item.description,
    imageURLs: imageURLs,
    tags: form_item.tags,
    timestamp: form_item.timestamp,
    likesCount: 0,
    sellerId: userId,
  });
}

export async function likeItem(userId, sellerId, itemId) {
  const userRef = doc(db, "users", userId);
  const sellerRef = doc(db, "users", sellerId);
  const itemRef = doc(sellerRef, "ItemsToSell", itemId);

  // Transaction to ensure atomicity
  return runTransaction(db, async (transaction) => {
    const itemDoc = await transaction.get(itemRef);
    if (!itemDoc.exists()) {
      throw new Error("Item does not exist!");
    }

    // Increment the likesCount
    transaction.update(itemRef, { likesCount: increment(1) });

    // Add itemID to the user's likedItems array
    transaction.update(userRef, { likedItems: arrayUnion(itemId) });
  });
}

export async function unlikeItem(userId, sellerId, itemID) {
  // References
  const userRef = doc(db, "users", userId);
  const sellerRef = doc(db, "users", sellerId);
  const itemRef = doc(sellerRef, "ItemsToSell", itemID);

  // Transaction to ensure atomicity
  return runTransaction(db, async (transaction) => {
    const itemDoc = await transaction.get(itemRef);
    if (!itemDoc.exists()) {
      throw new Error("Item does not exist!");
    }

    // Decrement the likesCount
    transaction.update(itemRef, { likesCount: increment(-1) });

    // Remove itemID from the user's likedItems array
    transaction.update(userRef, { likedItems: arrayRemove(itemID) });
  });
}

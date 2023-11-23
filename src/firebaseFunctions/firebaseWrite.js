import {
  doc,
  addDoc,
  collection,
  increment,
  arrayUnion,
  arrayRemove,
  runTransaction,
  deleteDoc,
  getDoc
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getStorage, deleteObject } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { getUserID } from "./dataload";

export async function storeItemsSell(userId, form_item) {
  const docRef = doc(db, "users", userId);

  const collectionVal = collection(docRef, "ItemsToSell");

  const imageURLs = [];
  const imageNames = [];

  const lowerCaseTags = form_item.tags.map(tag => tag.toLowerCase());

  for (const image of form_item.images) {

    const timestamp = new Date().getTime();
    const uniqueFilename = `${timestamp}_${image.name}`;

    const storageRef = ref(storage, `${userId}/${uniqueFilename}`);
    await uploadBytes(storageRef, image);

    // Get the download URL for the uploaded image
    const downloadURL = await getDownloadURL(storageRef);
    imageURLs.push(downloadURL);
    imageNames.push(`${userId}/${uniqueFilename}`)
  }

  await addDoc(collectionVal, {
    productName: form_item.productName,
    email: form_item.email,
    price: parseFloat(form_item.price),
    description: form_item.description,
    imageURLs: imageURLs,
    tags: lowerCaseTags,
    timestamp: form_item.timestamp,
    likesCount: 0,
    sellerId: userId,
    itemName: imageNames
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

    const likedItemData = { itemId: itemId, sellerId: sellerId };
    // Add itemID to the user's likedItems array
    transaction.update(userRef, { likedItems: arrayUnion(likedItemData) });
  });
}

export async function unlikeItem(userId, sellerId, itemId) {
  // References
  const userRef = doc(db, "users", userId);
  const sellerRef = doc(db, "users", sellerId);
  const itemRef = doc(sellerRef, "ItemsToSell", itemId);

  // Transaction to ensure atomicity
  return runTransaction(db, async (transaction) => {
    const itemDoc = await transaction.get(itemRef);
    if (!itemDoc.exists()) {
      throw new Error("Item does not exist!");
    }

    // Decrement the likesCount
    transaction.update(itemRef, { likesCount: increment(-1) });

    // Remove the object { itemId, sellerId } from the user's likedItems array
    const dislikedItemData = { itemId: itemId, sellerId: sellerId };
    transaction.update(userRef, { likedItems: arrayRemove(dislikedItemData) });
  });
}

export async function deleteItemFunc(item){

  const userId = await getUserID();
  const docRef = doc(db, "users", userId);
  const collectionVal = collection(docRef, "ItemsToSell");
  const itemRef = doc(collectionVal, item);

  // Retrieve the item document
  const itemDoc =  await getDoc(itemRef);
  if (!itemDoc.exists()) {
    throw new Error("Item does not exist!");
  }
  
  const imageNames = itemDoc.data().itemName || [];

  await deleteDoc(itemRef);

  const deletePromises = imageNames.map((imageName) => {
    const storageRef = ref(storage, imageName);
    return deleteObject(storageRef);
  });

  await Promise.all(deletePromises);

  //const storageRef = ref(storage, imageNames[0]);
  //await deleteObject(storageRef);

};

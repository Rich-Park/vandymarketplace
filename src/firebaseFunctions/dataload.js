import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";



export async function getUserID(){
  const userEmail = auth.currentUser.email;
  const userIdRef = doc(db, "userIDMap", userEmail);
  const docSnap = await getDoc(userIdRef);
  let userId = "";
  if (docSnap.exists()) {
    userId = docSnap.data().userId;
    console.log(userId);
  } else {
    console.log("error");
    console.error("Could not find document.");
  }
  return userId;
}

export async function AllSellItemsLoader(userId) {
  const itemsToSellRef = collection(db, "users"); // Assuming "users" is the top-level collection
  const itemsData = [];

  try {
    if (userId) {
      const userRef = doc(db, "users", userId);
      
      const itemsToSellCollectionRef = collection(userRef, "ItemsToSell");

      const itemsQuerySnapshot = await getDocs(itemsToSellCollectionRef);

      itemsQuerySnapshot.forEach((doc) => {
        const itemData = doc.data();
        itemsData.push(itemData);
      });
    }
    else{
      const querySnapshot = await getDocs(itemsToSellRef);

      querySnapshot.forEach(async (userDoc) => {
        const itemsToSellCollectionRef = collection(userDoc.ref, "ItemsToSell");
        
        // Create a query to retrieve documents that have imageURLs
        const itemsQuerySnapshot = await getDocs(itemsToSellCollectionRef);

        itemsQuerySnapshot.forEach((doc) => {
          const itemData = doc.data();
          itemsData.push(itemData);
        });
      });
    }

    return itemsData;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return []; // Return an empty array in case of an error
  }
}

export async function QueryItemsLoader(searchQuery, userId, myItems= false){
  const itemsToSellRef = collection(db, "users"); // Assuming "users" is the top-level collection
  const itemsData = [];

  try {
    const querySnapshot = await getDocs(itemsToSellRef);

    querySnapshot.forEach(async (userDoc) => {
      const itemsToSellCollectionRef = collection(userDoc.ref, "ItemsToSell");
      
      // Create a query to retrieve documents that have imageURLs
      const itemsQuerySnapshot = await getDocs(itemsToSellCollectionRef);

      itemsQuerySnapshot.forEach((doc) => {
        const itemData = doc.data();
        if (myItems) {
          // If myItems is true, filter by userId
          if (
            itemData.email === userId &&
            (itemData.productName.includes(searchQuery) ||
              itemData.description.includes(searchQuery))
          ) {
            itemsData.push(itemData);
          }
        } else if (
          itemData.productName.includes(searchQuery) ||
          itemData.description.includes(searchQuery)
        ) {
          itemsData.push(itemData);
        }
      });
    });

    return itemsData;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return []; // Return an empty array in case of an error
  }
}

export async function UserSellItemsLoader(userId){
  const itemsToSellRef = collection(db, "users", userId, "ItemsToSell");
  // Create a query to retrieve documents that have imageURLs
  const querySnapshot = await getDoc(query(itemsToSellRef, where("imageURLs", "!=", null)));

  // Initialize an array to store the imageURLs
  let imageURLs = [];

  if (querySnapshot.exists()) {
    const data = querySnapshot.data();
    imageURLs = data.imageURLs;
  }
  
  return imageURLs;
}


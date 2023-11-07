import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export async function getUserID() {
  const userEmail = auth.currentUser.email;
  const userIdRef = doc(db, "userIDMap", userEmail);
  const docSnap = await getDoc(userIdRef);
  let userId = "";
  if (docSnap.exists()) {
    userId = docSnap.data().userId;
    console.log(userId);
  } else {
    console.error("Could not find document.");
  }
  return userId;
}

export async function AllSellItemsLoader(userId) {
  const itemsToSellRef = collection(db, "users"); // Assuming "users" is the top-level collection
  let itemsData = [];
  try {
    if (userId) {
      const userRef = doc(db, "users", userId);
      const itemsToSellCollectionRef = collection(userRef, "ItemsToSell");
      const itemsQuerySnapshot = await getDocs(itemsToSellCollectionRef);

      itemsQuerySnapshot.forEach((doc) => {
        const itemData = doc.data();
        itemData.id = doc.id;
        itemsData.push(itemData);
      });
    } else {
      const querySnapshot = await getDocs(itemsToSellRef);
      await Promise.all(
        querySnapshot.docs.map(async (userDoc) => {
          const itemsToSellCollectionRef = collection(
            userDoc.ref,
            "ItemsToSell"
          );

          // Create a query to retrieve documents that have imageURLs
          const itemsQuerySnapshot = await getDocs(
            query(itemsToSellCollectionRef, orderBy("timestamp", "desc"))
          );
          itemsQuerySnapshot.forEach((doc) => {
            const itemData = doc.data();
            itemData.id = doc.id;
            itemsData.push(itemData);
          });
        })
      );
    }

    itemsData.sort((a, b) => b.timestamp - a.timestamp);
    return itemsData;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return []; // Return an empty array in case of an error
  }
}

export async function QueryItemsLoader(searchQuery, selectedPrice, userId, myItems = false) {
  console.log(selectedPrice);
  console.log("hihi")
  const itemsToSellRef = collection(db, "users"); // Assuming "users" is the top-level collection
  let itemsData = [];

  try {
    const querySnapshot = await getDocs(itemsToSellRef);

    await Promise.all(
      querySnapshot.docs.map(async (userDoc) => {
        const itemsToSellCollectionRef = collection(userDoc.ref, "ItemsToSell");

        // Create a query to retrieve documents that have imageURLs
        const itemsQuerySnapshot = await getDocs(
          query(itemsToSellCollectionRef, orderBy("timestamp", "desc"))
        );

        itemsQuerySnapshot.forEach((doc) => {

        
          const itemData = doc.data();
          const itemPrice = itemData.price;
          console.log(itemPrice)

          if (
            (selectedPrice === -1) || // No price filter
            (selectedPrice === 0 && itemPrice >= 0 && itemPrice < 25) || // 0-25 price range
            (selectedPrice === 25 && itemPrice >= 25 && itemPrice < 50) || // 25-50 price range
            (selectedPrice === 50 && itemPrice >= 50 && itemPrice < 75) || // 50-75 price range
            (selectedPrice === 100 && itemPrice >= 100) // 100+ price range
          ) {
              if (myItems) {
                // If myItems is true, filter by userId
                if (
                  itemData.email === userId &&
                  (itemData.productName.includes(searchQuery) ||
                    itemData.description.includes(searchQuery))
                ) {
                  itemData.id = doc.id;
                  itemsData.push(itemData);
                }
              } else if (
                itemData.productName.includes(searchQuery) ||
                itemData.description.includes(searchQuery)
              ) {
                itemData.id = doc.id;
                itemsData.push(itemData);
              }
          }
          
        });
      })
    );
    itemsData.sort((a, b) => b.timestamp - a.timestamp);

    return itemsData;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return []; // Return an empty array in case of an error
  }
}

export async function UserSellItemsLoader(userId) {
  const itemsToSellRef = collection(db, "users", userId, "ItemsToSell");
  // Create a query to retrieve documents that have imageURLs
  const querySnapshot = await getDoc(
    query(itemsToSellRef, where("imageURLs", "!=", null))
  );

  // Initialize an array to store the imageURLs
  let imageURLs = [];

  if (querySnapshot.exists()) {
    const data = querySnapshot.data();
    imageURLs = data.imageURLs;
  }

  return imageURLs;
}

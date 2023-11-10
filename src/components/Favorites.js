import React from "react";
import { useEffect, useState } from "react";
import Header from "./Header";
import ImageGallery from "./ImageGallery";
import SearchBar from "./searchbar";
import { getUserID } from "../firebaseFunctions/dataload";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Favorites = () => {
  const [likedItems, setLikedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  useEffect(() => {
    // Define the function to fetch liked items
    const fetchLikedItems = async (userId) => {
      try {
        const userRef = doc(db, "users", userId);
        const userData = await getDoc(userRef);
        if (userData.exists()) {
          const userLikedItemsIDs = userData.data().likedItems || [];
          const itemsDetails = [];
          for (let item of userLikedItemsIDs) {
            const itemId = item.itemId;
            const sellerId = item.sellerId;
            const itemRef = doc(db, "users", sellerId, "ItemsToSell", itemId);
            const itemSnapshot = await getDoc(itemRef);
            if (itemSnapshot.exists()) {
              const itemData = itemSnapshot.data();
              itemData.id = itemId;
              itemsDetails.push(itemData);
            }
          }
          setLikedItems(itemsDetails);
        }
      } catch (e) {
        console.error("Error fetching liked items:", e);
      }
    };

    // Set up an observer on the Auth object to make sure we have a user before fetching
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userId = await getUserID();
        fetchLikedItems(userId);
      } else {
        // Optionally handle the case when there is no user signed in
        setLikedItems([]); // Reset liked items if needed
      }
    });

    // Cleanup auth observer on component unmount
    return () => unsubscribe();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePriceChange = (priceOption) => {
    setSelectedPrice(priceOption);
  };

  const handleTagging = (tagOption) => {
    setSelectedTag(tagOption);
  };

  return (
    <>
      <Header />
      <SearchBar
        onSearch={handleSearch}
        onPriceChange={handlePriceChange}
        onTagChange = {handleTagging}
        searchQuery={searchQuery}
        selectedPrice={selectedPrice}
        selectedTag = {selectedTag}
      />
      <ImageGallery
        favoriteItems={likedItems}
        searchQuery={searchQuery}
        selectedPrice={selectedPrice} 
        selectedTag = {selectedTag}
        favorites={true}
      />
    </>
  );
};

export default Favorites;

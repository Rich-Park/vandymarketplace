import React from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./Header";
import ImageGallery from "./ImageGallery";
import SearchBar from "./searchbar";

export default function HomePage() {
  const navigate = useNavigate();


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedSort, setSelectedSort] = useState("time");


  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePriceChange = (priceOption) => {
    setSelectedPrice(priceOption);
  };

  const handleTagging = (tagOption) => {
    setSelectedTag(tagOption);
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  
  useEffect(() => {
    // Observe auth state to redirect to login/home page
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userEmail = user.email;
          const userIdRef = doc(db, "userIDMap", userEmail);
          const docSnap = await getDoc(userIdRef);

          if (!docSnap.exists()) {
            console.error("Could not find document.");
          }
          // Additional logic if the document exists
        } else {
          console.log("redirect");
          navigate("/log-in");
        }
      } catch (error) {
        console.error("An error occurred: ", error);
        // Handle the error appropriately
        // Maybe navigate to an error page or display a message
      }
    });
  }, [navigate]);

  return (
    <>
      <Header />

      <SearchBar
        onSearch={handleSearch}
        onPriceChange={handlePriceChange}
        onTagChange = {handleTagging}
        onSortChange={handleSortChange}
        searchQuery={searchQuery}
        selectedPrice={selectedPrice}
        selectedTag = {selectedTag}
        selectedSort={selectedSort}
      />

      <ImageGallery searchQuery={searchQuery} selectedPrice={selectedPrice} selectedTag = {selectedTag} selectedSort = {selectedSort}/>
 
    </>
  );
}
/** */

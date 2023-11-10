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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePriceChange = (priceOption) => {
    setSelectedPrice(priceOption);
  };

  const handleTagging = (tagOption) => {
    setSelectedTag(tagOption);
  };

  
  useEffect(() => {
    // Observe auth state to redirect to login/home page
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        const userIdRef = doc(db, "userIDMap", userEmail);
        const docSnap = await getDoc(userIdRef);
    
        if (docSnap.exists()) {
        } else {
          console.error("Could not find document.");
        }
      } else {
        console.log("redirect");
        navigate("/log-in");
      }
    });
    

  }, [auth, navigate]);  

  return (
    <>
      <Header/>
      
      <SearchBar
        onSearch={handleSearch}
        onPriceChange={handlePriceChange}
        onTagChange = {handleTagging}
        searchQuery={searchQuery}
        selectedPrice={selectedPrice}
        selectedTag = {selectedTag}
      />
      <ImageGallery searchQuery={searchQuery} selectedPrice={selectedPrice} selectedTag = {selectedTag}/>
 
    </>
  );
}
/** */
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

  const handleSearch = (query) => {
    setSearchQuery(query);
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
    

  }, [auth]);  

  

  return (
    <>
      <Header/>
      <SearchBar onSearch={handleSearch} />
      <ImageGallery searchQuery={searchQuery}/>
 
    </>
  );
}
/** */
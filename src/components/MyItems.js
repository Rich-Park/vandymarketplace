import { Box, Button, Text } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import ImageGallery from "./ImageGallery";
import SearchBar from "./searchbar";
import { useState } from "react";

// let newId = auth.currentUser.email.substring(0, auth.currentUser.email.indexOf("@"));
// newId = newId.replace(/[^a-zA-Z0-9]/g, "");
// const result = await AllSellItemsLoader(newId);

export default function MyItems() {
    const navigate = useNavigate();
    let userDisplayName = "";
  
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userDisplayName = user.displayName;
      }
    });
  
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
      setSearchQuery(query);
    };
  
    return (
        <div>
            <Header />
            <SearchBar onSearch={handleSearch} />
            <ImageGallery searchQuery={searchQuery} myItems={true}/>
        </div>
      
    );
  }
  
import Header from "./Header";
import ImageGallery from "./ImageGallery";
import SearchBar from "./searchbar";
import { useState } from "react";

export default function MyItems() {
  
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
  
import Header from "./Header";
import ImageGallery from "./ImageGallery";
import SearchBar from "./searchbar";
import { useState } from "react";

export default function MyItems() {
  
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');

    const handleSearch = (query) => {
      setSearchQuery(query);
    };

    const handlePriceChange = (priceOption) => {
      setSelectedPrice(priceOption);
    };
  
    return (
        <div>
            <Header />
            <SearchBar onSearch={handleSearch} onPriceChange={handlePriceChange} />
            <ImageGallery searchQuery={searchQuery} selectedPrice={selectedPrice} myItems={true}/>
        </div>
      
    );
  }
  
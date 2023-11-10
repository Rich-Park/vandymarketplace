import Header from "./Header";
import ImageGallery from "./ImageGallery";
import SearchBar from "./searchbar";
import React, { useState } from "react";

export default function MyItems() {

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

    return (
        <div>
            <Header />
            <SearchBar
              onSearch={handleSearch}
              onPriceChange={handlePriceChange}
              onTagChange = {handleTagging}
              searchQuery={searchQuery}
              selectedPrice={selectedPrice}
              selectedTag = {selectedTag}
            />
            <ImageGallery searchQuery={searchQuery} selectedPrice={selectedPrice} selectedTag = {selectedTag} myItems={true}/>
        </div>

    );
  }
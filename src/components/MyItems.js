import Header from "./Header";
import ImageGallery from "./ImageGallery";
import SearchBar from "./searchbar";
import React, { useState } from "react";

export default function MyItems() {

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

    return (
        <div>
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
            <ImageGallery searchQuery={searchQuery} selectedPrice={selectedPrice} selectedTag = {selectedTag} selectedSort = {selectedSort} myItems={true}/>
        </div>

    );
  }
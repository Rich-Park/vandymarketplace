import React from 'react';
import { Input, InputGroup, Flex, Center,  Select} from "@chakra-ui/react";

function SearchBar({ onSearch, onPriceChange, onTagChange, onSortChange, searchQuery, selectedPrice, selectedTag, selectedSort }) {
  return (
    <Flex justifyContent="center" mt={2}>
      <Center>

        <InputGroup>
          <Input
            type="text"
            placeholder="Search for images"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            w="600px"
            data-testid="search-input"
          />

        </InputGroup>

        <Select ml = {2} placeholder='Price option' onChange={(e) => onPriceChange(e.target.value)} data-testid="Price option" value={selectedPrice}>
          <option value='option1'>0$ - 25$</option>
          <option value='option2'>25$ - 50$</option>
          <option value='option3'>50$ - 75$</option>
          <option value='option4'>75$ - 100$</option>
          <option value='option5'>100+$</option>
        </Select>

        <Select ml = {2} onChange = {(e) => onTagChange(e.target.value)} data-testid="Category" value = {selectedTag}>
            <option value="">Category</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="appliances">Appliances</option>
            <option value="home">Home Decor</option>
            <option value="jewelry">Jewelry</option>
            <option value="toys">Toys</option>
            <option value="sports">Sports Equipment</option>
            <option value="antiques">Antiques</option>
            <option value="kitchenware">Kitchenware</option>
            <option value="office">Office Supplies</option>
            <option value="vehicles">Vehicles</option>
        </Select>

        <Select ml={2} onChange={(e) => onSortChange(e.target.value)} data-testid="Sort option" value={selectedSort}>
          <option value="popularity">Popularity</option>
          <option value="time">Time</option>
        </Select>

      </Center>
    </Flex>
  );
}

export default SearchBar;

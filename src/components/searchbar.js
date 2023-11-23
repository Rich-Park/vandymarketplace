import React from 'react';
import { Input, InputGroup, Flex, Center,  Select} from "@chakra-ui/react";

function SearchBar({ onSearch, onPriceChange, onTagChange, searchQuery, selectedPrice, selectedTag }) {
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
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Appliances">Appliances</option>
            <option value="Home Decor">Home Decor</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Toys">Toys</option>
            <option value="Sports Equipment">Sports Equipment</option>
            <option value="Antiques">Antiques</option>
            <option value="Kitchenware">Kitchenware</option>
            <option value="Office Supplies">Office Supplies</option>
        </Select>

      </Center>
    </Flex>
  );
}

export default SearchBar;

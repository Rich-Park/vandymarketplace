import React, { useState } from 'react';
import { Input, Button, InputGroup, InputRightElement, Flex, Center,  Select} from "@chakra-ui/react";

//function SearchBar({ onSearch, onPriceChange }) {
    
  /*
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handlePriceChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedPrice(selectedOption);
    onPriceChange(selectedOption);
  };

            <InputRightElement width="4.5rem">
            <Button size="sm" onClick={handleSearch}>
              Search
            </Button>
          </InputRightElement>
*/

function SearchBar({ onSearch, onPriceChange, searchQuery, selectedPrice }) {
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
          />

        </InputGroup>

        <Select ml = {2} placeholder='Price option' onChange={(e) => onPriceChange(e.target.value)} value={selectedPrice}>
          <option value='option1'>0$ - 25$</option>
          <option value='option2'>25$ - 50$</option>
          <option value='option3'>50$ - 75$</option>
          <option value='option4'>75$ - 100$</option>
          <option value='option5'>100+$</option>
        </Select>

      </Center>
    </Flex>
  );
}

export default SearchBar;

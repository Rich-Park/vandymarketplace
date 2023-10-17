import React, { useState } from 'react';
import { Input, Button, Stack, InputGroup, InputRightElement, Flex, Center,  Select} from "@chakra-ui/react";

function SearchBar({ onSearch }) {
    
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <Flex justifyContent="center" mt={2}>
      <Center>

        <InputGroup>
          <Input
            type="text"
            placeholder="Search for images"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            w="600px"
          />
          <InputRightElement width="4.5rem">
            <Button size="sm" onClick={handleSearch}>
              Search
            </Button>
          </InputRightElement>
        </InputGroup>

        <Select ml = {2} placeholder='Price option'>
          <option value='option1'>0$ - 25$</option>
          <option value='option2'>25$ - 50$</option>
          <option value='option3'>50$ - 75$</option>
          <option value='option2'>75$ - 100$</option>
          <option value='option3'>100+$</option>
        </Select>

      </Center>
    </Flex>
  );
}

export default SearchBar;

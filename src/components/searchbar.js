import React, { useState } from 'react';
import { Input, Button, Stack, InputGroup, InputRightElement } from "@chakra-ui/react";

function SearchBar({ onSearch }) {
    
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <InputGroup>
        <Input
          type="text"
          placeholder="Search for images"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button size="sm" onClick={handleSearch}>
            Search
          </Button>
        </InputRightElement>
      </InputGroup>
    </Stack>
  );
}

export default SearchBar;


import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SearchBar from "../components/searchbar";; // Update the path
import '@testing-library/jest-dom/extend-expect';


test('renders SearchBar component', () => {
  const onSearchMock = jest.fn();
  const onPriceChangeMock = jest.fn();
  const onTagChangeMock = jest.fn();

  render(
    <SearchBar
      onSearch={onSearchMock}
      onPriceChange={onPriceChangeMock}
      onTagChange={onTagChangeMock}
      searchQuery=""
      selectedPrice=""
      selectedTag=""
    />
  );

  const searchInput = screen.getByTestId('search-input');
  const priceSelect = screen.getByTestId('Price option');
  const tagSelect = screen.getByTestId('Category');

  // Test changing search query
  fireEvent.change(searchInput, { target: { value: 'test' } });
  expect(onSearchMock).toHaveBeenCalledWith('test');

  // Test changing price option
  fireEvent.change(priceSelect, { target: { value: 'option1' } });
  expect(onPriceChangeMock).toHaveBeenCalledWith('option1');

  // Test changing tag option
  fireEvent.change(tagSelect, { target: { value: 'Electronics' } });
  expect(onTagChangeMock).toHaveBeenCalledWith('Electronics');
});

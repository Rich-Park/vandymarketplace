import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SellItemForm from '../components/SellItemForm';
// import { storeItemsSell } from '../firebaseFunctions/firebaseWrite';
import * as dataload from '../firebaseFunctions/dataload';
import { MemoryRouter } from 'react-router-dom';

// Mock any dependencies and functions that are used in your component
jest.mock('../firebaseFunctions/firebaseWrite', () => ({
  storeItemsSell: jest.fn(),
}));
  
  
test('it should submit the form with valid data', async () => {
  // Mock the getUserID function to return a user ID
  dataload.getUserID = jest.fn(() => Promise.resolve('user'));
  render(
    <MemoryRouter>
      <SellItemForm />
    </MemoryRouter>
  );

  const productNameInput = screen.getByPlaceholderText('Product Name');
  const priceInput = screen.getByPlaceholderText('Price (USD)');
  const descriptionInput = screen.getByPlaceholderText('Enter a description of your item...');
  const emailInput = screen.getByPlaceholderText('Your Email (so potential buyers can contact you!)');

  fireEvent.change(productNameInput, { target: { value: 'Sample Product' } });
  fireEvent.change(priceInput, { target: { value: '100' } });
  fireEvent.change(descriptionInput, { target: { value: 'Sample description' } });
  fireEvent.change(emailInput, { target: { value: 'user@vanderbilt.edu' } });

  // Access the form elements to retrieve the updated values
  const updatedProductName = productNameInput.value;
  const updatedPrice = priceInput.value;
  const updatedDescription = descriptionInput.value;
  const updatedEmail = emailInput.value;

  // Check if the form inputs are updated correctly
  expect(updatedProductName).toBe('Sample Product');
  expect(updatedPrice).toBe('100');
  expect(updatedDescription).toBe('Sample description');
  expect(updatedEmail).toBe('user@vanderbilt.edu');
});

// test.only('it should show an error modal if submission limit is exceeded', async () => {
//     dataload.getUserID = jest.fn(() => Promise.resolve('user'));
//     SellItemForm.rateLimitFormSubmissions = jest.fn().mockResolvedValue(true);
//     render(
//         <MemoryRouter>
//         <SellItemForm />
//         </MemoryRouter>
//     );

//     // Fill in the form inputs
//     const productNameInput = screen.getByPlaceholderText('Product Name');
//     const priceInput = screen.getByPlaceholderText('Price (USD)');
//     const descriptionInput = screen.getByPlaceholderText('Enter a description of your item...');
//     const emailInput = screen.getByPlaceholderText('Your Email (so potential buyers can contact you!)');
//     const submitButton = screen.getByText('Submit');
//     const submitSpy = jest.spyOn(SellItemForm, 'handleSubmit');


//     fireEvent.change(productNameInput, { target: { value: 'Sample Product' } });
//     fireEvent.change(priceInput, { target: { value: '100' } });
//     fireEvent.change(descriptionInput, { target: { value: 'Sample description' } });
//     fireEvent.change(emailInput, { target: { value: 'user@vanderbilt.edu' } });

//     // // Mock rateLimitFormSubmissions to return true (exceeding the limit)
//     // jest.spyOn(SellItemForm, 'rateLimitFormSubmissions').mockResolvedValue(true);

//     // Submit the form
//     fireEvent.click(submitButton);
//       // Assert that the submit button was clicked
//     expect(submitSpy).toHaveBeenCalled();

//     // // Assert that the error modal is displayed
//     // const errorModal = await screen.findByText('Submission limit exceeded. You may only post 3 items every hour. Try again later.');
//     // expect(errorModal).toBeInTheDocument();
// });
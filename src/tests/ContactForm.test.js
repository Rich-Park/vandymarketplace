import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ContactForm from '../components/ContactForm';
import '@testing-library/jest-dom/extend-expect';
import { getUserID } from "../firebaseFunctions/dataload";


jest.mock("../firebaseFunctions/dataload");
jest.mock("../firebaseFunctions/firebaseWrite");

test('renders contact form', () => {
  const onClose = jest.fn();
  const sellerEmail = 'seller@example.com';
  const productName = 'Product 1';
  const productPrice = 100;
  const userEmail = 'user@example.com';
  const isOpen = true;

  render(
    <ContactForm
      onClose={onClose}
      sellerEmail={sellerEmail}
      productName={productName}
      productPrice={productPrice}
      userEmail={userEmail}
      isOpen={isOpen}
    />
  );

  // Check that the modal is open
  const modal = screen.getByRole('dialog');
  expect(modal).toBeInTheDocument();

  // Fill out the form fields
  const offerPriceInput = screen.getByLabelText('Offer Price');
  const messageInput = screen.getByLabelText('Message');

  fireEvent.change(offerPriceInput, { target: { value: '50' } });
  fireEvent.change(messageInput, { target: { value: 'Test message' } });

  expect(offerPriceInput).toHaveValue(50);
  expect(messageInput).toHaveValue('Test message');
});



test('ContactForm submits the form correctly', async () => {
  getUserID.mockResolvedValue("testUserId");
  const onClose = jest.fn(); // Mock the onClose function
  const sellerEmail = 'seller@example.com';
  const productName = 'Product Name';
  const productPrice = '100';
  const userEmail = 'user@example.com';

  // Mock the fetch function to simulate a successful response
  global.fetch = jest.fn();
  global.fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ message: 'Success' }),
    // You can add other properties if needed
  });

  render(
    <ContactForm isOpen={true} onClose={onClose} sellerEmail={sellerEmail} productName={productName} productPrice={productPrice} userEmail={userEmail} />
  );


  // Simulate user input
  const offerPriceInput = screen.getByLabelText('Offer Price');
  const messageTextarea = screen.getByLabelText('Message');

  fireEvent.change(offerPriceInput, { target: { value: '50' } });
  fireEvent.change(messageTextarea, { target: { value: 'I am interested' } });

  // Submit the form
  const submitButton = screen.getByText('Submit');
  fireEvent.click(submitButton);

  expect(offerPriceInput).toHaveValue(50);
  expect(messageTextarea).toHaveValue('I am interested');
  // Wait for the asynchronous code to finish (assuming it sends a request to the server)
  await waitFor(() => {
    expect(onClose).toHaveBeenCalledTimes(1); // onClose should be called after a successful form submission
    // Add more assertions as needed to check the behavior after form submission
  });
});
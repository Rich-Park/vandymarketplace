import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ContactForm from '../components/ContactForm';
import '@testing-library/jest-dom/extend-expect';

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

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/Auth/Login';

describe('Login Component', () => {
  test('renders login heading', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const heading = screen.getByText(/Login to Your Account/i);
    expect(heading).toBeInTheDocument();
  });
});

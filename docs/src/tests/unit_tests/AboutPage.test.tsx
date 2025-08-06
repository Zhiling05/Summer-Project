import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutPage from '../../pages/sidebar/AboutPage.tsx';

// Mock Header 组件
jest.mock('../../components/Header', () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));

describe('AboutPage Component', () => {
  test('renders header, section title, description and team list', () => {
    render(<AboutPage />);

    // Header
    expect(screen.getByTestId('header')).toHaveTextContent('About Us');
    expect(screen.getByRole('heading', { name: 'About Us Page' })).toBeInTheDocument();

    // Section title & description
    expect(screen.getByRole('heading', { name: 'DIPP Research Team' })).toBeInTheDocument();
    expect(
      screen.getByText(/The DIPP is led by a team of passionate researchers/i)
    ).toBeInTheDocument();

    // Team members
    expect(screen.getByRole('heading', { name: 'Team members:' })).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(8);
  });
});

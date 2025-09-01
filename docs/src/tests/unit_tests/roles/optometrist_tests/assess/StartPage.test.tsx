import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StartPage from '../../../../../pages/optometrist/assess/StartPage';

jest.mock('../../../../../components/Header', () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));

jest.mock('../../../../../components/BottomNav', () => () => (
  <div data-testid="bottom-nav">Bottom Navigation Loaded</div>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('StartPage Component', () => {
  test('renders Header, main content and BottomNav', () => {
    render(
      <MemoryRouter>
        <StartPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('header')).toHaveTextContent('Assessment');
    expect(screen.getByRole('heading', { name: 'Assessment' })).toBeInTheDocument();
    expect(
      screen.getByText(/This assessment can help determine appropriate referral recommendations/i)
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Start now' })).toBeInTheDocument();
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
  });

  test('navigate to first question on button click', () => {
    render(
      <MemoryRouter>
        <StartPage />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: 'Start now' });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('../questions/Q1');
  });
});
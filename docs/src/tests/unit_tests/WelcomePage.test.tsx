import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WelcomePage from '../../pages/WelcomePage';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.useFakeTimers();

describe('WelcomePage Component', () => {
  test('renders logos correctly', () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );

    expect(screen.getByAltText('NHS logo')).toBeInTheDocument();
    expect(screen.getByAltText('DIPP Study logo')).toBeInTheDocument();
  });

  test('navigates to select-role after animations', () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );

    expect(mockNavigate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(mockNavigate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);
    expect(mockNavigate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);
    expect(mockNavigate).toHaveBeenCalledWith('/select-role');
  });
});

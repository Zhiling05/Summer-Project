import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WelcomePage from '../../pages/WelcomePage';

// Mock useNavigate 钩子
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

    // 执行 zooming 到 hold 的定时器 (1000ms)
    jest.advanceTimersByTime(1000);
    expect(mockNavigate).not.toHaveBeenCalled();

    // 执行 hold 到 fadeout 的定时器 (2000ms)
    jest.advanceTimersByTime(2000);
    expect(mockNavigate).not.toHaveBeenCalled();

    // 执行 fadeout 到导航的定时器 (200ms)
    jest.advanceTimersByTime(200);
    expect(mockNavigate).toHaveBeenCalledWith('/select-role');
  });
});

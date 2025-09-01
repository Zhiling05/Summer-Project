import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GuideHome from '../../../../pages/optometrist/guide/GuideHome';

jest.mock('../../../../components/Header', () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));

jest.mock('../../../../components/BottomNav', () => () => (
  <div data-testid="bottom-nav">BottomNav</div>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe('GuideHome Component', () => {
  test('renders both cards and header', () => {
    render(
      <MemoryRouter>
        <GuideHome />
      </MemoryRouter>
    );

    expect(screen.getByTestId('header')).toHaveTextContent('Guide');
    expect(screen.getByText('Reference Image Gallery')).toBeInTheDocument();
    expect(screen.getByText('App Tutorial for Optometrists')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
  });

  test('navigates to gallery when gallery card clicked', () => {
    render(
      <MemoryRouter>
        <GuideHome />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Reference Image Gallery'));
    expect(mockNavigate).toHaveBeenCalledWith('gallery');
  });

  test('navigates to tutorial when tutorial card clicked', () => {
    render(
      <MemoryRouter>
        <GuideHome />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('App Tutorial for Optometrists'));
    expect(mockNavigate).toHaveBeenCalledWith('tutorial');
  });
});
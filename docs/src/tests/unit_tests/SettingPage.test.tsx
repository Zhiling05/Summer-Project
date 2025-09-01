import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from '../../pages/sidebar/SettingsPage';

// Mock Header
jest.mock('../../components/Header', () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));

// Mock FontSizeContext
const mockSetFontSize = jest.fn();
jest.mock('../../pages/sidebar/FontSizeContext', () => ({
  useFontSize: () => ({
    fontSize: '18px',
    setFontSize: mockSetFontSize,
  }),
}));

describe('SettingsPage Component', () => {
  test('renders header and font size buttons', () => {
    render(<SettingsPage />);

    expect(screen.getByTestId('header')).toHaveTextContent('Settings Page');
    expect(screen.getByRole('heading', { name: 'Settings Page' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Font Size' })).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred font size:')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Small' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Medium' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Large' })).toBeInTheDocument();
  });

  test('clicking font size buttons calls setFontSize with correct values', () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByText('Small'));
    expect(mockSetFontSize).toHaveBeenCalledWith('13px');

    fireEvent.click(screen.getByText('Medium'));
    expect(mockSetFontSize).toHaveBeenCalledWith('18px');

    fireEvent.click(screen.getByText('Large'));
    expect(mockSetFontSize).toHaveBeenCalledWith('24px');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserSelectionPage from '../../pages/UserSelectionPage';

// Mock Header and Sidebar
jest.mock('../../components/Header', () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));

jest.mock('../../components/SideBar', () => () => (
  <div data-testid="sidebar">Sidebar Loaded</div>
));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('UserSelectionPage Component', () => {
  test('renders header, sidebar, and all role cards', () => {
    render(
      <MemoryRouter>
        <UserSelectionPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('header')).toHaveTextContent('Select Role');
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Select Your Role' })).toBeInTheDocument();

    const roleTitles = [
      'I am a GP',
      'I am an Ophthalmology',
      'I am a Neurologist',
      'I am an Optometrist',
      'I am a Patient'
    ];

    roleTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  test('navigates correctly when role card is clicked', () => {
    render(
      <MemoryRouter>
        <UserSelectionPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('I am a GP'));
    expect(mockNavigate).toHaveBeenCalledWith('/gp');

    fireEvent.click(screen.getByText('I am an Optometrist'));
    expect(mockNavigate).toHaveBeenCalledWith('/optometrist/assess/start-page');

    fireEvent.click(screen.getByText('I am an Ophthalmology'));
    expect(mockNavigate).toHaveBeenCalledWith('/ophthalmology');

    fireEvent.click(screen.getByText('I am a Neurologist'));
    expect(mockNavigate).toHaveBeenCalledWith('/neurologist');

    fireEvent.click(screen.getByText('I am a Patient'));
    expect(mockNavigate).toHaveBeenCalledWith('/patient');
  });
});

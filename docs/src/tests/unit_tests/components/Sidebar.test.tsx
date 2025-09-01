import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SideBar from '../../../components/SideBar';

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
let mockLocation = { pathname: '/test', state: null };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

const renderWithRouter = (initialPath = '/test') => {
  mockLocation.pathname = initialPath;
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <SideBar />
    </MemoryRouter>
  );
};

describe('SideBar Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLocation = { pathname: '/test', state: null };
    document.removeEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  describe('Hamburger Button Visibility', () => {
    it('shows hamburger button on normal pages', () => {
      renderWithRouter('/optometrist/assess');
      
      expect(screen.getByLabelText('Open navigation')).toBeInTheDocument();
    });

    it('hides hamburger button on settings page', () => {
      renderWithRouter('/settings');
      
      expect(screen.queryByLabelText('Open navigation')).not.toBeInTheDocument();
    });

    it('hides hamburger button on contact-us page', () => {
      renderWithRouter('/contact-us');
      
      expect(screen.queryByLabelText('Open navigation')).not.toBeInTheDocument();
    });
  });

  describe('Sidebar Toggle Functionality', () => {
    it('opens sidebar when hamburger button is clicked', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      
      expect(screen.getByLabelText('Close navigation')).toBeInTheDocument();
      expect(document.querySelector('.sidebar.open')).toBeInTheDocument();
    });

    it('closes sidebar when hamburger button is clicked again', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      
    
      fireEvent.click(hamburgerBtn);
      expect(screen.getByLabelText('Close navigation')).toBeInTheDocument();
      
     
      const closeBtn = screen.getByLabelText('Close navigation');
      fireEvent.click(closeBtn);
      expect(screen.getByLabelText('Open navigation')).toBeInTheDocument();
    });

    it('shows overlay when sidebar is open', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      
      expect(document.querySelector('.sidebar-overlay')).toBeInTheDocument();
    });

    it('closes sidebar when overlay is clicked', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      
      const overlay = document.querySelector('.sidebar-overlay');
      expect(overlay).toBeInTheDocument();
      
      fireEvent.click(overlay!);
      expect(screen.getByLabelText('Open navigation')).toBeInTheDocument();
    });
  });

  describe('Sidebar Links', () => {
    it('renders settings and contact us links', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('links have correct href attributes', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      
      const settingsLink = screen.getByText('Settings').closest('a');
      const contactLink = screen.getByText('Contact Us').closest('a');
      
      expect(settingsLink).toHaveAttribute('href', '/settings');
      expect(contactLink).toHaveAttribute('href', '/contact-us');
    });
  });

  describe('Path Change Behavior', () => {
    it('closes sidebar when navigating to settings page', () => {
      const { rerender } = renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      expect(document.querySelector('.sidebar.open')).toBeInTheDocument();
      
      mockLocation.pathname = '/settings';
      rerender(
        <MemoryRouter initialEntries={['/settings']}>
          <SideBar />
        </MemoryRouter>
      );
      
      expect(document.querySelector('.sidebar.open')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Open navigation')).not.toBeInTheDocument();
    });

    it('closes sidebar when navigating to contact-us page', () => {
      const { rerender } = renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      fireEvent.click(hamburgerBtn);
      expect(document.querySelector('.sidebar.open')).toBeInTheDocument();
      
      mockLocation.pathname = '/contact-us';
      rerender(
        <MemoryRouter initialEntries={['/contact-us']}>
          <SideBar />
        </MemoryRouter>
      );
  
      expect(document.querySelector('.sidebar.open')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Open navigation')).not.toBeInTheDocument();
    });
  });


  describe('Hamburger Button State', () => {
    it('applies active class when sidebar is open', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      expect(hamburgerBtn).not.toHaveClass('active');
      
      fireEvent.click(hamburgerBtn);
      
      const activeBtn = screen.getByLabelText('Close navigation');
      expect(activeBtn).toHaveClass('active');
    });

    it('removes active class when sidebar is closed', () => {
      renderWithRouter('/test');
      
      const hamburgerBtn = screen.getByLabelText('Open navigation');
      
      fireEvent.click(hamburgerBtn);
      expect(screen.getByLabelText('Close navigation')).toHaveClass('active');
      
      const closeBtn = screen.getByLabelText('Close navigation');
      fireEvent.click(closeBtn);
      expect(screen.getByLabelText('Open navigation')).not.toHaveClass('active');
    });
  });
});
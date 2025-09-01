import { render, screen } from '@testing-library/react';
import ContactPage from '../../pages/sidebar/ContactPage';

jest.mock('../../components/Header', () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));

describe('ContactPage Component', () => {
  test('renders all contact sections and info', () => {
    render(<ContactPage />);

    // Header
    expect(screen.getByTestId('header')).toHaveTextContent('Contact Us');
    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();

    // Contact Information Section
    expect(screen.getByRole('heading', { name: 'Contact Information' })).toBeInTheDocument();
    expect(screen.getByText(/If you have any questions or need further assistance/i)).toBeInTheDocument();
    expect(screen.getByText(/http:\/\/XXXXXXXXX.com/)).toBeInTheDocument();
    expect(screen.getByText(/XXXXXXX@example.com/)).toBeInTheDocument();
    expect(screen.getByText('+1 (234) 567-890')).toBeInTheDocument();
    expect(screen.getByText(/1234 Research Lane/)).toBeInTheDocument();

    // Follow Us Section
    expect(screen.getByRole('heading', { name: 'Follow Us' })).toBeInTheDocument();
    expect(screen.getByText(/Stay updated with the latest news/i)).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();

    // Support Hours Section
    expect(screen.getByRole('heading', { name: 'Support Hours' })).toBeInTheDocument();
    expect(screen.getByText(/Our support team is available Monday through Friday/i)).toBeInTheDocument();
  });
});

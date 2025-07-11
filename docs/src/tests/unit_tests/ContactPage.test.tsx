import { render, screen } from '@testing-library/react';
import ContactPage from '../../pages/navigation/ContactPage';

describe('ContactPage', () => {
    it('renders without crashing', () => {
        render(<ContactPage />);
    });

    it('renders the correct heading', () => {
        render(<ContactPage />);
        const heading = screen.getByRole('heading', { name: /SettingsPage/i });
        expect(heading).toBeInTheDocument();
    });

    it('does not render unexpected elements', () => {
        render(<ContactPage />);
        expect(screen.queryByRole('heading', { name: /Contact/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<ContactPage />);
        expect(asFragment()).toMatchSnapshot();
    });
});

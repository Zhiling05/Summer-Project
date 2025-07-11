import { render, screen } from '@testing-library/react';
import AboutPage from '../../pages/navigation/AboutUsPage';

describe('AboutPage', () => {
    it('renders without crashing', () => {
        render(<AboutPage />);
        // throws error
    });

    it('renders the correct heading', () => {
        render(<AboutPage />);
        const heading = screen.getByRole('heading', { name: /SettingsPage/i });
        expect(heading).toBeInTheDocument();
    });

    it('does not render unexpected elements', () => {
        render(<AboutPage />);
        // no other headings...
        expect(screen.queryByRole('heading', { name: /About/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<AboutPage />);
        expect(asFragment()).toMatchSnapshot();
    });
});

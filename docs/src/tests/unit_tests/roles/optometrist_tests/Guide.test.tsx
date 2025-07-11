import { render, screen } from '@testing-library/react';
import Guide from '../../../../pages/optometrist/Guide';

describe('Guide', () => {
    it('renders without crashing', () => {
        render(<Guide />);
        // throws error if fail to render
    });

    it('renders the page title correctly', () => {
        render(<Guide />);
        const title = screen.getByRole('heading', { name: /Optometrist Guide Page/i });
        expect(title).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Guide />);
        expect(asFragment()).toMatchSnapshot();
    });
});

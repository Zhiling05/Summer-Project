import { render, screen } from '@testing-library/react';
import Records from '../../../../pages/optometrist/Records';

describe('Records', () => {
    it('renders without crashing', () => {
        render(<Records />);
        // throws error if fails to render
    });

    it('renders the correct page title', () => {
        render(<Records />);
        const title = screen.getByRole('heading', { name: /Optometrist Records Page/i });
        expect(title).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<Records />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('has no unexpected accessibility violations in heading', () => {
        render(<Records />);
        const heading = screen.getByRole('heading', { name: /Optometrist Records Page/i });
        expect(heading).toHaveAccessibleName('Optometrist Records Page');
    });
});

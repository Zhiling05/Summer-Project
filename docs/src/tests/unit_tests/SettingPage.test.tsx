import { render, screen } from '@testing-library/react';
import SettingsPage from '../../pages/sidebar/SettingsPage';

describe('SettingsPage', () => {
    it('renders without crashing', () => {
        render(<SettingsPage />);
    });

    it('renders the correct heading', () => {
        render(<SettingsPage />);
        const heading = screen.getByRole('heading', { name: /SettingsPage/i });
        expect(heading).toBeInTheDocument();
    });

    it('does not render unexpected elements', () => {
        render(<SettingsPage />);
        // no other elements expected
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<SettingsPage />);
        expect(asFragment()).toMatchSnapshot();
    });
});


// 未来等待测试项：设置项的list，buttons.....
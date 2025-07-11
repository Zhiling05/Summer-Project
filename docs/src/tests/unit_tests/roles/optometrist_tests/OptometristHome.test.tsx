import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import OptometristHome from '../../../../pages/optometrist/OptometristHome';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('OptometristHome', () => {
    beforeEach(() => {
        mockedNavigate.mockReset();
    });

    it('renders logos and page title', () => {
        render(
            <BrowserRouter>
                <OptometristHome />
            </BrowserRouter>
        );

        // test NHS logo
        expect(screen.getByAltText('NHS logo')).toBeInTheDocument();

        // test DIPP Study logo
        expect(screen.getByAltText('DIPP Study logo')).toBeInTheDocument();

        // test title line
        expect(screen.getByRole('heading', { name: /OptometristHome/i })).toBeInTheDocument();

        // test context lines
        expect(screen.getByText('context line 1')).toBeInTheDocument();
        expect(screen.getByText('context line 2')).toBeInTheDocument();
        expect(screen.getByText('context line 3')).toBeInTheDocument();
    });

    it('renders Access button and navigates on click', async () => {
        render(
            <BrowserRouter>
                <OptometristHome />
            </BrowserRouter>
        );

        const user = userEvent.setup();

        const accessButton = screen.getByRole('button', { name: /Access/i });
        expect(accessButton).toBeInTheDocument();

        await user.click(accessButton);
        expect(mockedNavigate).toHaveBeenCalledWith('assess/start-page');
    });
});

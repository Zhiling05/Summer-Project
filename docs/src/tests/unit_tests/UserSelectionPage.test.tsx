import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UserSelectionPage from '../../pages/UserSelectionPage';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('UserSelectionPage', () => {
    beforeEach(() => {
        mockedNavigate.mockReset();
    });

    it('renders logos and page title', () => {
        render(
            <BrowserRouter>
                <UserSelectionPage />
            </BrowserRouter>
        );


        expect(screen.getByAltText('NHS logo')).toBeInTheDocument();


        expect(screen.getByAltText('DIPP Study logo')).toBeInTheDocument();


        expect(screen.getByRole('heading', { name: /UserSelectionPage/i })).toBeInTheDocument();


        expect(screen.getByText('context line 1')).toBeInTheDocument();
        expect(screen.getByText('context line 2')).toBeInTheDocument();
        expect(screen.getByText('context line 3')).toBeInTheDocument();
    });

    it('renders three selection buttons and navigates on click', async () => {
        render(
            <BrowserRouter>
                <UserSelectionPage />
            </BrowserRouter>
        );

        const user = userEvent.setup();


        const doctorButton = screen.getByRole('button', { name: /Doctor/i });
        const optometristButton = screen.getByRole('button', { name: /Optometrist/i });
        const patientButton = screen.getByRole('button', { name: /Patient/i });

        expect(doctorButton).toBeInTheDocument();
        expect(optometristButton).toBeInTheDocument();
        expect(patientButton).toBeInTheDocument();


        await user.click(doctorButton);
        expect(mockedNavigate).toHaveBeenCalledWith('/gp');


        await user.click(optometristButton);
        expect(mockedNavigate).toHaveBeenCalledWith('/optometrist');


        await user.click(patientButton);
        expect(mockedNavigate).toHaveBeenCalledWith('/patient');
    });
});

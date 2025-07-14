import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WelcomePage from '../../pages/WelcomePage';
import { MemoryRouter } from 'react-router-dom';

// 模拟 useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));


describe('WelcomePage Component', () => {
    beforeEach(() => {
        mockNavigate.mockReset();
    });

    test('renders NHS and DIPP logos', () => {
        render(<WelcomePage />, { wrapper: MemoryRouter });

        const nhsLogo = screen.getByAltText('NHS logo');
        const dippLogo = screen.getByAltText('DIPP Study logo');

        expect(nhsLogo).toBeInTheDocument();
        expect(dippLogo).toBeInTheDocument();
    });

    test('logos are inside a responsive container for layout', () => {
        render(<WelcomePage />, { wrapper: MemoryRouter });

        const nhsLogo = screen.getByAltText('NHS logo');
        const dippLogo = screen.getByAltText('DIPP Study logo');

        expect(nhsLogo.parentElement).toHaveClass('nhs-header__inner');
        expect(dippLogo.parentElement).toHaveClass('nhs-header__inner');
    });

    test('renders the page title and context paragraphs', () => {
        render(<WelcomePage />, { wrapper: MemoryRouter });

        expect(screen.getByRole('heading', { name: 'WelcomePage' })).toBeInTheDocument();
        expect(screen.getByText('context line 1')).toBeInTheDocument();
        expect(screen.getByText('context line 2')).toBeInTheDocument();
        expect(screen.getByText('context line 3')).toBeInTheDocument();
    });

    test('renders Start now button and navigates on click', () => {
        render(<WelcomePage />, { wrapper: MemoryRouter });

        const button = screen.getByRole('button', { name: 'Start now' });
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith('/select-role');
    });
});

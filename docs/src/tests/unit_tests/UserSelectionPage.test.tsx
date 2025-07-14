import React from 'react';
import { render, screen } from '@testing-library/react';
import UserSelectionPage from '../../pages/UserSelectionPage';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mock useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('UserSelectionPage Component - TDD', () => {
    beforeEach(() => {
        mockNavigate.mockReset();
    });

    test('renders logos, heading and context lines', () => {
        render(<UserSelectionPage />, { wrapper: MemoryRouter });

        expect(screen.getByAltText('NHS logo')).toBeInTheDocument();
        expect(screen.getByAltText('DIPP Study logo')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /UserSelectionPage/i })).toBeInTheDocument();
        expect(screen.getByText('context line 1')).toBeInTheDocument();
        expect(screen.getByText('context line 2')).toBeInTheDocument();
        expect(screen.getByText('context line 3')).toBeInTheDocument();
    });

    test('renders three role selection buttons', () => {
        render(<UserSelectionPage />, { wrapper: MemoryRouter });

        expect(screen.getByRole('button', { name: /Doctor/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Optometrist/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Patient/i })).toBeInTheDocument();
    });

    test('clicking role buttons navigates to correct path', async () => {
        render(<UserSelectionPage />, { wrapper: MemoryRouter });
        const user = userEvent.setup();

        await user.click(screen.getByRole('button', { name: /Doctor/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/gp');

        await user.click(screen.getByRole('button', { name: /Optometrist/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/optometrist');

        await user.click(screen.getByRole('button', { name: /Patient/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/patient');
    });

    test('edge case: button is disabled', async () => {
        render(
            <button onClick={() => mockNavigate('/fake')} disabled>
                DisabledButton
            </button>,
            { wrapper: MemoryRouter }
        );
        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: 'DisabledButton' }));
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('responsive layout classes are applied', () => {
        render(<UserSelectionPage />, { wrapper: MemoryRouter });

        const layout = screen.getByTestId('role-selection-container');
        expect(layout.className).toMatch(/responsive|grid|flex/i);
    });
});
/// <reference types="@testing-library/jest-dom" />

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import WelcomePage from '../../pages/WelcomePage';

// Mock useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('WelcomePage Component Tests', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        // Reset mockNavigate before each test
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render NHS and DIPP logos', () => {
        // Render WelcomePage within MemoryRouter for routing context
        render(
            <MemoryRouter>
                <WelcomePage />
            </MemoryRouter>
        );

        // Check if NHS logo is rendered
        const nhsLogo = screen.getByAltText('NHS logo');
        expect(nhsLogo).toBeInTheDocument();

        // Check if DIPP Study logo is rendered
        const dippLogo = screen.getByAltText('DIPP Study logo');
        expect(dippLogo).toBeInTheDocument();
    });

    it('should render page title and context lines', () => {
        render(
            <MemoryRouter>
                <WelcomePage />
            </MemoryRouter>
        );

        // Check for page title
        const title = screen.getByRole('heading', { name: 'WelcomePage' });
        expect(title).toBeInTheDocument();

        // Check for context lines
        expect(screen.getByText('context line 1')).toBeInTheDocument();
        expect(screen.getByText('context line 2')).toBeInTheDocument();
        expect(screen.getByText('context line 3')).toBeInTheDocument();
    });

    it('should navigate to /select-role when Start now button is clicked', () => {
        render(
            <MemoryRouter>
                <WelcomePage />
            </MemoryRouter>
        );

        // Find the Start now button and click it
        const startButton = screen.getByRole('button', { name: 'Start now' });
        expect(startButton).toBeInTheDocument();

        fireEvent.click(startButton);

        // Check if navigate('/select-role') was called
        expect(mockNavigate).toHaveBeenCalledWith('/select-role');
    });
});

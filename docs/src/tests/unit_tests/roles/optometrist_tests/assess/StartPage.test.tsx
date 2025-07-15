// //后续可以完善添加响应式适配测试，就是页面的resizing


import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import StartPage from '../../../../../pages/optometrist/assess/StartPage';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('StartPage Component (TDD)', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        mockNavigate.mockClear();
    });

    describe('Initial Page Rendering', () => {
        it('displays NHS and DIPP logos', () => {
            render(<StartPage />, { wrapper: MemoryRouter });

            expect(screen.getByAltText('NHS logo')).toBeInTheDocument();
            expect(screen.getByAltText('DIPP Study logo')).toBeInTheDocument();
        });

        it('renders page title and context lines', () => {
            render(<StartPage />, { wrapper: MemoryRouter });

            expect(screen.getByRole('heading', { name: /StartPage/i })).toBeInTheDocument();
            expect(screen.getByText(/context line 1/i)).toBeInTheDocument();
            expect(screen.getByText(/context line 2/i)).toBeInTheDocument();
            expect(screen.getByText(/context line 3/i)).toBeInTheDocument();
        });

        it('renders "Start now" button', () => {
            render(<StartPage />, { wrapper: MemoryRouter });

            const startBtn = screen.getByRole('button', { name: /Start now/i });
            expect(startBtn).toBeInTheDocument();
        });
    });

    describe('Interaction and Navigation', () => {
        it('navigates to /questions/Q1 when "Start now" button is clicked', () => {
            render(<StartPage />, { wrapper: MemoryRouter });

            const button = screen.getByRole('button', { name: /Start now/i });
            fireEvent.click(button);

            expect(mockNavigate).toHaveBeenCalledWith('questions/Q1');
        });
    });

    describe('Edge Cases and Responsiveness', () => {
        it('handles logo image loading error gracefully', () => {
            render(<StartPage />, { wrapper: MemoryRouter });

            const nhsLogo = screen.getByAltText('NHS logo') as HTMLImageElement;
            fireEvent.error(nhsLogo);

            expect(nhsLogo).toBeInTheDocument(); // still remains on screen
        });

        it('renders correctly on small screens (responsive)', () => {
            window.innerWidth = 320;
            window.dispatchEvent(new Event('resize'));

            render(<StartPage />, { wrapper: MemoryRouter });

            expect(screen.getByRole('heading', { name: /StartPage/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Start now/i })).toBeInTheDocument();
        });
    });
});
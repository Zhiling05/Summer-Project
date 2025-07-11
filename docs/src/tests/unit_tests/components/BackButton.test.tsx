import React from 'react';
// import { Mock } from 'jest-mock';
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '../../../components/BackButton';
import '@testing-library/jest-dom';



import { useNavigate } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // mock useNavigate
    useNavigate: jest.fn(),
}));

describe('BackButton components testing', () => {
    // reset mockNavigate before each testing
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('BackButton should render correctly', () => {
        render(<BackButton />);
        // check button
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        // check text on the button
        expect(button).toHaveTextContent('← Go back');
    });

    it('Clicking the button should call navigate(-1)', () => {
        render(<BackButton />);
        const button = screen.getByRole('button');
        // mock user click
        fireEvent.click(button);
        // check whether navigate(-1) has been called
        expect(mockNavigate).toHaveBeenCalledWith(-1);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
});

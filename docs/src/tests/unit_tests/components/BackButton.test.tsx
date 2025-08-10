import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BackButton from '../../../components/BackButton';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('BackButton Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('calls navigate(-1) when clicked', () => {
    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>
    );
    
    const button = screen.getByText('← Go back');
    fireEvent.click(button);
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
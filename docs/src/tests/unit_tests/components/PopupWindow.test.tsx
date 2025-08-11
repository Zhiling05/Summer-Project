import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../../../components/PopupWindow';

describe('ConfirmModal Component', () => {
  const mockOnContinue = jest.fn();
  const mockOnRestart = jest.fn();

  beforeEach(() => {
    mockOnContinue.mockClear();
    mockOnRestart.mockClear();
  });

  // 1. 条件渲染测试
  describe('Conditional Rendering', () => {
    it('renders when open is true', () => {
      render(
        <ConfirmModal 
          open={true} 
          onContinue={mockOnContinue} 
          onRestart={mockOnRestart} 
        />
      );
      
      expect(screen.getByText('Unfinished Assessmemt')).toBeInTheDocument();
      expect(screen.getByText('Unfinished assessment detected. Would you like to continue or start over?')).toBeInTheDocument();
    });

    it('does not render when open is false', () => {
      render(
        <ConfirmModal 
          open={false} 
          onContinue={mockOnContinue} 
          onRestart={mockOnRestart} 
        />
      );
      
      expect(screen.queryByText('Unfinished Assessmemt')).not.toBeInTheDocument();
    });
  });

  // 2. 按钮渲染测试
  describe('Button Rendering', () => {
    it('renders both continue and restart buttons', () => {
      render(
        <ConfirmModal 
          open={true} 
          onContinue={mockOnContinue} 
          onRestart={mockOnRestart} 
        />
      );
      
      expect(screen.getByText('continue')).toBeInTheDocument();
      expect(screen.getByText('restart')).toBeInTheDocument();
    });
  });

  // 3. 点击事件处理测试
  describe('Click Event Handling', () => {
    it('calls onContinue when continue button is clicked', () => {
      render(
        <ConfirmModal 
          open={true} 
          onContinue={mockOnContinue} 
          onRestart={mockOnRestart} 
        />
      );
      
      const continueBtn = screen.getByText('continue');
      fireEvent.click(continueBtn);
      
      expect(mockOnContinue).toHaveBeenCalledTimes(1);
      expect(mockOnRestart).not.toHaveBeenCalled();
    });

    it('calls onRestart when restart button is clicked', () => {
      render(
        <ConfirmModal 
          open={true} 
          onContinue={mockOnContinue} 
          onRestart={mockOnRestart} 
        />
      );
      
      const restartBtn = screen.getByText('restart');
      fireEvent.click(restartBtn);
      
      expect(mockOnRestart).toHaveBeenCalledTimes(1);
      expect(mockOnContinue).not.toHaveBeenCalled();
    });
  });

});
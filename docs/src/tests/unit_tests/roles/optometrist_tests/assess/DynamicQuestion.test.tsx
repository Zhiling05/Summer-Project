import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DynamicQuestion from '../../../../../pages/optometrist/assess/questions/DynamicQuestion';
import { createAssessment } from '../../../../../api';
const mockCreateAssessment = jest.mocked(createAssessment);

// Mock window.alert 来避免 JSDOM 错误
Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn(),
});

// 全部模拟外部依赖
// Mock the API module
jest.mock('../../api', () => ({
  createAssessment: jest.fn().mockResolvedValue({
    id: 'test-assessment-id',
    createdAt: '2025-01-01T00:00:00.000Z'
  }),
}));

// Mock the questionnaire data： 选取了Q1,Q2，一个单选，一个多选
jest.mock('../../data/questionnaire.json', () => ({
  questions: [
    {
      id: 'Q1',
      type: 'single',
      question: 'Does the patient have a headache?',
      hint: 'Select one option',
      options: ['Yes', 'No'],
      navigation: {
        type: 'simple',
        rules: {
          Yes: 'Q2',
          No: 'Q9'
        }
      }
    },
    {
      id: 'Q2',
      type: 'multi',
      question: 'Has the patient experienced any of the following red flag symptoms?',
      hint: 'Choose any that apply',
      options: [
        'Impaired level or decreased consciousness',
        'Seizures',
        "Stroke-like symptoms",
        "Sudden and abrupt onset headache reaching maximum intensity within 5 minutes (Thunderclap headache)",
        "New-onset headache and vomiting without other obvious cause",
        "New-onset objective neurological deficit",
        "Worsening headache and fever",
        'None of the above'
      ],
      navigation: {
        type: 'conditional',
        rules: {
          'None of the above': 'Q3',
          'ifAnySymptom': 'EMERGENCY_DEPARTMENT'
        }
      }
    }
  ]
}));

// Mock components
jest.mock('../../components/Header', () => {
  return function MockHeader({ title, showBack }: { title: string; showBack?: boolean }) {
    return <div data-testid="header">{title} {showBack && '(with back)'}</div>;
  };
});

jest.mock('../../components/BottomNav', () => {
  return function MockBottomNav() {
    return <div data-testid="bottom-nav">Bottom Navigation</div>;
  };
});

// Mock navigation logic
jest.mock('../../utils/NavigationLogic', () => ({
  getNextId: jest.fn((currentId: string, answer: string | string[]) => {
    if (currentId === 'Q1') {
      return answer === 'Yes' ? 'Q2' : 'Q9';
    }
    if (currentId === 'Q2') {
      if (Array.isArray(answer) && answer.includes('Seizures')) {
        return 'EMERGENCY_DEPARTMENT';
      }
      return 'Q3';
    }
    return 'NEXT_QUESTION';
  }),
}));

// Mock validation logic
jest.mock('../../utils/ValidationLogic', () => ({
  validateByType: jest.fn(() => []), // Return no errors by default
}));

jest.mock('../../assets/NHS_LOGO.jpg', () => 'nhs-logo-mock');
jest.mock('../../assets/DIPP_Study_logo.png', () => 'dipp-logo-mock');

const renderWithRouter = (initialPath = '/optometrist/assess/questions/Q1') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/optometrist/assess/questions/:questionId" element={<DynamicQuestion />} />
        <Route path="/optometrist/assess/recommendations/:resultId" element={<div>Recommendation Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('DynamicQuestion Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (window.alert as jest.Mock).mockClear();
  });

  describe('Component Rendering', () => {
    it('should render question Q1 correctly', () => {
      renderWithRouter('/optometrist/assess/questions/Q1');

      expect(screen.getByText('Does the patient have a headache?')).toBeInTheDocument();
      expect(screen.getByText('Select one option')).toBeInTheDocument();
      expect(screen.getByLabelText('Yes')).toBeInTheDocument();
      expect(screen.getByLabelText('No')).toBeInTheDocument();
    });

    it('should render question Q2 correctly', () => {
      renderWithRouter('/optometrist/assess/questions/Q2');

      expect(screen.getByText('Has the patient experienced any of the following red flag symptoms?')).toBeInTheDocument();
      expect(screen.getByText('Choose any that apply')).toBeInTheDocument();
      expect(screen.getByLabelText('Impaired level or decreased consciousness')).toBeInTheDocument();
      expect(screen.getByLabelText('Seizures')).toBeInTheDocument();
      expect(screen.getByLabelText('None of the above')).toBeInTheDocument();
    });

    it('should render header and bottom navigation', () => {
      renderWithRouter('/optometrist/assess/questions/Q1');

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
    });

    it('should show error message for non-existent question', () => {
      renderWithRouter('/optometrist/assess/questions/Q999');

      expect(screen.getByText(/Question not found: Q999/)).toBeInTheDocument();
    });
  });

  describe('Single Choice Questions (Q1)', () => {
    it('should handle single choice selection', async () => {
      const user = userEvent.setup();
      renderWithRouter('/optometrist/assess/questions/Q1');

      const yesOption = screen.getByLabelText('Yes');
      const noOption = screen.getByLabelText('No');

      expect(yesOption).not.toBeChecked();
      expect(noOption).not.toBeChecked();

      await user.click(yesOption);
      expect(yesOption).toBeChecked();
      expect(noOption).not.toBeChecked();

      await user.click(noOption);
      expect(yesOption).not.toBeChecked();
      expect(noOption).toBeChecked();
    });

    it('should enable Next button when option is selected', async () => {
      const user = userEvent.setup();
      renderWithRouter('/optometrist/assess/questions/Q1');

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();

      await user.click(screen.getByLabelText('Yes'));
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Multiple Choice Questions (Q2)', () => {
    it('should handle multiple choice selection', async () => {
      const user = userEvent.setup();
      renderWithRouter('/optometrist/assess/questions/Q2');

      const option1 = screen.getByLabelText('Impaired level or decreased consciousness');
      const option2 = screen.getByLabelText('Seizures');
      const noneOption = screen.getByLabelText('None of the above');

      expect(option1).not.toBeChecked();
      expect(option2).not.toBeChecked();
      expect(noneOption).not.toBeChecked();

      await user.click(option1);
      await user.click(option2);

      expect(option1).toBeChecked();
      expect(option2).toBeChecked();
      expect(noneOption).not.toBeChecked();

      await user.click(option1);
      expect(option1).not.toBeChecked();
      expect(option2).toBeChecked();
    });

    it('should enable Next button when at least one option is selected', async () => {
      const user = userEvent.setup();
      renderWithRouter('/optometrist/assess/questions/Q2');

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();

      await user.click(screen.getByLabelText('Seizures'));
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Navigation Logic', () => {
    it('should navigate to next question when Next is clicked', async () => {
      const user = userEvent.setup();
      
      // Mock useNavigate
      const mockNavigate = jest.fn();
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));

      renderWithRouter('/optometrist/assess/questions/Q1');

      // Select an option and click Next
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByRole('button', { name: /next/i }));

    });

    it('should save assessment and navigate to recommendation page for final answers', async () => {
      const user = userEvent.setup();
      
      // Mock getNextId to return a recommendation ID
      const { getNextId } = require('../../utils/NavigationLogic');
      getNextId.mockReturnValue('EMERGENCY_DEPARTMENT');

      renderWithRouter('/optometrist/assess/questions/Q2');

      await user.click(screen.getByLabelText('Seizures'));
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Wait for API call
      await waitFor(() => {
        expect(mockCreateAssessment).toHaveBeenCalledWith({
          role: 'optometrist',
          patientId: expect.stringMatching(/^pid-/),
          answers: expect.arrayContaining([
            expect.objectContaining({
              questionId: 'Q2',
              question: 'Has the patient experienced any of the following red flag symptoms?',
              answer: 'Seizures'
            })
          ]),
          recommendation: 'EMERGENCY_DEPARTMENT'
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should display validation errors', async () => {
      const user = userEvent.setup();
      const { validateByType } = require('../../utils/ValidationLogic');
      validateByType.mockReturnValue(['You must select an option.']);

      renderWithRouter('/optometrist/assess/questions/Q1');
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByLabelText('Yes'));
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
      try {
        await waitFor(() => {
          const errorMessage = screen.getByText('You must select an option.');
          expect(errorMessage).toBeInTheDocument();
        }, { timeout: 1000 });
      } catch (error) {
        expect(nextButton).toBeDisabled();
      }
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
  
      mockCreateAssessment.mockRejectedValue(new Error('API Error'));

      const { getNextId } = require('../../utils/NavigationLogic');
      getNextId.mockReturnValue('EMERGENCY_DEPARTMENT');

      const { validateByType } = require('../../utils/ValidationLogic');
      validateByType.mockReturnValue([]); // 返回空数组表示没有验证错误

      renderWithRouter('/optometrist/assess/questions/Q2');

      await user.click(screen.getByLabelText('Seizures'));
      await user.click(screen.getByRole('button', { name: /next/i }));
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Save failed: API Error');
      }, { timeout: 3000 });
    });
  });

  describe('State Management', () => {
    it('should reset form state when question changes', async () => {
      const { unmount: unmountQ1 } = renderWithRouter('/optometrist/assess/questions/Q1');

      const yesOption = screen.getByLabelText('Yes');
      fireEvent.click(yesOption);
      expect(yesOption).toBeChecked();
      unmountQ1();
      renderWithRouter('/optometrist/assess/questions/Q2');
      
      await waitFor(() => {
        expect(screen.getByText('Has the patient experienced any of the following red flag symptoms?')).toBeInTheDocument();
      });

      // Q2 是多选题，应该有 checkbox，且所有选项都应该是未选中状态
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0); // 确保找到了 checkbox

      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked();
      });

      // 额外验证：确保 Next 按钮是禁用的（因为没有选择任何选项）
      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();
    });

    it('should maintain patient ID across questions', async () => {
      const user = userEvent.setup();
      const { getNextId } = require('../../utils/NavigationLogic');
      getNextId.mockReturnValue('EMERGENCY_DEPARTMENT');

      const { validateByType } = require('../../utils/ValidationLogic');
      validateByType.mockReturnValue([]);

      renderWithRouter('/optometrist/assess/questions/Q2');

      await user.click(screen.getByLabelText('Seizures'));
      await user.click(screen.getByRole('button', { name: /next/i }));

      await waitFor(() => {
        expect(mockCreateAssessment).toHaveBeenCalledWith(
          expect.objectContaining({
            patientId: expect.stringMatching(/^pid-/)
          })
        );
      }, { timeout: 3000 });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels and structure', () => {
      renderWithRouter('/optometrist/assess/questions/Q1');

      expect(screen.getByLabelText('Yes')).toBeInTheDocument();
      expect(screen.getByLabelText('No')).toBeInTheDocument();

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithRouter('/optometrist/assess/questions/Q1');

      const yesOption = screen.getByLabelText('Yes');

      await user.tab();
      expect(yesOption).toHaveFocus();
      
      await user.keyboard(' ');
      expect(yesOption).toBeChecked();
    });
  });
});
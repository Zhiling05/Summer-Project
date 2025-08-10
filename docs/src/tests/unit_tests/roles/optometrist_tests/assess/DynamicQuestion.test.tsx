import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DynamicQuestion from '../../../../../pages/optometrist/assess/questions/DynamicQuestion';

// Mock 外部依赖
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../../../api', () => ({
  createAssessment: jest.fn().mockResolvedValue({
    id: 'test-assessment-id',
    createdAt: '2025-01-01T00:00:00.000Z'
  }),
}));

// Mock 问卷数据 - 只包含测试必需的
jest.mock('../../../../../data/questionnaire.json', () => ({
  questions: [
    {
      id: 'Q1',
      type: 'single',
      question: 'Does the patient have a headache?',
      hint: 'Select one option',
      options: ['Yes', 'No'],
      navigation: {
        type: 'simple',
        rules: { Yes: 'Q2', No: 'Q9' }
      }
    },
    {
      id: 'Q2',
      type: 'multi',
      question: 'Has the patient experienced any red flag symptoms?',
      hint: 'Choose any that apply',
      options: ['Seizures', 'None of the above'],
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

// Mock 导航逻辑
jest.mock('../../../../../utils/NavigationLogic', () => ({
  getNextId: jest.fn((currentId: string, answer: string | string[]) => {
    if (currentId === 'Q1') return answer === 'Yes' ? 'Q2' : 'Q9';
    if (currentId === 'Q2') {
      return Array.isArray(answer) && answer.includes('Seizures') 
        ? 'EMERGENCY_DEPARTMENT' 
        : 'Q3';
    }
    return 'NEXT_QUESTION';
  }),
}));

// Mock 验证逻辑
jest.mock('../../../../../utils/ValidationLogic', () => ({
  validateByType: jest.fn(() => []), // 默认无错误
}));

// Mock 组件
jest.mock('../../../../../components/Header', () => 
  ({ title }: { title: string }) => <div data-testid="header">{title}</div>
);
jest.mock('../../../../../components/BottomNav', () => 
  () => <div data-testid="bottom-nav">Bottom Navigation</div>
);
jest.mock('../../../../../components/BackButton', () => 
  () => <div data-testid="back-button">← Go back</div>
);

const renderWithRouter = (questionId = 'Q1') => {
  return render(
    <MemoryRouter initialEntries={[`/optometrist/assess/questions/${questionId}`]}>
      <Routes>
        <Route path="/optometrist/assess/questions/:questionId" element={<DynamicQuestion />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('DynamicQuestion Component', () => {
  const mockCreateAssessment = require('../../../../../api').createAssessment;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. 基础渲染测试
  describe('Basic Rendering', () => {
    it('renders single choice question correctly', () => {
      renderWithRouter('Q1');

      expect(screen.getByText('Does the patient have a headache?')).toBeInTheDocument();
      expect(screen.getByText('Select one option')).toBeInTheDocument();
      expect(screen.getByLabelText('Yes')).toBeInTheDocument();
      expect(screen.getByLabelText('No')).toBeInTheDocument();
    });

    it('renders multiple choice question correctly', () => {
      renderWithRouter('Q2');

      expect(screen.getByText('Has the patient experienced any red flag symptoms?')).toBeInTheDocument();
      expect(screen.getByLabelText('Seizures')).toBeInTheDocument();
      expect(screen.getByLabelText('None of the above')).toBeInTheDocument();
    });

    it('shows error for non-existent question', () => {
      renderWithRouter('Q999');
      expect(screen.getByText(/Question not found: Q999/)).toBeInTheDocument();
    });

    it('renders all required UI components', () => {
      renderWithRouter('Q1');
      
      // 验证所有被 DynamicQuestion 渲染的组件都存在
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });
  });

  // 2. 单选题交互测试
  describe('Single Choice Interaction', () => {
    it('handles option selection correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter('Q1');

      const yesOption = screen.getByLabelText('Yes');
      const noOption = screen.getByLabelText('No');

      // 初始状态：都未选中
      expect(yesOption).not.toBeChecked();
      expect(noOption).not.toBeChecked();

      // 选择 Yes
      await user.click(yesOption);
      expect(yesOption).toBeChecked();
      expect(noOption).not.toBeChecked();

      // 切换到 No
      await user.click(noOption);
      expect(yesOption).not.toBeChecked();
      expect(noOption).toBeChecked();
    });

    it('enables Next button when option is selected', async () => {
      const user = userEvent.setup();
      renderWithRouter('Q1');

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();

      await user.click(screen.getByLabelText('Yes'));
      expect(nextButton).not.toBeDisabled();
    });
  });

  // 3. 多选题交互测试
  describe('Multiple Choice Interaction', () => {
    it('handles multiple selections correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter('Q2');

      const seizuresOption = screen.getByLabelText('Seizures');
      const noneOption = screen.getByLabelText('None of the above');

      // 可以选择多个选项
      await user.click(seizuresOption);
      await user.click(noneOption);

      expect(seizuresOption).toBeChecked();
      expect(noneOption).toBeChecked();

      // 可以取消选择
      await user.click(seizuresOption);
      expect(seizuresOption).not.toBeChecked();
      expect(noneOption).toBeChecked();
    });

    it('enables Next button when any option is selected', async () => {
      const user = userEvent.setup();
      renderWithRouter('Q2');

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();

      await user.click(screen.getByLabelText('Seizures'));
      expect(nextButton).not.toBeDisabled();
    });
  });

  // 4. 导航功能测试
  describe('Navigation', () => {
    it('navigates to next question for regular answers', async () => {
      const user = userEvent.setup();
      renderWithRouter('Q1');

      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByRole('button', { name: /next/i }));

      expect(mockNavigate).toHaveBeenCalledWith(
        '/optometrist/assess/questions/Q2',
        expect.any(Object)
      );
    });

    it('saves assessment and navigates to recommendation for final answers', async () => {
      const user = userEvent.setup();
      renderWithRouter('Q2');

      await user.click(screen.getByLabelText('Seizures'));
      await user.click(screen.getByRole('button', { name: /next/i }));

      await waitFor(() => {
        expect(mockCreateAssessment).toHaveBeenCalledWith(
          expect.objectContaining({
            role: 'optometrist',
            recommendation: 'EMERGENCY_DEPARTMENT'
          })
        );
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        '/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT/test-assessment-id',
        expect.any(Object)
      );
    });
  });

  // 5. 错误处理测试
  describe('Error Handling', () => {
    it('displays validation errors when present', async () => {
      const { validateByType } = require('../../../../../utils/ValidationLogic');
      validateByType.mockReturnValue(['You must select an option.']);

      const user = userEvent.setup();
      renderWithRouter('Q1');

      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByRole('button', { name: /next/i }));

      expect(screen.getByText('You must select an option.')).toBeInTheDocument();
    });
  });

  // 6. 状态重置测试
  describe('State Management', () => {
    it('resets form state when question changes', () => {
      // 先渲染Q2并选择一个选项
      const { unmount } = renderWithRouter('Q2');
      
      fireEvent.click(screen.getByLabelText('Seizures'));
      expect(screen.getByLabelText('Seizures')).toBeChecked();
      
      // 卸载Q2组件
      unmount();
      
      // 重新渲染Q1
      renderWithRouter('Q1');

      // Q1的所有选项应该都是未选中状态
      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach(radio => {
        expect(radio).not.toBeChecked();
      });
      
      // 验证Next按钮是禁用的（因为没有选择任何选项）
      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();
    });
  });
});
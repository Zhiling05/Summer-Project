import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PreviewReport from '../../../../../pages/optometrist/assess/recommendations/PreviewReport';

// Mock the API functions
jest.mock('../../../../../api', () => ({
  fetchReportText: jest.fn(),
  getAssessment: jest.fn(),
}));

const { fetchReportText, getAssessment } = require('../../../../../api');

// Mock components
jest.mock('../../../../../components/Header', () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));
jest.mock('../../../../../components/BottomNav', () => () => (
  <div data-testid="bottom-nav">BottomNav</div>
));
jest.mock('../../../../../components/SideBar', () => () => (
  <div data-testid="sidebar">Sidebar</div>
));

const renderWithRouter = (initialPath = '/preview/rec-123', state?: any) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: initialPath, state }]}>
      <Routes>
        <Route path="/preview/:id" element={<PreviewReport />} />
        <Route path="/preview/" element={<PreviewReport />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PreviewReport Component', () => {
  const mockReportText = `Assessment rec-123
Date      : 2025-01-15T10:30:00Z
Role      : optometrist
----------------------------------------
Q1: Does the patient have a headache?
Answer    : Yes

Q2: Has the patient experienced any red flag symptoms?
Answer    : Seizures, Stroke-like symptoms
----------------------------------------
Symptoms:
- Headache
- Seizures
- Stroke-like symptoms
----------------------------------------
Recommendation: Send patient to Emergency Department immediately`;

  const mockAssessmentDetail = {
    id: 'rec-123',
    recommendation: 'EMERGENCY_DEPARTMENT',
    role: 'optometrist',
    patientId: 'patient-123',
    answers: [
      {
        questionId: 'Q1',
        question: 'Does the patient have a headache?',
        answer: 'Yes'
      },
      {
        questionId: 'Q2', 
        question: 'Has the patient experienced any red flag symptoms?',
        answer: 'Seizures, Stroke-like symptoms'
      }
    ],
    createdAt: '2025-01-15T10:30:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. 基础渲染测试
  describe('Basic Rendering', () => {
    it('renders loading state when data is being fetched', () => {
      fetchReportText.mockImplementation(() => new Promise(() => {})); // Never resolves
      getAssessment.mockImplementation(() => new Promise(() => {}));

      renderWithRouter();

      expect(screen.getByText('Loading…')).toBeInTheDocument();
    });

    it('renders all required UI components when data is loaded', async () => {
      fetchReportText.mockResolvedValue(mockReportText);
      getAssessment.mockResolvedValue(mockAssessmentDetail);

      renderWithRouter();

      await waitFor(() => {
        // 验证所有被 PreviewReport 渲染的组件都存在
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });

    it('renders header with correct title when data is loaded', async () => {
      fetchReportText.mockResolvedValue(mockReportText);
      getAssessment.mockResolvedValue(mockAssessmentDetail);

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('header')).toHaveTextContent('Assessment Report');
      });
    });

    it('does not load data when no ID is provided', () => {
      renderWithRouter('/preview/');

      expect(fetchReportText).not.toHaveBeenCalled();
      expect(getAssessment).not.toHaveBeenCalled();
    });
  });

  // 2. 数据加载和显示测试
  describe('Data Loading and Display', () => {
    it('loads data from API when no state is provided', async () => {
      fetchReportText.mockResolvedValue(mockReportText);
      getAssessment.mockResolvedValue(mockAssessmentDetail);

      renderWithRouter();

      await waitFor(() => {
        expect(fetchReportText).toHaveBeenCalledWith('rec-123');
        expect(getAssessment).toHaveBeenCalledWith('rec-123');
      });
    });

    it('uses state data when provided', async () => {
      getAssessment.mockResolvedValue(mockAssessmentDetail);

      renderWithRouter('/preview/rec-123', { text: mockReportText });

      await waitFor(() => {
        expect(fetchReportText).not.toHaveBeenCalled();
        expect(getAssessment).toHaveBeenCalledWith('rec-123');
      });
    });

    it('handles LOCAL preview correctly', async () => {
      const localState = {
        answers: [{ questionId: 'Q1', answer: 'Yes' }],
        recommendation: 'EMERGENCY_DEPARTMENT'
      };

      renderWithRouter('/preview/LOCAL', localState);

      await waitFor(() => {
        expect(screen.getByText(/LOCAL PREVIEW/)).toBeInTheDocument();
        expect(fetchReportText).not.toHaveBeenCalled();
        expect(getAssessment).not.toHaveBeenCalled();
      });
    });

    it('renders all report cards with correct data', async () => {
      fetchReportText.mockResolvedValue(mockReportText);
      getAssessment.mockResolvedValue(mockAssessmentDetail);

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('Basic information')).toBeInTheDocument();
        expect(screen.getByText('Question responses')).toBeInTheDocument();
        expect(screen.getByText('Patient symptoms')).toBeInTheDocument();
        expect(screen.getByText('Recommendation')).toBeInTheDocument();
      });

      // Check specific content
      expect(screen.getByText(/Assessment rec-123/)).toBeInTheDocument();
      expect(screen.getByText(/Date.*2025-01-15/)).toBeInTheDocument();
      expect(screen.getByText(/Q1: Does the patient have a headache/)).toBeInTheDocument();
      expect(screen.getByText(/- Headache/)).toBeInTheDocument();
      expect(screen.getByText(/Send patient to Emergency Department/)).toBeInTheDocument();
    });
  });

  // 3. 文本解析和卡片显示测试
  describe('Text Parsing and Card Display', () => {
    beforeEach(() => {
      fetchReportText.mockResolvedValue(mockReportText);
      getAssessment.mockResolvedValue(mockAssessmentDetail);
    });

    it('handles report without symptoms section', async () => {
      const reportWithoutSymptoms = `Assessment rec-124
Date      : 2025-01-15T10:30:00Z
Role      : optometrist
----------------------------------------
Q1: Does the patient have other visual symptoms?
Answer    : No
----------------------------------------
Recommendation: No referral required`;

      fetchReportText.mockResolvedValue(reportWithoutSymptoms);
      getAssessment.mockResolvedValue({
        id: 'rec-124',
        recommendation: 'NO_REFERRAL',
        role: 'optometrist',
        patientId: 'patient-124',
        answers: [
          {
            questionId: 'Q1',
            question: 'Does the patient have other visual symptoms?',
            answer: 'No'
          }
        ],
        createdAt: '2025-01-15T10:30:00Z'
      });

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('Basic information')).toBeInTheDocument();
        expect(screen.getByText('Question responses')).toBeInTheDocument();
        expect(screen.queryByText('Patient symptoms')).not.toBeInTheDocument();
        expect(screen.getByText('Recommendation')).toBeInTheDocument();
      });
    });
  });

  // 4. 颜色映射测试
  describe('Color Mapping', () => {
    const colorTestCases = [
      { recommendation: 'EMERGENCY_DEPARTMENT', expectedColor: 'report-red' },
      { recommendation: 'IMMEDIATE', expectedColor: 'report-red' },
      { recommendation: 'URGENT_TO_OPH', expectedColor: 'report-orange' },
      { recommendation: 'URGENT_TO_GP_OR_NEUR', expectedColor: 'report-orange' },
      { recommendation: 'TO_GP', expectedColor: 'report-green' },
      { recommendation: 'NO_REFERRAL', expectedColor: 'report-green' }
    ];

    colorTestCases.forEach(({ recommendation, expectedColor }) => {
      it(`applies ${expectedColor} class for ${recommendation}`, async () => {
        fetchReportText.mockResolvedValue(mockReportText);
        getAssessment.mockResolvedValue({
          id: 'test-id',
          recommendation,
          role: 'optometrist',
          patientId: 'patient-test',
          answers: [],
          createdAt: '2025-01-15T10:30:00Z'
        });

        renderWithRouter();

        await waitFor(() => {
          const cards = screen.getAllByRole('article');
          cards.forEach(card => {
            expect(card).toHaveClass(expectedColor);
          });
        });
      });
    });
  });

  // 5. 错误处理测试  
  describe('Error Handling', () => {
    it('displays error message when fetchReportText fails', async () => {
      fetchReportText.mockRejectedValue(new Error('Network error'));
      getAssessment.mockRejectedValue(new Error('Network error'));

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
      });
    });

    it('displays error message when getAssessment fails', async () => {
      fetchReportText.mockResolvedValue(mockReportText);
      getAssessment.mockRejectedValue(new Error('Assessment not found'));

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText(/Error: Assessment not found/)).toBeInTheDocument();
      });
    });

    it('handles assessment detail without recommendation field', async () => {
      fetchReportText.mockResolvedValue(mockReportText);
      // Use type assertion to test the edge case where recommendation might be missing
      getAssessment.mockResolvedValue({
        id: 'test-id',
        role: 'optometrist',
        patientId: 'patient-test',
        answers: [],
        createdAt: '2025-01-15T10:30:00Z'
      } as any); // Type assertion to bypass TypeScript checking

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('header')).toBeInTheDocument();
        const cards = screen.getAllByRole('article');
        cards.forEach(card => {
          expect(card).toHaveClass('report-green'); // Should default to green when no recommendation
        });
      });
    });
  });
});
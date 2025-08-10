import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PreviewReport from '../../../../../pages/optometrist/assess/recommendations/PreviewReport';
import * as api from '../../../../../api';

// Define types to match the actual interfaces
type UserRole = 'optometrist' | 'gp' | 'patient';

interface MockAssessmentDetail {
  id: string;
  recommendation: string;
  role: UserRole;
  patientId: string;
  answers: Array<{
    questionId: string;
    question: string;
    answer: string;
  }>;
  createdAt: string;
}

// Mock the API functions
jest.mock('../../../../api', () => ({
  fetchReportText: jest.fn(),
  getAssessment: jest.fn(),
}));

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

const mockFetchReportText = api.fetchReportText as jest.MockedFunction<typeof api.fetchReportText>;
const mockGetAssessment = api.getAssessment as jest.MockedFunction<typeof api.getAssessment>;

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

  const mockAssessmentDetail: MockAssessmentDetail = {
    id: 'rec-123',
    recommendation: 'EMERGENCY_DEPARTMENT',
    role: 'optometrist' as UserRole,
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

  const renderComponent = (initialPath = '/preview/rec-123', state?: any) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: initialPath, state }]}>
        <PreviewReport />
      </MemoryRouter>
    );
  };

  describe('Loading States', () => {
    it('shows loading message when data is being fetched', () => {
      mockFetchReportText.mockImplementation(() => new Promise(() => {})); // Never resolves
      mockGetAssessment.mockImplementation(() => new Promise(() => {}));

      renderComponent();

      expect(screen.getByText('Loading…')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when fetchReportText fails', async () => {
      mockFetchReportText.mockRejectedValue(new Error('Network error'));
      mockGetAssessment.mockRejectedValue(new Error('Network error'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
      });
    });

    it('displays error message when getAssessment fails', async () => {
      mockFetchReportText.mockResolvedValue(mockReportText);
      mockGetAssessment.mockRejectedValue(new Error('Assessment not found'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/Error: Assessment not found/)).toBeInTheDocument();
      });
    });
  });

  describe('Data Loading and Display', () => {
    it('loads data from API when no state is provided', async () => {
      mockFetchReportText.mockResolvedValue(mockReportText);
      mockGetAssessment.mockResolvedValue(mockAssessmentDetail);

      renderComponent();

      await waitFor(() => {
        expect(mockFetchReportText).toHaveBeenCalledWith('rec-123');
        expect(mockGetAssessment).toHaveBeenCalledWith('rec-123');
      });
    });

    it('uses state data when provided', async () => {
      mockGetAssessment.mockResolvedValue(mockAssessmentDetail);

      renderComponent('/preview/rec-123', { text: mockReportText });

      await waitFor(() => {
        expect(mockFetchReportText).not.toHaveBeenCalled();
        expect(mockGetAssessment).toHaveBeenCalledWith('rec-123');
      });
    });

    it('does not load data when no ID is provided', () => {
      renderComponent('/preview/');

      expect(mockFetchReportText).not.toHaveBeenCalled();
      expect(mockGetAssessment).not.toHaveBeenCalled();
    });
  });

  describe('Text Parsing and Card Display', () => {
    beforeEach(() => {
      mockFetchReportText.mockResolvedValue(mockReportText);
      mockGetAssessment.mockResolvedValue(mockAssessmentDetail);
    });

    it('renders all report cards with correct data', async () => {
      renderComponent();

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

    it('applies correct color class for emergency recommendation', async () => {
      renderComponent();

      await waitFor(() => {
        const cards = screen.getAllByRole('article');
        cards.forEach(card => {
          expect(card).toHaveClass('report-red');
        });
      });
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

      mockFetchReportText.mockResolvedValue(reportWithoutSymptoms);
      mockGetAssessment.mockResolvedValue({
        id: 'rec-124',
        recommendation: 'NO_REFERRAL',
        role: 'optometrist' as UserRole,
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

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Basic information')).toBeInTheDocument();
        expect(screen.getByText('Question responses')).toBeInTheDocument();
        expect(screen.queryByText('Patient symptoms')).not.toBeInTheDocument();
        expect(screen.getByText('Recommendation')).toBeInTheDocument();
      });
    });
  });

  describe('Color Mapping', () => {
    const colorTestCases = [
      { recommendation: 'EMERGENCY_DEPARTMENT', expectedColor: 'report-red' },
      { recommendation: 'IMMEDIATE', expectedColor: 'report-red' },
      { recommendation: 'URGENT_TO_OPH', expectedColor: 'report-orange' },
      { recommendation: 'URGENT_TO_GP_OR_NEUR', expectedColor: 'report-orange' },
      { recommendation: 'TO_GP', expectedColor: 'report-green' },
      { recommendation: 'NO_REFERRAL', expectedColor: 'report-green' },
      { recommendation: 'UNKNOWN_TYPE', expectedColor: 'report-green' }, // default
    ];

    colorTestCases.forEach(({ recommendation, expectedColor }) => {
      it(`applies ${expectedColor} class for ${recommendation}`, async () => {
        mockFetchReportText.mockResolvedValue(mockReportText);
        mockGetAssessment.mockResolvedValue({
          id: 'test-id',
          recommendation,
          role: 'optometrist' as UserRole,
          patientId: 'patient-test',
          answers: [],
          createdAt: '2025-01-15T10:30:00Z'
        });

        renderComponent();

        await waitFor(() => {
          const cards = screen.getAllByRole('article');
          cards.forEach(card => {
            expect(card).toHaveClass(expectedColor);
          });
        });
      });
    });
  });

  describe('Component Integration', () => {
    it('renders header with correct title', () => {
      renderComponent();

      expect(screen.getByTestId('header')).toHaveTextContent('Assessment Report');
    });

    it('renders sidebar and bottom navigation', () => {
      renderComponent();

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles malformed report text gracefully', async () => {
      const malformedText = 'This is not a valid report format';
      
      mockFetchReportText.mockResolvedValue(malformedText);
      mockGetAssessment.mockResolvedValue(mockAssessmentDetail);

      renderComponent();

      await waitFor(() => {
        // Should still render cards, even with unexpected content
        expect(screen.getByText('Basic information')).toBeInTheDocument();
        expect(screen.getByText('Question responses')).toBeInTheDocument();
        expect(screen.getByText('Recommendation')).toBeInTheDocument();
      });
    });

    it('handles empty report text', async () => {
      mockFetchReportText.mockResolvedValue('');
      mockGetAssessment.mockResolvedValue(mockAssessmentDetail);

      renderComponent();

      await waitFor(() => {
        const cards = screen.getAllByRole('article');
        expect(cards).toHaveLength(3); // Should render 3 cards (no symptoms)
      });
    });

    it('handles assessment detail with default recommendation', async () => {
      mockFetchReportText.mockResolvedValue(mockReportText);
      mockGetAssessment.mockResolvedValue({
        id: 'test-id',
        recommendation: 'NO_REFERRAL',
        role: 'optometrist' as UserRole,
        patientId: 'patient-test',
        answers: [],
        createdAt: '2025-01-15T10:30:00Z'
      });

      renderComponent();

      await waitFor(() => {
        const cards = screen.getAllByRole('article');
        cards.forEach(card => {
          expect(card).toHaveClass('report-green'); // Should use green for NO_REFERRAL
        });
      });
    });

    it('handles assessment detail without recommendation field', async () => {
      mockFetchReportText.mockResolvedValue(mockReportText);
      // Use type assertion to test the edge case where recommendation might be missing
      mockGetAssessment.mockResolvedValue({
        id: 'test-id',
        role: 'optometrist',
        patientId: 'patient-test',
        answers: [],
        createdAt: '2025-01-15T10:30:00Z'
      } as any); // Type assertion to bypass TypeScript checking

      renderComponent();

      await waitFor(() => {
        const cards = screen.getAllByRole('article');
        cards.forEach(card => {
          expect(card).toHaveClass('report-green'); // Should default to green when no recommendation
        });
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockFetchReportText.mockResolvedValue(mockReportText);
      mockGetAssessment.mockResolvedValue(mockAssessmentDetail);
    });

    it('uses semantic HTML elements', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getAllByRole('article')).toHaveLength(4);
        expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
      });
    });

    it('provides meaningful headings for each section', async () => {
      renderComponent();

      await waitFor(() => {
        const headings = screen.getAllByRole('heading', { level: 2 });
        const headingTexts = headings.map(h => h.textContent);
        
        expect(headingTexts).toEqual([
          'Basic information',
          'Question responses', 
          'Patient symptoms',
          'Recommendation'
        ]);
      });
    });
  });
});
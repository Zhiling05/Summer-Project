
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DynamicRecommendation from '../../../../../pages/optometrist/assess/recommendations/DynamicRecommendation';

Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn(),
});

// Mock the API module
jest.mock('../../../../../api', () => ({
  fetchReportText: jest.fn().mockResolvedValue('Sample report text content'),
  exportAssessment: jest.fn().mockResolvedValue(new Blob(['test content'], { type: 'text/plain' })),
  sendReport: jest.fn().mockResolvedValue({}),
}));

const { fetchReportText, exportAssessment, sendReport } = require('../../../../../api');

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

const { saveAs } = require('file-saver');

// Mock the recommendations data
jest.mock('../../../../../data/recommendations.json', () => [
  {
    id: 'EMERGENCY_DEPARTMENT',
    title: 'Immediate Referral',
    themeColor: '#d03838',
    backgroundColor: '#ffe4e6'
  },
  {
    id: 'URGENT_TO_OPH',
    title: 'Urgent Referral to Ophthalmology',
    themeColor: '#e67e00',
    backgroundColor: '#ffebcc'
  }
]);

// Mock components
jest.mock('../../../../../components/Header', () => {
  return function MockHeader({ title, showBack }: { title: string; showBack?: boolean }) {
    return <div data-testid="header">{title} {showBack && '(with back)'}</div>;
  };
});

jest.mock('../../../../../components/BottomNav', () => {
  return function MockBottomNav() {
    return <div data-testid="bottom-nav">Bottom Navigation</div>;
  };
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (
  initialPath = '/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT',
  state?: any
) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: initialPath, state }]}>
      <Routes>
        <Route 
          path="/optometrist/assess/recommendations/:resultId" 
          element={<DynamicRecommendation />} 
        />
        <Route 
          path="/optometrist/assess/recommendations/:resultId/:assessmentId" 
          element={<DynamicRecommendation />} 
        />
        <Route 
          path="/optometrist/assess/recommendations/report-preview/:id" 
          element={<div>Report Preview Page</div>} 
        />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('DynamicRecommendation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (window.alert as jest.Mock).mockClear();
    mockNavigate.mockClear();
    (saveAs as jest.Mock).mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders recommendation page correctly with valid resultId', () => {
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      expect(screen.getByRole('heading', { name: 'Immediate Referral' })).toBeInTheDocument();
      expect(screen.getByText('EMERGENCY_DEPARTMENT')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
    });

    it('renders different recommendation types correctly', () => {
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/URGENT_TO_OPH', state);

      expect(screen.getByText('Urgent Referral to Ophthalmology')).toBeInTheDocument();
      expect(screen.getByText('URGENT_TO_OPH')).toBeInTheDocument();
    });

    it('shows error for non-existent recommendation', () => {
      renderWithRouter('/optometrist/assess/recommendations/INVALID_ID');

      expect(screen.getByText(/did not find.*INVALID_ID/)).toBeInTheDocument();
    });

    it('renders all required UI components', () => {
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);
    
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /preview.*report/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download.*txt/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send via email/i })).toBeInTheDocument();
    });

    it('applies correct background color from recommendation data', () => {
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const container = document.querySelector('.recommendation-container');
      expect(container).toHaveStyle('background-color: #ffe4e6');
    });
  });

  describe('Report Preview Functionality', () => {
    it('handles preview report action successfully', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const previewButton = screen.getByRole('button', { name: /preview.*report/i });
      await user.click(previewButton);

      await waitFor(() => {
        expect(fetchReportText).toHaveBeenCalledWith('test-assessment-123');
        expect(mockNavigate).toHaveBeenCalledWith(
          '/optometrist/assess/recommendations/report-preview/test-assessment-123',
          { state: { text: 'Sample report text content' } }
        );
      });
    });
  });

  describe('Download Functionality', () => {
    it('handles download action successfully', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const downloadButton = screen.getByRole('button', { name: /download.*txt/i });
      await user.click(downloadButton);

      await waitFor(() => {
        expect(exportAssessment).toHaveBeenCalledWith('test-assessment-123', 'txt');
        expect(saveAs).toHaveBeenCalledWith(
          expect.any(Blob),
          'assessment-test-assessment-123.txt'
        );
      });
    });
  });

  describe('Email Modal Functionality', () => {
    it('opens email modal when Send via Email button is clicked', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      await waitFor(() => {
        expect(screen.getByText('Send report via email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      });
    });

    it('closes email modal when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      // Close modal
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Send report via email')).not.toBeInTheDocument();
      });
    });

    it('handles email input correctly', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      // Type email
      const emailInput = screen.getByPlaceholderText('name@example.com');
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('disables Send button when email is empty', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      const sendButton = screen.getByRole('button', { name: 'Send' });
      expect(sendButton).toBeDisabled();
    });

    it('enables Send button when valid email is entered', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      // Type email
      const emailInput = screen.getByPlaceholderText('name@example.com');
      await user.type(emailInput, 'test@example.com');

      const sendButton = screen.getByRole('button', { name: 'Send' });
      expect(sendButton).not.toBeDisabled();
    });

    it('sends email successfully', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      // Type email and send
      const emailInput = screen.getByPlaceholderText('name@example.com');
      await user.type(emailInput, 'test@example.com');

      const sendButton = screen.getByRole('button', { name: 'Send' });
      await user.click(sendButton);

      await waitFor(() => {
        expect(sendReport).toHaveBeenCalledWith('test-assessment-123', 'test@example.com', 'txt');
        expect(window.alert).toHaveBeenCalledWith('邮件已发送！');
        expect(screen.queryByText('Send report via email')).not.toBeInTheDocument();
      });
    });

    it('shows loading state during email sending', async () => {
      const user = userEvent.setup();
      let resolvePromise: () => void;
      const emailPromise = new Promise<{ ok: boolean }>((resolve) => {
        resolvePromise = () => resolve({ ok: true });
      });
      (sendReport as jest.Mock).mockReturnValue(emailPromise);

      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      // Type email and send
      const emailInput = screen.getByPlaceholderText('name@example.com');
      await user.type(emailInput, 'test@example.com');

      const sendButton = screen.getByRole('button', { name: 'Send' });
      await user.click(sendButton);

      // Check loading state
      expect(screen.getByText('Sending…')).toBeInTheDocument();
      expect(sendButton).toBeDisabled();

      // Resolve promise and check final state
      resolvePromise!();
      await waitFor(() => {
        expect(screen.queryByText('Send report via email')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles preview report error gracefully', async () => {
      const user = userEvent.setup();
      (fetchReportText as jest.Mock).mockRejectedValue(new Error('API Error'));
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const previewButton = screen.getByRole('button', { name: /preview.*report/i });
      await user.click(previewButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Fetch report failed: API Error');
      });
    });

    it('handles missing assessmentId for preview', async () => {
      const user = userEvent.setup();
      // No assessmentId in state
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT');

      const previewButton = screen.getByRole('button', { name: /preview.*report/i });
      await user.click(previewButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Fetch report failed: assessmentId missing');
      });
    });

    it('handles download error gracefully', async () => {
      const user = userEvent.setup();
      (exportAssessment as jest.Mock).mockRejectedValue(new Error('Download Error'));
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const downloadButton = screen.getByRole('button', { name: /download.*txt/i });
      await user.click(downloadButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Download failed: Download Error');
      });
    });

    it('does not call download API when assessmentId is missing', async () => {
      const user = userEvent.setup();
      // No assessmentId in state
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT');

      const downloadButton = screen.getByRole('button', { name: /download.*txt/i });
      await user.click(downloadButton);

      expect(exportAssessment).not.toHaveBeenCalled();
      expect(saveAs).not.toHaveBeenCalled();
    });

    it('handles email sending error gracefully', async () => {
      const user = userEvent.setup();
      (sendReport as jest.Mock).mockRejectedValue(new Error('Email Error'));
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      // Type email and send
      const emailInput = screen.getByPlaceholderText('name@example.com');
      await user.type(emailInput, 'test@example.com');

      const sendButton = screen.getByRole('button', { name: 'Send' });
      await user.click(sendButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Send failed: Email Error');
      });
    });
  });
});
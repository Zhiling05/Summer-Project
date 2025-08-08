import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DynamicRecommendation from '../../pages/optometrist/assess/recommendations/DynamicRecommendation';
import { fetchReportText, exportAssessment, sendReport } from '../../api';

// Mock window.alert to avoid JSDOM errors
Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn(),
});

// Mock the API module
jest.mock('../../api', () => ({
  fetchReportText: jest.fn().mockResolvedValue('Sample report text content'),
  exportAssessment: jest.fn().mockResolvedValue(new Blob(['test content'], { type: 'text/plain' })),
  sendReport: jest.fn().mockResolvedValue({}),
}));

const mockFetchReportText = jest.mocked(fetchReportText);
const mockExportAssessment = jest.mocked(exportAssessment);
const mockSendReport = jest.mocked(sendReport);

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

const mockSaveAs = jest.fn();
require('file-saver').saveAs = mockSaveAs;

// Mock the recommendations data
jest.mock('../../data/recommendations.json', () => [
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

// Mock assets
jest.mock('../../assets/NHS_LOGO.jpg', () => 'nhs-logo-mock');
jest.mock('../../assets/DIPP_Study_logo.png', () => 'dipp-logo-mock');

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
    mockSaveAs.mockClear();
  });

  describe('Component Rendering', () => {
    it('should render recommendation page correctly with valid resultId', () => {
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      expect(screen.getByRole('heading', { name: 'Immediate Referral' })).toBeInTheDocument();
      expect(screen.getByText('EMERGENCY_DEPARTMENT')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
    });

    it('should render different recommendation types correctly', () => {
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/URGENT_TO_OPH', state);

      expect(screen.getByText('Urgent Referral to Ophthalmology')).toBeInTheDocument();
      expect(screen.getByText('URGENT_TO_OPH')).toBeInTheDocument();
    });

    it('should show error message for non-existent recommendation', () => {
      renderWithRouter('/optometrist/assess/recommendations/INVALID_ID');

      expect(screen.getByText(/did not find.*INVALID_ID/)).toBeInTheDocument();
      expect(screen.getByText('首页')).toBeInTheDocument();
    });

    it('should apply correct background color from recommendation data', () => {
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const container = document.querySelector('.recommendation-container');
      expect(container).toHaveStyle('background-color: #ffe4e6');
    });

    it('should render action buttons correctly', () => {
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      expect(screen.getByRole('button', { name: /preview.*report/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download.*txt/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send via email/i })).toBeInTheDocument();
    });
  });

  describe('Report Preview Functionality', () => {
    it('should handle preview report action successfully', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const previewButton = screen.getByRole('button', { name: /preview.*report/i });
      await user.click(previewButton);

      await waitFor(() => {
        expect(mockFetchReportText).toHaveBeenCalledWith('test-assessment-123');
        expect(mockNavigate).toHaveBeenCalledWith(
          '/optometrist/assess/recommendations/report-preview/test-assessment-123',
          { state: { text: 'Sample report text content' } }
        );
      });
    });

    it('should handle preview report error gracefully', async () => {
      const user = userEvent.setup();
      mockFetchReportText.mockRejectedValue(new Error('API Error'));
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const previewButton = screen.getByRole('button', { name: /preview.*report/i });
      await user.click(previewButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Fetch report failed: API Error');
      });
    });

    it('should handle missing assessmentId for preview', async () => {
      const user = userEvent.setup();
      // No assessmentId in state
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT');

      const previewButton = screen.getByRole('button', { name: /preview.*report/i });
      await user.click(previewButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Fetch report failed: assessmentId missing');
      });
    });
  });

  describe('Download Functionality', () => {
    it('should handle download action successfully', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const downloadButton = screen.getByRole('button', { name: /download.*txt/i });
      await user.click(downloadButton);

      await waitFor(() => {
        expect(mockExportAssessment).toHaveBeenCalledWith('test-assessment-123', 'txt');
        expect(mockSaveAs).toHaveBeenCalledWith(
          expect.any(Blob),
          'assessment-test-assessment-123.txt'
        );
      });
    });

    it('should handle download error gracefully', async () => {
      const user = userEvent.setup();
      mockExportAssessment.mockRejectedValue(new Error('Download Error'));
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const downloadButton = screen.getByRole('button', { name: /download.*txt/i });
      await user.click(downloadButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Download failed: Download Error');
      });
    });

    it('should not call download API when assessmentId is missing', async () => {
      const user = userEvent.setup();
      // No assessmentId in state
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT');

      const downloadButton = screen.getByRole('button', { name: /download.*txt/i });
      await user.click(downloadButton);

      expect(mockExportAssessment).not.toHaveBeenCalled();
      expect(mockSaveAs).not.toHaveBeenCalled();
    });
  });

  describe('Email Modal Functionality', () => {
    it('should open email modal when Send via Email button is clicked', async () => {
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

    it('should close email modal when Cancel button is clicked', async () => {
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

    it('should close email modal when overlay is clicked', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      // Click overlay
      const overlay = document.querySelector('.email-modal-overlay');
      expect(overlay).toBeInTheDocument();
      fireEvent.click(overlay!);

      await waitFor(() => {
        expect(screen.queryByText('Send report via email')).not.toBeInTheDocument();
      });
    });

    it('should not close modal when clicking inside modal content', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      // Click modal content
      const modalContent = document.querySelector('.email-modal');
      expect(modalContent).toBeInTheDocument();
      fireEvent.click(modalContent!);

      // Modal should still be visible
      expect(screen.getByText('Send report via email')).toBeInTheDocument();
    });

    it('should handle email input correctly', async () => {
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

    it('should disable Send button when email is empty', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      const sendButton = screen.getByRole('button', { name: 'Send' });
      expect(sendButton).toBeDisabled();
    });

    it('should enable Send button when valid email is entered', async () => {
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

    it('should send email successfully', async () => {
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
        expect(mockSendReport).toHaveBeenCalledWith('test-assessment-123', 'test@example.com', 'txt');
        expect(window.alert).toHaveBeenCalledWith('邮件已发送！');
        expect(screen.queryByText('Send report via email')).not.toBeInTheDocument();
      });
    });

    it('should handle email sending error gracefully', async () => {
      const user = userEvent.setup();
      mockSendReport.mockRejectedValue(new Error('Email Error'));
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

    it('should show loading state during email sending', async () => {
      const user = userEvent.setup();
      let resolvePromise: () => void;
      const emailPromise = new Promise<{ ok: boolean }>((resolve) => {
        resolvePromise = () => resolve({ ok: true });
      });
      mockSendReport.mockReturnValue(emailPromise);

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

    it('should not allow closing modal during email sending', async () => {
      const user = userEvent.setup();
      let resolvePromise: () => void;
      const emailPromise = new Promise<{ ok: boolean }>((resolve) => {
        resolvePromise = () => resolve({ ok: true });
      });
      mockSendReport.mockReturnValue(emailPromise);

      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Open modal and start sending
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      const emailInput = screen.getByPlaceholderText('name@example.com');
      await user.type(emailInput, 'test@example.com');

      const sendButton = screen.getByRole('button', { name: 'Send' });
      await user.click(sendButton);

      // Try to close modal while sending
      const overlay = document.querySelector('.email-modal-overlay');
      fireEvent.click(overlay!);

      // Modal should still be visible
      expect(screen.getByText('Send report via email')).toBeInTheDocument();

      // Resolve and modal should close
      resolvePromise!();
      await waitFor(() => {
        expect(screen.queryByText('Send report via email')).not.toBeInTheDocument();
      });
    });

    it('should not send email when assessmentId is missing', async () => {
      const user = userEvent.setup();
      // No assessmentId in state
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT');

      // Open modal
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      await user.click(emailButton);

      // Type email and send
      const emailInput = screen.getByPlaceholderText('name@example.com');
      await user.type(emailInput, 'test@example.com');

      const sendButton = screen.getByRole('button', { name: 'Send' });
      await user.click(sendButton);

      expect(mockSendReport).not.toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    it('should handle missing assessmentId in state gracefully', () => {
      // No state passed
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT');

      expect(screen.getByText('Immediate Referral')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /preview.*report/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download.*txt/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send via email/i })).toBeInTheDocument();
    });

    it('should handle partial state correctly', () => {
      const state = { assessmentId: 'test-123', extraData: 'ignored' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      expect(screen.getByText('Immediate Referral')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button accessibility attributes', () => {
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      const previewButton = screen.getByRole('button', { name: /preview.*report/i });
      const downloadButton = screen.getByRole('button', { name: /download.*txt/i });
      const emailButton = screen.getByRole('button', { name: /send via email/i });

      expect(previewButton).toBeInTheDocument();
      expect(downloadButton).toBeInTheDocument();
      expect(emailButton).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const state = { assessmentId: 'test-assessment-123' };
      renderWithRouter('/optometrist/assess/recommendations/EMERGENCY_DEPARTMENT', state);

      // Tab through buttons
      await user.tab();
      const previewButton = screen.getByRole('button', { name: /preview.*report/i });
      expect(previewButton).toHaveFocus();

      await user.tab();
      const downloadButton = screen.getByRole('button', { name: /download.*txt/i });
      expect(downloadButton).toHaveFocus();

      await user.tab();
      const emailButton = screen.getByRole('button', { name: /send via email/i });
      expect(emailButton).toHaveFocus();
    });
  });

  describe('Error States', () => {
    it('should handle recommendation not found gracefully', () => {
      renderWithRouter('/optometrist/assess/recommendations/NON_EXISTENT');

      expect(screen.getByText(/did not find.*NON_EXISTENT/)).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('首页')).toBeInTheDocument();
    });

    it('should maintain UI consistency in error states', () => {
      renderWithRouter('/optometrist/assess/recommendations/NON_EXISTENT');

      // Should still render header and basic structure
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(document.querySelector('.recommendation-container')).toBeInTheDocument();
    });
  });
});
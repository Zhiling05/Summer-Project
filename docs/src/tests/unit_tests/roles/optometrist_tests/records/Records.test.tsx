import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Records from '../../../../../pages/optometrist/Records';
import { MemoryRouter } from 'react-router-dom';

// Mock Header, Sidebar, BottomNav 
jest.mock('../../../../components/Header', () => ({ title }: { title: string }) => (
  <div data-testid="header">{title}</div>
));

jest.mock('../../../../components/SideBar', () => () => (
  <div data-testid="sidebar">Sidebar Loaded</div>
));

jest.mock('../../../../components/BottomNav', () => () => (
  <div data-testid="bottom-nav">Bottom Navigation Loaded</div>
));

// Mock API return fix recording
jest.mock('../../../../api', () => ({
  listAssessments: jest.fn(() =>
    Promise.resolve({
      records: [
        {
          id: 'rec1',
          date: '2024-01-01',
          risk: 'IMMEDIATE'
        },
        {
          id: 'rec2',
          date: '2024-02-01',
          risk: 'NO_REFERRAL'
        }
      ]
    })
  )
}));

describe('Records Component', () => {
  test('renders stats and table from remote data', async () => {
    render(
      <MemoryRouter>
        <Records />
      </MemoryRouter>
    );

    expect(screen.getByTestId('header')).toHaveTextContent('Records');
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();

    // Wait for asynchronous data loading
    await waitFor(() => {
      expect(screen.getByText('rec1')).toBeInTheDocument();
      expect(screen.getByText('rec2')).toBeInTheDocument();
    });

    expect(screen.getAllByRole('row')).toHaveLength(3); // including header 
    expect(screen.getAllByText('High Risk').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Low Risk').length).toBeGreaterThanOrEqual(1);
  });
});

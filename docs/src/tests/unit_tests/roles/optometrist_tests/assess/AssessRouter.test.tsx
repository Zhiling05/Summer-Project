import React from 'react';
import { render, screen } from '@testing-library/react';
import AssessRouter from '../../../../../pages/optometrist/assess/AssessRouter';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../../../pages/optometrist/assess/StartPage', () => () => (
  <div data-testid="start-page">Start Page Loaded</div>
));

jest.mock('../../../../../pages/optometrist/assess/questions/DynamicQuestion', () => () => (
  <div data-testid="questions-router">Questions Router Loaded</div>
));

jest.mock('../../../../../pages/optometrist/assess/recommendations/DynamicRecommendation', () => () => (
  <div data-testid="recommendations-router">Recommendations Router Loaded</div>
));

jest.mock('../../../../../pages/optometrist/assess/recommendations/PreviewReport', () => () => (
  <div data-testid="preview-report">Preview Report Loaded</div>
));

describe('AssessRouter Component', () => {
  test('redirects from root to start-page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AssessRouter />
      </MemoryRouter>
    );
    expect(screen.getByTestId('start-page')).toBeInTheDocument();
  });

  test('renders Start Page when at /start-page', () => {
    render(
      <MemoryRouter initialEntries={['/start-page']}>
        <AssessRouter />
      </MemoryRouter>
    );
    expect(screen.getByTestId('start-page')).toBeInTheDocument();
  });

  test('renders Questions Router with dynamic questionId', () => {
    render(
      <MemoryRouter initialEntries={['/questions/Q1']}>
        <AssessRouter />
      </MemoryRouter>
    );
    expect(screen.getByTestId('questions-router')).toBeInTheDocument();
  });

  test('renders Recommendations Router with dynamic resultId', () => {
    render(
      <MemoryRouter initialEntries={['/recommendations/URGENT_TO_OPH']}>
        <AssessRouter />
      </MemoryRouter>
    );
    expect(screen.getByTestId('recommendations-router')).toBeInTheDocument();
  });

  test('renders PreviewReport Router with dynamic id', () => {
    render(
      <MemoryRouter initialEntries={['/recommendations/report-preview/URGENT_TO_OPH']}>
        <AssessRouter />
      </MemoryRouter>
    );
    expect(screen.getByTestId('preview-report')).toBeInTheDocument();
  });

  // 新增的重定向检测
  test('redirects unknown path to start-page', () => {
    render(
      <MemoryRouter initialEntries={['/some/unknown/path']}>
        <AssessRouter />
      </MemoryRouter>
    );
    expect(screen.getByTestId('start-page')).toBeInTheDocument();
  });
});

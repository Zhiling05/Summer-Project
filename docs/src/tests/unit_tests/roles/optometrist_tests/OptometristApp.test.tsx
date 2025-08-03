import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OptometristApp from '../../../../pages/optometrist/OptometristApp';

// Mock子路由组件
jest.mock('../../../../pages/optometrist/assess/AssessRouter', () => () => (
  <div data-testid="assess-router">Assess Router Loaded</div>
));

jest.mock('../../../../pages/optometrist/guide/GuideRouter', () => () => (
  <div data-testid="guide-router">Guide Router Loaded</div>
));

jest.mock('../../../../pages/optometrist/Records', () => () => (
  <div data-testid="records-page">Records Page Loaded</div>
));

describe('OptometristApp Routing', () => {
  test('redirects from /optometrist to /optometrist/assess/start-page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/*" element={<OptometristApp />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('assess-router')).toBeInTheDocument();
  });

  test('renders AssessRouter at /assess/*', () => {
    render(
      <MemoryRouter initialEntries={['/assess/q1']}>
        <Routes>
          <Route path="/*" element={<OptometristApp />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('assess-router')).toBeInTheDocument();
  });

  test('renders GuideRouter at /guide/*', () => {
    render(
      <MemoryRouter initialEntries={['/guide/tutorial']}>
        <Routes>
          <Route path="/*" element={<OptometristApp />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('guide-router')).toBeInTheDocument();
  });

  test('renders Records page at /records', () => {
    render(
      <MemoryRouter initialEntries={['/records']}>
        <Routes>
          <Route path="/*" element={<OptometristApp />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('records-page')).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Records from '../../../../pages/optometrist/Records';
import Guide from '../../../../pages/optometrist/guide/GuideHome';
import OptometristHome from '../../../../pages/optometrist/OptometristHome';
import AssessStart from '../../../../pages/optometrist/assess/StartPage';

describe('Records Page - TDD Flow', () => {
    const renderWithRouter = (initialPath = '/optometrist/records') => {
        render(
            <MemoryRouter initialEntries={[initialPath]}>
                <Routes>
                    <Route path="/optometrist/records" element={<Records />} />
                    <Route path="/optometrist/guide" element={<Guide />} />
                    <Route path="/optometrist/home" element={<OptometristHome />} />
                    <Route path="/optometrist/assess/start" element={<AssessStart />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('should render logos and page title', () => {
        renderWithRouter();

        expect(screen.getByAltText(/NHS logo/i)).toBeInTheDocument();
        expect(screen.getByAltText(/DIPP Study logo/i)).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Records/i })).toBeInTheDocument();
    });

    it('should render three statistics cards as buttons (even if not interactive yet)', () => {
        renderWithRouter();
        const statsButtons = screen.getAllByRole('button');
        expect(statsButtons.length).toBeGreaterThanOrEqual(3); // Defensive test
    });

    it('should render the table and View Details buttons', () => {
        renderWithRouter();
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
        const detailButtons = screen.getAllByRole('button', { name: /view details/i });
        expect(detailButtons.length).toBeGreaterThan(0);
    });

    it('should navigate to correct pages via BottomNav buttons', () => {
        renderWithRouter();

        // 跳转到 Home
        fireEvent.click(screen.getByRole('button', { name: /home/i }));
        expect(screen.getByText(/Optometrist Home/i)).toBeInTheDocument();

        // 跳转到 Guide
        fireEvent.click(screen.getByRole('button', { name: /guide/i }));
        expect(screen.getByText(/Guide/i)).toBeInTheDocument();

        // 跳转到 Assess
        fireEvent.click(screen.getByRole('button', { name: /assess/i }));
        expect(screen.getByText(/Start the Assessment/i)).toBeInTheDocument();
    });

    it('should not re-navigate when clicking Records button on current Records page', () => {
        renderWithRouter();

        const recordsBtn = screen.getByRole('button', { name: /records/i });
        fireEvent.click(recordsBtn);

        // 页面仍然为 Records
        expect(screen.getByRole('heading', { name: /Optometrist Records Page/i })).toBeInTheDocument();
        expect(screen.queryByText(/Guide/i)).not.toBeInTheDocument(); // 没跳转
    });
});

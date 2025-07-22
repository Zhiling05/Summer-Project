import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Guide from '../../../../pages/optometrist/guide/GuideHome';
import '@testing-library/jest-dom';

describe('Guide Page', () => {

    // TDD Step 1: 渲染基本组件
    it('should render Guide page with heading and section titles', () => {
        render(
            <MemoryRouter initialEntries={['/optometrist/guide']}>
                <Routes>
                    <Route path="/optometrist/guide" element={<Guide />} />
                </Routes>
            </MemoryRouter>
        );

        // 标题
        const headings = screen.getAllByRole('heading', { level: 1, name: 'Guide' });
        expect(headings.length).toBeGreaterThanOrEqual(1);

        // 小标题
        expect(screen.getByText(/Software instruction/i)).toBeInTheDocument();
        expect(screen.getByText(/Tutorial on Assessment Workflow/i)).toBeInTheDocument();
        expect(screen.getByText(/Reference Image Gallery/i)).toBeInTheDocument();
        expect(screen.getByText(/DIPP Website Link/i)).toBeInTheDocument();

        // 外部链接
        expect(screen.getByRole('link', { name: /Visit DIPP Study website/i })).toBeInTheDocument();

        // BottomNav 渲染
        expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /assess/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /records/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /guide/i })).toBeInTheDocument();
    });

    // TDD Step 2: 测试 BottomNav 导航功能
    it('should navigate to Home, Assess and Records via BottomNav', () => {
        render(
            <MemoryRouter initialEntries={['/optometrist/guide']}>
                <Routes>
                    <Route path="/optometrist/guide" element={<Guide />} />
                    <Route path="/optometrist/home" element={<div>Home Page</div>} />
                    <Route path="/optometrist/assess/start" element={<div>Assess Page</div>} />
                    <Route path="/optometrist/records" element={<div>Records Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /home/i }));
        expect(screen.getByText('Home Page')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /assess/i }));
        expect(screen.getByText('Assess Page')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /records/i }));
        expect(screen.getByText('Records Page')).toBeInTheDocument();
    });

    // TDD Step 3: 验证在 Guide 页面点击 Guide 不跳转
    it('should stay on Guide page if Guide button is clicked again', () => {
        render(
            <MemoryRouter initialEntries={['/optometrist/guide']}>
                <Routes>
                    <Route path="/optometrist/guide" element={<Guide />} />
                    <Route path="/optometrist/home" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // 初始页面为 Guide
        expect(screen.getByText(/Software instruction/i)).toBeInTheDocument();

        // 点击 Guide 按钮（本来就在 Guide，不应跳转）
        fireEvent.click(screen.getByRole('button', { name: /guide/i }));

        // 仍然在 Guide 页面
        expect(screen.getByText(/Software instruction/i)).toBeInTheDocument();
        expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
    });

});

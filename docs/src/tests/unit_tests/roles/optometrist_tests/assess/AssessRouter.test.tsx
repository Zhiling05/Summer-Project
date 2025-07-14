/// <reference types="@testing-library/jest-dom" />
//测试内容：默认重定向[path="" → start-page]，子路由有没有正确渲染……这里子组件不用参与逻辑验证，只要测试路由就可以
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AssessRouter from '../../../../../pages/optometrist/assess/AssessRouter';


jest.mock('../../../../../pages/optometrist/assess/StartPage', () => () => (
    <div data-testid="start-page">Start Page Loaded</div>
));
jest.mock('../../../../../pages/optometrist/assess/questions/QuestionsRouter', () => () => (
    <div data-testid="questions-router">Questions Router Loaded</div>
));
jest.mock('../../../../../pages/optometrist/assess/recommendations/RecommendationsRouter', () => () => (
    <div data-testid="recommendations-router">Recommendations Router Loaded</div>
));

describe('AssessRouter Component', () => {
    it('redirects to start-page on empty path', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/*" element={<AssessRouter />} />
                </Routes>
            </MemoryRouter>
        );

        // should navigate to start-page
        expect(screen.getByTestId('start-page')).toBeInTheDocument();
    });

    it('renders StartPage at /start-page', () => {
        render(
            <MemoryRouter initialEntries={['/start-page']}>
                <Routes>
                    <Route path="/*" element={<AssessRouter />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('start-page')).toBeInTheDocument();
    });

    it('renders QuestionsRouter at /questions', () => {
        render(
            <MemoryRouter initialEntries={['/questions']}>
                <Routes>
                    <Route path="/*" element={<AssessRouter />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('questions-router')).toBeInTheDocument();
    });

    it('renders RecommendationsRouter at /recommendations', () => {
        render(
            <MemoryRouter initialEntries={['/recommendations']}>
                <Routes>
                    <Route path="/*" element={<AssessRouter />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('recommendations-router')).toBeInTheDocument();
    });
});

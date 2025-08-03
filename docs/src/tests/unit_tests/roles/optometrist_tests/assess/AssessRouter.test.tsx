// /// <reference types="@testing-library/jest-dom" />
// //测试内容：默认重定向[path="" → start-page]，子路由有没有正确渲染……这里子组件不用参与逻辑验证，只要测试路由就可以
import { render, screen } from '@testing-library/react';
import AssessRouter from '../../../../../pages/optometrist/assess/AssessRouter';


// Mock the child routes
jest.mock('../../../../../pages/optometrist/assess/StartPage', () => () => (
    <div data-testid="start-page">Start Page Loaded</div>
));
jest.mock('../../../../../pages/optometrist/assess/questions/QuestionsRouter', () => () => (
    <div data-testid="questions-router">Questions Router Loaded</div>
));
jest.mock('../../../../../pages/optometrist/assess/recommendations/RecommendationsRouter', () => () => (
    <div data-testid="recommendations-router">Recommendations Router Loaded</div>
));

describe('AssessRouter Routing Behavior (TDD)', () => {
    const renderWithRoute = (initialPath: string) => {
        render(
            <MemoryRouter initialEntries={[initialPath]}>
                <Routes>
                    <Route path="/*" element={<AssessRouter />} />
                </Routes>
            </MemoryRouter>
        );
    };

    describe('Default Route Redirection', () => {
        it('should redirect to /start-page when path is empty', () => {
            renderWithRoute('/');
            expect(screen.getByTestId('start-page')).toBeInTheDocument();
        });
    });

    describe('Defined Child Routes Rendering', () => {
        it('should render StartPage when navigating to /start-page', () => {
            renderWithRoute('/start-page');
            expect(screen.getByTestId('start-page')).toBeInTheDocument();
        });

        it('should render QuestionsRouter when navigating to /questions', () => {
            renderWithRoute('/questions');
            expect(screen.getByTestId('questions-router')).toBeInTheDocument();
        });

        it('should render RecommendationsRouter when navigating to /recommendations', () => {
            renderWithRoute('/recommendations');
            expect(screen.getByTestId('recommendations-router')).toBeInTheDocument();
        });
    });
});



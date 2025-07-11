import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OptometristApp from '../../../../pages/optometrist/OptometristApp';

// Mock AssessRouter
jest.mock('../../../../pages/optometrist/assess/AssessRouter', () => () => (
    <div>Mocked AssessRouter</div>
));

describe('OptometristApp', () => {
    it('renders Home page correctly with logos, title, context, and button', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="*" element={<OptometristApp />} />
                </Routes>
            </MemoryRouter>
        );

        // NHS logo should exist and render
        const nhsLogo = screen.getByAltText('NHS logo');
        expect(nhsLogo).toBeInTheDocument();
        // expect(nhsLogo).toHaveAttribute('src', expect.stringContaining('NHS_LOGO.jpg'));
        // 但此时和mock文件定义的内容不一样，修改之后才会匹配。我们目前没有配置针对不同文件名返回不同 mock 的 transformer


        // check DIPP Study logo
        const dippLogo = screen.getByAltText('DIPP Study logo');
        expect(dippLogo).toBeInTheDocument();
        // expect(dippLogo).toHaveAttribute('src', expect.stringContaining('DIPP_Study_logo.png'));


        // check if title contains OptometristApp
        expect(screen.getByRole('heading', { name: /OptometristApp/i })).toBeInTheDocument();
        // check if title equals OptometristApp
        expect(screen.getByRole('heading', { name: /^OptometristApp$/i })).toBeInTheDocument();


        // check context lines ... change the contents when updated!
        expect(screen.getByText('context line 1')).toBeInTheDocument();
        expect(screen.getByText('context line 2')).toBeInTheDocument();
        expect(screen.getByText('context line 3')).toBeInTheDocument();

        // check Access button
        expect(screen.getByRole('button', { name: /Access/i })).toBeInTheDocument();
    });

    it('navigates to AssessRouter when Access button is clicked', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="*" element={<OptometristApp />} />
                </Routes>
            </MemoryRouter>
        );

        const user = userEvent.setup();

        // click Access button
        const accessButton = screen.getByRole('button', { name: /Access/i });
        await user.click(accessButton);

        // chould render mock components...
        expect(screen.getByText('Mocked AssessRouter')).toBeInTheDocument();
    });
});

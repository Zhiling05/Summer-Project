import { Routes, Route, Navigate } from 'react-router-dom';
// import Q1 from './Q1';
// import Q2 from './Q2';
// import Q3 from './Q3';
// import Q4 from './Q4';
// import Q5 from './Q5';
// import Q6 from './Q6';
// import Q7 from './Q7';
// import Q8 from './Q8';
// import Q9 from './Q9';
// import Q10 from './Q10';
// import Q11 from './Q11';
// import Q12 from './Q12';
// import Q13 from './Q13';
// import Q14 from './Q14';
// import Q15 from './Q15';
// import Q16 from './Q16';
// import Q17 from './Q17';
// import Q18 from './Q18';
// import Q19 from './Q19';
import DynamicQuestion from './DynamicQuestion';

export default function QuestionsRouter() {
  return (
    <Routes>
      {/* 点击 Start 后默认跳转到第一题（可以保留） */}
      <Route index element={<Navigate to="q1" replace />} />

      {/*
      // ↓ 下面这些静态分支都可以注释掉，改由 DynamicQuestion 统一处理
      // <Route path="q1"  element={<Q1 />} />
      // <Route path="q2"  element={<Q2 />} />
      // ……………………………………
      // <Route path="q19" element={<Q19 />} />
      */}

      {/* catch-all：所有没有上面显式声明的，都用 DynamicQuestion 渲染 */}
      <Route path=":questionId" element={<DynamicQuestion />} />
    </Routes>
  );
}



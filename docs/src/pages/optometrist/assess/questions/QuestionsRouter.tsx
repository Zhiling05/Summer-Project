import { Routes, Route } from 'react-router-dom';

import Q1 from './Q1';
import Q2 from './Q2';
import Q3 from './Q3';
import Q4 from './Q4';
import Q5 from './Q5';
import Q6 from './Q6';
import Q7 from './Q7';
import Q8 from './Q8';
import Q9 from './Q9';
import Q10 from './Q10';
import Q11 from './Q11';
import Q12 from './Q12';
import Q13 from './Q13';
import Q14 from './Q14';
import Q15 from './Q15';
import Q16 from './Q16';
import Q17 from './Q17';
import Q18 from './Q18';
import Q19 from './Q19';

export default function QuestionsRouter() {
  return (
    <Routes>
      {/* 统一使用大写 ID */}
      <Route path="Q1"  element={<Q1 />} />
      <Route path="Q2"  element={<Q2 />} />
      <Route path="Q3"  element={<Q3 />} />
      <Route path="Q4"  element={<Q4 />} />

      {/* Q5 分支 */}
      <Route path="Q5"        element={<Q5 />} />
      <Route path="Q5_noHD"   element={<Q5 />} />
      <Route path="Q5_HD"     element={<Q5 />} />

      {/* Q6 分支 */}
      <Route path="Q6"        element={<Q6 />} />
      <Route path="Q6_noHD"   element={<Q6 />} />
      <Route path="Q6_HD"     element={<Q6 />} />

      <Route path="Q7"  element={<Q7 />} />
      <Route path="Q8"  element={<Q8 />} />
      <Route path="Q9"  element={<Q9 />} />

      {/* Q10 四条别名 */}
      <Route path="Q10"           element={<Q10 />} />
      <Route path="Q10_urgent"    element={<Q10 />} />
      <Route path="Q10_noVisual"        element={<Q10 />} />
      <Route path="Q10_visual"      element={<Q10 />} />
      <Route path="Q10_routine"   element={<Q10 />} />

      <Route path="Q11" element={<Q11 />} />
      <Route path="Q12" element={<Q12 />} />
      <Route path="Q13" element={<Q13 />} />
      <Route path="Q14" element={<Q14 />} />
      <Route path="Q15" element={<Q15 />} />
      <Route path="Q16" element={<Q16 />} />
      <Route path="Q17" element={<Q17 />} />
      <Route path="Q18" element={<Q18 />} />
      <Route path="Q19" element={<Q19 />} />

      {/* 兜底 404，防止白屏 */}
      <Route path="*" element={<h2>Question Not Found</h2>} />
    </Routes>
  );
}
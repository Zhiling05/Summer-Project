import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Guide from './Guide';
import Assess from './Assess/Assess';
import Records from './Records';

// 引入19道题组件
import Q1 from './Assess/Q1';
import Q2 from './Assess/Q2';
import Q3 from './Assess/Q3';
import Q4 from './Assess/Q4';
import Q5 from './Assess/Q5';
import Q6 from './Assess/Q6';
import Q7 from './Assess/Q7';
import Q8 from './Assess/Q8';
import Q9 from './Assess/Q9';
import Q10 from './Assess/Q10';
import Q11 from './Assess/Q11';
import Q12 from './Assess/Q12';
import Q13 from './Assess/Q13';
import Q14 from './Assess/Q14';
import Q15 from './Assess/Q15';
import Q16 from './Assess/Q16';
import Q17 from './Assess/Q17';
import Q18 from './Assess/Q18';
import Q19 from './Assess/Q19';

function OptometristApp() {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="guide" element={<Guide />} />
      <Route path="assess" element={<Assess />} />
      <Route path="records" element={<Records />} />

      {/* 19道题的子路由 */}
      <Route path="assess/q1" element={<Q1 />} />
      <Route path="assess/q2" element={<Q2 />} />
      <Route path="assess/q3" element={<Q3 />} />
      <Route path="assess/q4" element={<Q4 />} />
      <Route path="assess/q5" element={<Q5 />} />
      <Route path="assess/q6" element={<Q6 />} />
      <Route path="assess/q7" element={<Q7 />} />
      <Route path="assess/q8" element={<Q8 />} />
      <Route path="assess/q9" element={<Q9 />} />
      <Route path="assess/q10" element={<Q10 />} />
      <Route path="assess/q11" element={<Q11 />} />
      <Route path="assess/q12" element={<Q12 />} />
      <Route path="assess/q13" element={<Q13 />} />
      <Route path="assess/q14" element={<Q14 />} />
      <Route path="assess/q15" element={<Q15 />} />
      <Route path="assess/q16" element={<Q16 />} />
      <Route path="assess/q17" element={<Q17 />} />
      <Route path="assess/q18" element={<Q18 />} />
      <Route path="assess/q19" element={<Q19 />} />
    </Routes>
  );
}

export default OptometristApp;

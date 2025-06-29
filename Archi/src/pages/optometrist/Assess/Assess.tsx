import React from 'react';
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

function Assess() {
  return (
    <Routes>
      <Route path="q1" element={<Q1 />} />
      <Route path="q2" element={<Q2 />} />
      <Route path="q3" element={<Q3 />} />
      <Route path="q4" element={<Q4 />} />
      <Route path="q5" element={<Q5 />} />
      <Route path="q6" element={<Q6 />} />
      <Route path="q7" element={<Q7 />} />
      <Route path="q8" element={<Q8 />} />
      <Route path="q9" element={<Q9 />} />
      <Route path="q10" element={<Q10 />} />
      <Route path="q11" element={<Q11 />} />
      <Route path="q12" element={<Q12 />} />
      <Route path="q13" element={<Q13 />} />
      <Route path="q14" element={<Q14 />} />
      <Route path="q15" element={<Q15 />} />
      <Route path="q16" element={<Q16 />} />
      <Route path="q17" element={<Q17 />} />
      <Route path="q18" element={<Q18 />} />
      <Route path="q19" element={<Q19 />} />
    </Routes>
  );
}

export default Assess;

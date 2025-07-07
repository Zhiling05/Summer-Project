import { Routes, Route } from 'react-router-dom';
import Tutorial1 from './Tutorial1';
import Tutorial2 from './Tutorial2';
import Tutorial3 from './Tutorial3';

function Tutorials() {
  return(
    <Routes>
      {/* 目前我按照prototype里设计的配置了3个页面，可根据实际情况增删，可联系lzl */}
      <Route path="tutorial-1" element={<Tutorial1 />} />
      <Route path="tutorial-2" element={<Tutorial2 />} /> 
      <Route path="tutorial-3" element={<Tutorial3 />} />
    </Routes>
    );
}

export default Tutorials;
import { useEffect, useState } from 'react';//ycl
import { useNavigate } from 'react-router-dom';
import '../styles/welcome.css';   // 只引入本页专属样式ycl2

//换成3张新的logo
// import NHSLogo from '../assets/NHSLogo2.png';
// import DIPPLogoLight from '../assets/DIPPLogo2.png';   
// import DIPPLogoDark from '../assets/DIPPLogo2_2.png';   
import NHSLogo from '../assets/NHS_LOGO.jpg';
import DIPPLogo from '../assets/DIPP_Study_logo.png'; 

export default function WelcomePage() {
  const navigate = useNavigate();
  //ycl2 多阶段动画状态
  const [phase, setPhase] = useState<'zooming'|'hold'|'fadeout'>('zooming'); // ycl2

  useEffect(() => {
    // 1. zooming 完成后进入 hold
    const t1 = setTimeout(() => {
      setPhase('hold'); // ycl2
      // 2. hold 完成后进入 fadeout
      const t2 = setTimeout(() => {
        setPhase('fadeout'); // ycl2
        // 3. fadeout 完成后跳转
        const t3 = setTimeout(() => {
          navigate('/select-role');
        }, 200); // ycl2：fadeout 持续 1000ms
        return () => clearTimeout(t3);
      }, 2000); // ycl2：hold 持续 2000ms
      return () => clearTimeout(t2);
    }, 1000); // ycl2：zooming 持续 1000ms

    return () => clearTimeout(t1);
  }, [navigate]);

  return (
    //ycl2 根据 phase 切换 class
    <div className={`welcome-screen ${phase}`}>
      <div className="logo-group">
        <img
          src={NHSLogo}
          alt="NHS logo"
          className="logo logo-small"  // ycl2
        />
        <img
          src={DIPPLogo}
          alt="DIPP Study logo"
          className="logo logo-large"  // ycl2
        />
      </div>
    </div>
  );
}

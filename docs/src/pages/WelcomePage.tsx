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
  //ycl2 动画缩放
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // 触发缩放动画
    setAnimate(true);

    // 3 秒后自动跳转到用户选择页
    const timer = setTimeout(() => {
      navigate('/select-role');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    //ycl2logo
    <div className={`welcome-screen ${animate ? 'zooming' : ''}`}>
      <div className="logo-group">
        <img
          src={NHSLogo}
          alt="NHS logo"
          className={`logo ${animate ? 'welcome-animate' : ''}`}  // ycl2
        />
        <img
          src={DIPPLogo}
          alt="DIPP Study logo"
          className={`logo ${animate ? 'welcome-animate' : ''}`}  // ycl2
        />
        {/* <img
          src={DIPPLogoLight}
          alt="DIPP Study logo light"
          className={`logo ${animate ? 'welcome-animate' : ''}`}  // ycl2
        />
        <img
          src={DIPPLogoDark}
          alt="DIPP Study logo dark"
          className={`logo ${animate ? 'welcome-animate' : ''}`}  // ycl2
        /> */}
      </div>
    </div>
  );
}

// lzl新增文件：Header组件，搭配header.css
import NHSLogo from '../assets/NHS_LOGO.jpg';
import DIPPLogo from '../assets/DIPP_Study_logo.png';
import '../styles/header.css';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="nhs-header">
      <div className="nhs-header__inner">
        <img className="logo nhs-logo" src={NHSLogo} alt="NHS logo" />
        <img className="logo dipp-logo" src={DIPPLogo} alt="DIPP Study logo" />
        <span className="nhs-header__service">{title}</span>
      </div>
    </header>
  );
}

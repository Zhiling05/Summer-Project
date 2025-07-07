// 这个文件的功能：把导航栏里的组件放在一个index.ts中，方便一次性导入。
export { default as SettingsPage } from './SettingsPage';
export { default as ContactUsPage } from './ContactUsPage';
export { default as AboutUsPage } from './AboutUsPage';


// 当你想要导入时只用写以下代码：
// import { SettingsPage, ContactUsPage, AboutUsPage } from './pages/navigation';
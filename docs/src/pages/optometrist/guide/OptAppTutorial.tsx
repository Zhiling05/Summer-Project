import { useState } from 'react';
import { useNavigate } from 'react-router-dom';//zkx
import Header from '../../../components/Header';
import BottomNav from '../../../components/BottomNav';
import BackButton from '../../../components/BackButton';
import '../../../styles/opt-app-tutorial.css';


export default function OptAppTutorial() {
  const [isOverviewStage, setIsOverviewStage] = useState(true);
  const [currentModule, setCurrentModule] = useState('home');
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();//zkx

  const modules = {
    home: { name: 'Home', steps: 1 },
    assess: { name: 'Assess', steps: 2 },
    records: { name: 'Records', steps: 2 },
    guide: { name: 'Guide', steps: 2 }
  };

  const content: {
    [key: string]: Array<{
      title?: string;
      text: string;
    }>;
  } = {
    home: [
      {
        text: "When you tap the Home icon, you will return to the role selection page where you can switch between different user types or restart your session."
      }
    ],
    assess: [
      {
        title: "Questionnaire Process",
        text: "Understanding the adaptive questionnaire system and question types."
      },
      {
        title: "Viewing Results",
        text: "How to interpret referral recommendations and next steps."
      }
    ],
    records: [
      {
        title: "Assessment History",
        text: "Navigate and review your previous patient assessments."
      },
      {
        title: "Managing Records",
        text: "Search, filter and organize your assessment data."
      }
    ],
    guide: [
      {
        title: "Reference Images",
        text: "Using the diagnostic image gallery for clinical decision support."
      },
      {
        title: "Help Resources",
        text: "Accessing tutorials and additional support materials."
      }
    ]
  };

  const switchModule = (moduleName: string) => {
    if (isOverviewStage) return;
    
    setCurrentModule(moduleName);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (isOverviewStage) {
      setIsOverviewStage(false);
      return;
    }
    
    const totalSteps = modules[currentModule as keyof typeof modules].steps;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentModule !== 'guide') {
      const moduleKeys = Object.keys(modules);
      const currentIndex = moduleKeys.indexOf(currentModule);
      if (currentIndex < moduleKeys.length - 1) {
        setCurrentModule(moduleKeys[currentIndex + 1]);
        setCurrentStep(1);
      }
    } else {
      // Tutorial completed - no action
    }
  };

  const prevStep = () => {
    if (isOverviewStage) return;
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentModule !== 'home') {
      const moduleKeys = Object.keys(modules);
      const currentIndex = moduleKeys.indexOf(currentModule);
      if (currentIndex > 0) {
        const prevModule = moduleKeys[currentIndex - 1];
        setCurrentModule(prevModule);
        setCurrentStep(modules[prevModule as keyof typeof modules].steps);
      }
    } else {
      // 如果在 home 模块的第一步，返回到概述页面
      setIsOverviewStage(true);
    }
  };

  const getCurrentContent = () => {
    if (isOverviewStage) return null;
    
    const moduleContent = content[currentModule as keyof typeof content];
    return moduleContent[currentStep - 1];
  };

  const currentContent = getCurrentContent();

  return (
    <>
      <Header title="App Tutorial for Optometrists" />
      <BackButton />

            <div className="tutorial-container">
                <div className="tutorial-inner">
                    <h1 className="tutorial-h1">App Tutorial for Optometrists</h1>

                    {!isOverviewStage && (
                        <div className="tutorial-tabs">
                            {Object.keys(modules).map((moduleName) => (
                                <button
                                    key={moduleName}
                                    className={`tutorial-tab ${currentModule === moduleName ? 'active' : ''}`}
                                    onClick={() => switchModule(moduleName)}
                                >
                                    {moduleName}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="tutorial-content">
                        {isOverviewStage && (
                            <div className="tutorial-text">
                                <p>The optometrist app provides four main functions to support your clinical practice.</p>
                                <p>Three of these functions will be particularly helpful for your clinical work. The Assess section guides you through questionnaires about patients' symptoms to determine appropriate referral recommendations. The Records section lets you view and manage your assessment history. The Guide section provides access to reference images and tutorials. You can view detailed tutorials for these sections later.</p>
                                <p>In addition to these main functions, the app includes additional features designed to enhance your user experience and support your workflow.</p>
                                <h3>Navigation Bar</h3>
                                <p>-- insert: picture of navigation buttons</p>
                                <p>The bottom navigation bar displays four icons, each representing one of the main app functions. You can navigate between any section at any time by tapping the corresponding icon. This allows you to move seamlessly between different parts of the app during your workflow.</p>
                                <h3>Settings and Information</h3>
                                <p>-- insert: picture of sidebar</p>
                                <p>A sidebar on the left side of the page provides access to settings and information about the research team. In the settings section, you can adjust features such as font size and enable dark mode for easier viewing. If you need to contact us, you can find our email address in the About Us section.</p>
                            </div>
                        )}

                        {!isOverviewStage && currentContent && (
                            <div>
                                {currentContent.title && <h2 className="tutorial-h2">{currentContent.title}</h2>}
                                <div className="tutorial-text">
                                    <p>{currentContent.text}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="tutorial-buttons">
                        <button
                            onClick={prevStep}
                            className="tutorial-button tutorial-button--prev"
                            disabled={isOverviewStage}
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={nextStep}
                            className="tutorial-button tutorial-button--next"
                            disabled={currentModule === 'guide' && currentStep === modules.guide.steps}
                        >
                            {isOverviewStage ? 'Next →' : (currentModule === 'guide' && currentStep === modules.guide.steps) ? 'Complete Tutorial' : 'Next →'}
                        </button>
                    </div>
                </div>
            </div>

            <BottomNav />
        </>
    );
}
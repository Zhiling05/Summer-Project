import { useState } from 'react';
import { useNavigate } from 'react-router-dom';//zkx
import Header from '../../../components/Header';
import BottomNav from '../../../components/BottomNav';
import BackButton from '../../../components/BackButton';
import SkipGuideButton from '../../../components/SkipGuideButton';//zkx

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

      <div
        style={{
          background: '#f0f4f5',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          minHeight: 'calc(100vh - 120px)',
          boxSizing: 'border-box',
          padding: '40px 24px 80px 24px'
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 8px',marginTop: '80px'}}>{/* zkx加了80px上边距 */}
          
          {/* 主标题 */}
          <h1
            style={{
              color: '#212b32',
              fontSize: '2rem',
              fontWeight: '700',
              margin: '0 0 16px 0',
            }}
          >
            App Tutorial for Optometrists
          </h1>
          
          {/* Module Tabs - Hidden initially */}
          {!isOverviewStage && (
            <div style={{ padding: '24px 0 16px 0', borderBottom: '2px solid #E8EDEE', marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '32px', justifyContent: 'flex-start' }}>
                {Object.keys(modules).map((moduleName) => (
                  <button
                    key={moduleName}
                    onClick={() => switchModule(moduleName)}
                    style={{
                      padding: '4px 0',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '0', 
                      borderBottom: currentModule === moduleName ? '2px solid #005eb8' : '2px solid transparent',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: currentModule === moduleName ? '#005eb8' : '#768692',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'capitalize',
                      outline: 'none', 
                      boxShadow: 'none' 
                    }}
                    onMouseEnter={(e) => {
                      if (currentModule !== moduleName) {
                        (e.target as HTMLElement).style.borderBottom = '2px solid #7C2855';
                        (e.target as HTMLElement).style.color = '#7C2855';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentModule !== moduleName) {
                        (e.target as HTMLElement).style.borderBottom = '2px solid transparent';
                        (e.target as HTMLElement).style.color = '#768692'; 
                      }
                    }}
                    onFocus={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {moduleName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div style={{ minHeight: '150px', display: 'flex', flexDirection: 'column', padding: '16px 0' }}>
            
            {/* Stage 1: Tutorial Overview */}
            {isOverviewStage && (
            <>
                <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '1rem', color: '#212b32', lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 16px 0' }}>
                    The optometrist app provides four main functions to support your clinical practice.
                    </p>
                    <p style={{ margin: '0 0 16px 0' }}>
                    Three of these functions will be particularly helpful for your clinical work. The Assess section guides you through questionnaires about patients' symptoms to determine appropriate referral recommendations. The Records section lets you view and manage your assessment history. The Guide section provides access to reference images and tutorials. You can view detailed tutorials for these sections later.
                    </p>
                    <p style={{ margin: '0 0 16px 0' }}>
                    In addition to these main functions, the app includes additional features designed to enhance your user experience and support your workflow.
                    </p>
                    
                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '600', 
                      color: '#212b32', 
                      margin: '24px 0 12px 0' 
                    }}>
                      Navigation Bar
                    </h3>
                    
                    {/* 这里插入底部导航栏的图片 */}
                    <p style={{ margin: '16px' }}>
                    -- insert: picture of navigation buttons
                    </p>
                    <p style={{ margin: '0 0 16px 0' }}>
                    The bottom navigation bar displays four icons, each representing one of the main app functions. You can navigate between any section at any time by tapping the corresponding icon. This allows you to move seamlessly between different parts of the app during your workflow.
                    </p>

                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '600', 
                      color: '#212b32', 
                      margin: '24px 0 12px 0' 
                    }}>
                      Settings and Information
                    </h3>

                    {/* 这里插入sidebar的图片 */}
                    <p style={{ margin: '16px' }}>
                    -- insert: picture of sidebar
                    </p>
                    <p style={{ margin: '0' }}>
                    A sidebar on the left side of the page provides access to settings and information about the research team. In the settings section, you can adjust features such as font size and enable dark mode for easier viewing. If you need to contact us, you can find our email address in the About Us section.
                    </p>

                </div>
                </div>
            </>
            )}

            {/* Tutorial Content */}
            {!isOverviewStage && currentContent && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  {currentContent.title && (
                    <h2 style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '600', 
                      color: '#212b32', 
                      margin: '0 0 8px 0' 
                    }}>
                      {currentContent.title}
                    </h2>
                  )}
                  <div style={{ fontSize: '1rem', color: '#212b32', lineHeight: '1.6' }}>
                    <p style={{ margin: '0' }}>
                      {currentContent.text}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
            paddingTop: '16px',
            borderTop: '2px solid #E8EDEE',
            gap: '16px'
          }}>
            <button
              onClick={prevStep}
              disabled={isOverviewStage}
              style={{
                padding: '10px 24px',
                border: '2px solid #768692',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: isOverviewStage ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#768692',
                color: 'white',
                opacity: isOverviewStage ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isOverviewStage) {
                  (e.target as HTMLElement).style.background = '#425563';
                  (e.target as HTMLElement).style.borderColor = '#425563';
                }
              }}
              onMouseLeave={(e) => {
                if (!isOverviewStage) {
                  (e.target as HTMLElement).style.background = '#768692';
                  (e.target as HTMLElement).style.borderColor = '#768692';
                }
              }}
            >
              ← Previous
            </button>
            
            <button
              onClick={nextStep}
              disabled={currentModule === 'guide' && currentStep === modules.guide.steps}
              style={{
                padding: '10px 24px',
                border: '2px solid #003087',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: (currentModule === 'guide' && currentStep === modules.guide.steps) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: (currentModule === 'guide' && currentStep === modules.guide.steps) ? '#003087' : '#005eb8',
                color: 'white',
                opacity: (currentModule === 'guide' && currentStep === modules.guide.steps) ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!(currentModule === 'guide' && currentStep === modules.guide.steps)) {
                  (e.target as HTMLElement).style.background = '#003087';
                }
              }}
              onMouseLeave={(e) => {
                if (!(currentModule === 'guide' && currentStep === modules.guide.steps)) {
                  (e.target as HTMLElement).style.background = '#005eb8';
                }
              }}
            >
              {isOverviewStage ? 'Next →' : 
               (currentModule === 'guide' && currentStep === modules.guide.steps) ? 
               'Complete Tutorial' : 'Next →'}
            </button>
          </div>

          {/* Skip Guide Button */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/assess')} // 👉 替换路径为你需要跳转的位置
              style={{
                background: 'transparent',
                color: '#005eb8',
                border: 'none',
                fontSize: '0.95rem',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Skip Guide
            </button>
          </div>

        </div>
        
      </div>

      <BottomNav />
    </>
  );
}
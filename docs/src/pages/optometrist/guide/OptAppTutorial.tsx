import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import BottomNav from '../../../components/BottomNav';
import BackButton from '../../../components/BackButton';
import '../../../styles/opt-app-tutorial.css';

/**
 * OptAppTutorial - Interactive tutorial for optometrists
 * - Provides overview and step-by-step guidance for app features
 * - Covers Home, Assess, Records, and Help modules
 */
export default function OptAppTutorial() {
  const [isOverviewStage, setIsOverviewStage] = useState(true);
  const [currentModule, setCurrentModule] = useState('home');
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();

  const modules = {
    home: { name: 'Home', steps: 1 },
    assess: { name: 'Assess', steps: 2 },
    records: { name: 'Records', steps: 2 },
    help: { name: 'Help', steps: 2 }
  };

  const content: {
    [key: string]: Array<{ title?: string; text: string }>;
  } = {
    home: [
      {
        text: "When you tap the Home icon, you will return to the role selection page where you can switch between different user types or restart your session."
      }
    ],
    assess: [
      {
        title: "Starting an Assessment",
        text: "The Assess section provides a comprehensive evaluation tool for patients with suspected papilloedema. When you tap 'Start Assessment', you'll begin a series of evidence-based clinical questions. The questionnaire uses adaptive logic - your answers determine which questions appear next, ensuring an efficient and targeted assessment. Questions cover symptoms like headache, visual disturbances, disc appearance, and associated clinical findings. Each question includes clear instructions and multiple-choice or checkbox options."
      },
      {
        title: "Understanding Results and Referrals",
        text: "After completing the questionnaire, you'll receive a specific referral recommendation based on the clinical algorithm. Results range from 'No referral required' for low-risk cases to 'Emergency Department immediately' for high-risk presentations. Each result page displays the recommendation clearly with color coding (green for low risk, orange for moderate, red for high risk). You can copy, download, or email the assessment report for your records or to include with referrals. The system automatically saves all completed assessments to your Records."
      }
    ],
    records: [
      {
        title: "Viewing Assessment History",
        text: "The Records section displays all your completed patient assessments in a chronological list. Each record shows a unique assessment ID, completion date (in DD-MM-YYYY format), and risk level classification with color-coded tags. The page includes summary statistics showing the total number of high, moderate, and low-risk assessments you've completed. You can click 'View Details' on any record to see the full assessment report and referral recommendation."
      },
      {
        title: "Filtering and Managing Records",
        text: "Use the filter options to find specific assessments quickly. You can filter by risk level (High, Moderate, Low, or All) and set date ranges using the Start Date and End Date pickers. The system supports pagination when you have many records, showing 20 assessments per page. This makes it easy to review patterns in your assessments, track referral outcomes, and maintain comprehensive documentation for clinical governance and audit purposes."
      }
    ],
    help: [
      {
        title: "Reference Image Gallery and Clinical Materials",
        text: "The Help section provides access to a comprehensive reference image gallery containing examples of papilloedema, pseudopapilloedema, and normal optic disc appearances. You can view fundus photographs alongside corresponding OCT images to better understand disc elevation, crowded discs, drusen, and normal variants. The gallery includes search and filtering capabilities to quickly find specific conditions or anatomical features relevant to your clinical assessment."
      },
      {
        title: "Clinical Guidelines and Application Support",
        text: "The Help section also contains detailed tutorials on how to use each feature of the application effectively. Learn best practices for conducting assessments, interpreting results, and managing your patient records. Find troubleshooting guides, frequently asked questions, and tips for integrating the tool into your clinical workflow. You can also access information about the research behind this tool and how to provide feedback to help improve the system for all users."
      }
    ]
  };

  /** Switch between tutorial modules */
  const switchModule = (moduleName: string) => {
    if (isOverviewStage) return;
    setCurrentModule(moduleName);
    setCurrentStep(1);
  };

  /** Go to next step or next module */
  const nextStep = () => {
    if (isOverviewStage) {
      setIsOverviewStage(false);
      return;
    }
    const totalSteps = modules[currentModule as keyof typeof modules].steps;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentModule !== 'help') {
      const moduleKeys = Object.keys(modules);
      const currentIndex = moduleKeys.indexOf(currentModule);
      if (currentIndex < moduleKeys.length - 1) {
        setCurrentModule(moduleKeys[currentIndex + 1]);
        setCurrentStep(1);
      }
    }
  };

  /** Go to previous step or back to overview */
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
      // At first step of home module → return to overview
      setIsOverviewStage(true);
    }
  };

  /** Get current tutorial content */
  const getCurrentContent = () => {
    if (isOverviewStage) return null;
    const moduleContent = content[currentModule as keyof typeof content];
    return moduleContent[currentStep - 1];
  };

  const currentContent = getCurrentContent();

  return (
    <>
      <Header title="App Tutorial" />


      <div className="tutorial-container">
        <div className="tutorial-inner">
          <BackButton />
          <h1 className="tutorial-h1">App Tutorial for Optometrists</h1>

          {!isOverviewStage && (
            <div className="tutorial-tabs">
              {Object.keys(modules).map((moduleName) => (
                <button
                  key={moduleName}
                  className={`tutorial-tab ${currentModule === moduleName ? 'active' : ''}`}
                  onClick={() => switchModule(moduleName)}
                >
                  {modules[moduleName as keyof typeof modules].name}
                </button>
              ))}
            </div>
          )}

          <div className="tutorial-content">
            {isOverviewStage && (
              <div className="tutorial-text">
                <p>The optometrist app provides four main functions to support your clinical practice.</p>
                <p>Three of these functions will be particularly helpful for your clinical work. The Assess section guides you through questionnaires about patients' symptoms to determine appropriate referral recommendations. The Records section lets you view and manage your assessment history. The Help section provides access to reference materials and tutorials.</p>
                <p>In addition to these main functions, the app includes additional features designed to enhance your user experience and support your workflow.</p>
                <h3>Navigation Bar</h3>
                <p>The bottom navigation bar displays four icons, each representing one of the main app functions. You can navigate between any section at any time by tapping the corresponding icon. This allows you to move seamlessly between different parts of the app during your workflow.</p>
                <h3>Settings and Information</h3>
                <p>A sidebar on the left side of the page provides access to settings and information about the research team. In the settings section, you can adjust features such as font size for easier viewing. If you need to contact us, you can find our email address in the About Us section.</p>
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
              disabled={currentModule === 'help' && currentStep === modules.help.steps}
            >
              {isOverviewStage
                ? 'Next →'
                : (currentModule === 'help' && currentStep === modules.help.steps)
                ? 'Complete Tutorial'
                : 'Next →'}
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}

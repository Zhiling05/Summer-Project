# Engineering Handover Documentation

You can access the current development software online through the following link:

Production Environment: https://dipp-frontend.onrender.com

Administrator Password: admin123

------

## Table of Contents

- [Engineering Handover Documentation](#engineering-handover-documentation)
  - [Table of Contents](#table-of-contents)
  - [Development Progress](#development-progress)
  - [Code Access](#code-access)
  - [Deployment Environment Information](#deployment-environment-information)
  - [Technical Architecture](#technical-architecture)
  - [Project File Structure](#project-file-structure)
  - [Code Documentation](#code-documentation)
    - [Frontend Application (docs/)](#frontend-application-docs)
      - [**Shared Components (`src/components/`)**](#shared-components-srccomponents)
      - [Optometrist Module (`src/pages/optometrist/`)](#optometrist-module-srcpagesoptometrist)
      - [Administrator Module (`src/pages/admin/`)](#administrator-module-srcpagesadmin)
      - [Sidebar Functionality (`src/pages/sidebar/`)](#sidebar-functionality-srcpagessidebar)
      - [Core Utility Functions (`src/utils/`)](#core-utility-functions-srcutils)
      - [Styling System (`src/styles/`)](#styling-system-srcstyles)
      - [Configuration Files (`src/data/`)](#configuration-files-srcdata)
      - [Test Files (`src/tests/`)](#test-files-srctests)
    - [Backend Service (server/)](#backend-service-server)
      - [API Route Design](#api-route-design)
      - [Report System](#report-system)
      - [Data Models](#data-models)
      - [Utility Functions](#utility-functions)
      - [Middleware](#middleware)
  - [Development Environment Setup](#development-environment-setup)
    - [Frontend Development](#frontend-development)
    - [Backend Development](#backend-development)
    - [Environment Variable Configuration](#environment-variable-configuration)
  - [New Role Module Development Guide](#new-role-module-development-guide)
    - [Development Steps](#development-steps)
    - [Reusable Components](#reusable-components)
  - [Contact Information](#contact-information)



## Development Progress

**Optometrist Module**: Fully functional, including questionnaire assessment, result recommendations, record management, and reference materials

**Administrator Console**: Data statistics and system management functionality

**Core Infrastructure**: User authentication, API interfaces, database design



## Code Access

This project code is currently hosted in the original development team's personal GitHub repository.

If you have been granted permission to continue developing this software, please Fork this repository: https://github.com/Zhiling05/Summer-Project.git



## Deployment Environment Information

**Current Deployment Status**

- Deployment Platform: Render.com (original development team's personal account), free tier
- Deployment Branch: `develop` branch
- Production URL: https://dipp-frontend.onrender.com

**Deployment Recommendations for Receiving Team**

- **Recommended to use `main` branch**: Since our team only developed the Optometrist role functionality, we chose the `develop` branch for deployment. However, the `main` branch contains the complete functionality of the `develop` branch and is suitable for final production deployment and future development.
- We recommend the new team establish a completely independent deployment environment.



## Technical Architecture

**Frontend Technology Stack**

- React 18 + TypeScript
- Vite
- React Router v6
- CSS - NHS Design System Standards
- Session Storage

**Backend Technology Stack**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication - Token-based authentication
- File Export



## Project File Structure

For detailed project file structure, please refer to the `full_project_tree.txt` file.

In addition to the core code files, the root directory contains some additional documents. The `app_documentation` folder contains documents related to software functionality development during the project development process, such as route structure, UI/UX design, testing instructions, etc. The `project_management` folder contains documents related to project management, mainly including meeting records and sprint-related files, etc. These documents can be deleted during subsequent development.



## Code Documentation

### Frontend Application (docs/)

#### **Shared Components (`src/components/`)**

- `Header.tsx` - Top navigation bar containing NHS branding and page titles
- `BottomNav.tsx` - Bottom navigation bar for main function switching, includes navigation guard logic
- `SideBar.tsx` - Sidebar menu containing settings and contact information
- `BackButton.tsx` - Smart back button supporting questionnaire history navigation
- `PopupWindow.tsx` - Generic modal dialog component

------

#### Optometrist Module (`src/pages/optometrist/`)

**Assessment System (`assess/`)**

- `StartPage.tsx` - Assessment entry page, checks tutorial status and guides users to start assessment
- `DynamicQuestion.tsx` - Core questionnaire component handling dynamic question rendering, answer validation, and navigation logic
- `DynamicRecommendation.tsx` - Results display page including report preview, copy, download, and email functionality
- `AssessRouter.tsx` - Assessment flow router controller handling automatic recovery of incomplete assessments

**Record Management**

- `Records.tsx` - Assessment history page supporting risk level filtering, date range filtering, and pagination

**Help Guide (`guide/`)**

- `GuideHome.tsx` - Help center homepage providing function entry points
- `ImageGallery.tsx` - Medical reference image library containing categorized images of papilledema, pseudopapilledema, etc., with modal viewing and zoom functionality
- `OptAppTutorial.tsx` - Modular application usage tutorial

**Other Features**

- `Tutorial.tsx` -  Interactive onboarding tutorial that automatically appears on first software use
- `OptometristApp.tsx` - Main router component for optometrist module

------

#### Administrator Module (`src/pages/admin/`)

- `Admin.tsx` - Administrator console providing global data statistics, multi-dimensional filtering, and risk analysis functionality

------

#### Sidebar Functionality (`src/pages/sidebar/`)

- `SettingsPage.tsx` - User settings page including font size adjustment
- `ContactPage.tsx` - Contact information page
- `FontSizeContext.tsx` - React Context management for font size

------

#### Core Utility Functions (`src/utils/`)

- `NavigationLogic.ts` - Questionnaire navigation logic handling three navigation types: simple mapping, conditional judgment, cross-question validation
- `ValidationLogic.ts` - Answer validation logic supporting single-choice, multiple-choice question types and mutually exclusive option handling

------

#### Styling System (`src/styles/`)

- `theme.css` - Global theme variables including NHS color specifications and responsive breakpoints
- Module-specific CSS - Such as question.css, records.css, admin.css, etc., each file contains complete style definitions for corresponding modules

------

#### Configuration Files (`src/data/`)

- questionnaire.json - Complete questionnaire configuration including definitions, options, navigation rules, and symptom mapping for 40 questions
- recommendations.json - Recommendation result configuration defining display styles and color themes for 7 recommendation types

------

#### Test Files (`src/tests/`)

Contains comprehensive unit tests, integration tests, and snapshot tests covering component rendering, navigation logic, and validation functionality.



### Backend Service (server/)

#### API Route Design

**Authentication Routes (`routes/auth.js`)**

- `POST /api/guest` - Create guest session, generate JWT token
- `POST /api/admin/login` - Administrator login verification
- `POST /api/logout` - Clear authentication cookies
- `GET /api/whoami` - Get current user identity information

**Assessment Management (`routes/assessments.js`)**

- `GET /api/assessments` - Get assessment list supporting risk level, date range, and scope filtering
- `POST /api/assessments` - Create new assessment record
- `GET /api/assessments/:id` - Get individual assessment details
- `GET /api/statistics/risk-levels` - Get risk level statistics data
- `POST /api/extract-symptoms` - Extract symptom keywords from answers

------

#### Report System

- routes/report.js - `GET /api/assessments/:id/report` Generate report preview text
- routes/export.js - `GET /api/assessments/:id/export` Export report files

------

#### Data Models

**Assessment Model (`models/Assessment.js`)**

MongoDB collection structure containing the following main fields:

- `userId` - User identifier for data isolation
- `customId` - Custom assessment ID in format ddMMyyyy_001
- `role` - User role (optometrist/gp/patient etc.)
- `answers` - Question-answer record array
- `symptoms` - Extracted symptom keywords
- `recommendation` - Final recommendation result
- `createdAt` - Creation time supporting TTL automatic expiration

------

#### Utility Functions

**Symptom Extraction (`utils/symptoms.js`)**

- Defines complete symptom mapping rules
- Automatically extracts clinically relevant symptom keywords from user answers
- Supports complex conditional judgment and multiple option handling

**Report Generation (`utils/doc.js`)**

- Generates standardized assessment report text
- Supports multiple format exports (currently TXT format)
- Includes assessment ID, date, symptom list, and recommendation results

------

#### Middleware

**Authentication Middleware (`middleware/auth-guard.js`)**

- JWT token verification
- User identity recognition
- Route protection functionality



## Development Environment Setup

### Frontend Development

```bash
cd docs
npm install        # Install dependencies
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Production build
npm test           # Run test suite
```

### Backend Development

```bash
cd server
npm install        # Install dependencies
npm start          # Start API server (http://localhost:4000)
```

### Environment Variable Configuration

**Frontend** (`.env.development` / `.env.production`)

```env
VITE_API_BASE=/api  # API base path
```

**Backend** (`.env`)

```env
MONGO_URI=mongodb://...           # MongoDB connection string
JWT_SECRET=your-secret-key        # JWT signing key
ADMIN_PASSWORD=admin123           # Administrator login password
FRONTEND_ORIGIN=http://localhost:5173  # Allowed frontend domain
```



## New Role Module Development Guide

### Development Steps

1. **Create Module Directory Structure**

2. **Configure Routes** Add new role routes in `App.tsx`:

```typescript
<Route path="/[role]/*" element={<[Role]App />} />
```

3. **Create Questionnaire Configuration**

- Develop role-specific questionnaire JSON files
- Define recommendation result mapping
- Configure symptom extraction rules

4. **Implement Core Pages**

- Reuse component structure under assess directory
- Adjust `Records` page filtering logic
- Customize `help` guide content



### Reusable Components

- All shared components can be directly reused
- `DynamicQuestion` component supports any questionnaire configuration
- `Records` component only needs API endpoint adjustments
- Styling system is completely reusable



## Contact Information

For technical support or project handover assistance, please contact original development team member Zhiling Liu, email: [liuzhilingwh@163.com](mailto:liuzhilingwh@163.com)
## Architecture Team Documentation

### Project Setup

1. Pull the `docs` folder from the develop branch to your own branch

   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-branch-name
   git checkout origin/develop -- docs/
   ```

2. Open the project with VSCode and open the terminal

3. Run the command: `npm install` to download all dependencies

4. Run the command: `npm run dev`to verify the installation. If you can see:

   - Terminal displays "Local: http://localhost:5173"
   - Browser can open the project normally
   - No error messages
   - You can see the Logo Page title

   Then you can start development! 👾



### Current Routing Structure

```
src
 |-- App.tsx (Main routing, includes logo page + user role selection page + path entry for each role's App)
 |__ types
      |__ assessment.ts 
      |__ recommendations.ts 
 |__ pages
      |__ LogoPage.tsx 
      |__ WelcomePage.tsx
      |__ UserSelectionPage.tsx  
      |__ sidebar
   		   |__ SettingsPage.tsx 
           |__ AboutPage.tsx
           |__ ContactPage.tsx 
           |__ index.ts (Click to see details)
      |__ gp
      |__ patient
      |__ optometrist
           |__ OptometristApp.tsx 
           |__ OptometristHome.tsx
           |__ Guide.tsx
           |__ Records.tsx 
           |__ assess
                 |__ AssessRouter.tsx (Main routing for assessment, manages all routes under assess)
                 |__ StartPage.tsx 
                 |__ questions
                       |__ QuestionsRouter.tsx (Manages all question routes)
                       |__ Q1.tsx
                       |__ Q2.tsx
                       |__ ...(Q3-Q19)
                 |__ recommendations
                       |__ RecommendationsRouter.tsx (Manages all result routes)
                       |__ ...(6 types of result route)
           |__ tutorial
                 |__ TutorialRouter.tsx (Manages all tutorial routes. If the page development for each character going forward uses the same layout, and the tutorials are also the same, I will move it to global use pages.)
                 |__ Tutorial1.tsx
                 |__ Tutorial2.tsx
                 |__ Totorial3.tsx (Currently configured three pages per prototype, will add/remove as needed)
```


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
      |__ assessment.ts (Interface for 19 questions variables, please strictly follow this specification for future development)
      |__ recommendations.ts  (Interface for 6 referral result variables, same as above)
 |__ pages
      |__ LogoPage.tsx (Logo display page when entering the app)
      |__ UserSelectionPage.tsx  (Home page for each user role's App, extracted separately as it's common)
      |__ gp
      |__ patient
      |__ optometrist
           |__ OptometristApp.tsx (Manages all routes under optometrist version)
           |__ Guide.tsx
           |__ Records.tsx (Records page may only need one page, can develop directly on this basis)
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
                       |__ ...(6 types of result route .tsx files)
           |__ tutorial
                 |__ TutorialRouter.tsx (Manages all tutorial routes. If the page development for each character going forward uses the same layout, and the tutorials are also the same, I will move it to global use pages.)
                 |__ Tutorial1.tsx
                 |__ Tutorial2.tsx
                 |__ Totorial3.tsx (Currently configured three pages per prototype, will add/remove as needed)
      |__ navigation (Navigation bar pages (Settings, About Us, Contact Us) are grouped in one folder for single import via index.ts instead of individual imports. See /index.ts.)
           |__ SettingsPage.tsx 
           |__ AboutUsPage.tsx
           |__ ContactUsPage.tsx (Note: Routes for these three files are in App.tsx as they're global (no character distinction))
           |__ index.ts (Click to see details)
```



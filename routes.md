# Front-End Route Map

| Role               | Page       | URL Path                  | Component Entry File (relative to `docs/src/`)                       |
|--------------------|------------|---------------------------|----------------------------------------------------------------------|
| **Optometrist**    | Home       | `/optometrist/home`       | `pages/optometrist/OptometristHome.tsx`                              |
|                    | Assess     | `/optometrist/assess`     | `pages/optometrist/assess/AssessRouter.tsx`                         |
|                    | Guide      | `/optometrist/guide`      | `pages/optometrist/Guide.tsx`                                        |
|                    | Records    | `/optometrist/records`    | `pages/optometrist/Records.tsx`                                      |
|                    | Tutorial   | `/optometrist/tutorial`   | `pages/optometrist/tutorial/TutorialRouter.tsx`                      |
| **GP**             | Home       | `/gp/home`                | `pages/gp/GPApp.tsx`                                                 |
|                    | Assess*    | `/gp/assess`              | *placeholder*                                                        |
|                    | Guide*     | `/gp/guide`               | *placeholder*                                                        |
|                    | Records*   | `/gp/records`             | *placeholder*                                                        |
|                    | Tutorial*  | `/gp/tutorial`            | *placeholder*                                                        |
| **Patient**        | Home       | `/patient/home`           | `pages/patient/PatientApp.tsx`                                       |
|                    | Assess*    | `/patient/assess`         | *placeholder*                                                        |
|                    | Guide*     | `/patient/guide`          | *placeholder*                                                        |
|                    | Records*   | `/patient/records`        | *placeholder*                                                        |
|                    | Tutorial*  | `/patient/tutorial`       | *placeholder*                                                        |
| **Global Sidebar** | Settings   | `/settings`               | `pages/sidebar/SettingsPage.tsx`                                     |
|                    | About      | `/about`                  | `pages/sidebar/AboutPage.tsx`                                        |
|                    | Contact    | `/contact`                | `pages/sidebar/ContactPage.tsx`                                      |

\* Rows marked “*” are placeholders for routes/components not yet implemented.  
Update this table whenever you add, rename, or remove routes to keep everyone in sync.  

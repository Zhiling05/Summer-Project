# Front-End Route Map

| Role          | Page        | URL Path                 | Component Entry File (relative to `docs/src/`)                           |
|---------------|-------------|--------------------------|---------------------------------------------------------------------------|
| **Optometrist** | Home        | /optometrist/home       | pages/optometrist/OptometristHome.tsx                                     |
|               | Assess      | /optometrist/assess     | pages/optometrist/assess/AssessRouter.tsx                                 |
|               | Guide       | /optometrist/guide      | pages/optometrist/Guide.tsx                                               |
|               | Records     | /optometrist/records    | pages/optometrist/Records.tsx                                             |
|               | **Tutorial**| /optometrist/tutorial   | pages/optometrist/tutorial/TutorialRouter.tsx                             |
| **GP**        | Home        | /gp/home                | pages/gp/GPApp.tsx                                                        |
|               | Assess*     | /gp/assess              | _placeholder: pages/gp/assess/_                                           |
|               | Guide*      | /gp/guide               | _placeholder_                                                             |
|               | Records*    | /gp/records             | _placeholder_                                                             |
|               | **Tutorial* | /gp/tutorial            | _placeholder: pages/gp/tutorial/TutorialRouter.tsx_                       |
| **Patient**   | Home        | /patient/home           | pages/patient/PatientApp.tsx                                              |
|               | Assess*     | /patient/assess         | _placeholder: pages/patient/assess/_                                      |
|               | Guide*      | /patient/guide          | _placeholder_                                                             |
|               | Records*    | /patient/records        | _placeholder_                                                             |
|               | **Tutorial* | /patient/tutorial       | _placeholder: pages/patient/tutorial/TutorialRouter.tsx_                  |
| **Global Sidebar** | Settings    | /settings             | pages/sidebar/SettingsPage.tsx                                            |
|               | About       | /about                 | pages/sidebar/AboutPage.tsx                                               |
|               | Contact     | /contact               | pages/sidebar/ContactPage.tsx                                             |

\* Rows marked “placeholder” mean the component/page has not yet been implemented.  
Update this table whenever you add, rename, or remove routes to keep everyone in sync.

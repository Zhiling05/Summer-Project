# Front-End Route Map

| Role         | Page        | URL Path               | Component Entry File                      |
|--------------|-------------|------------------------|-------------------------------------------|
| **Optometrist** | Home      | /optometrist/home     | pages/...                                 |
|              | Assess      | /optometrist/assess   | pages/...                                 |
|              | Guide       | /optometrist/guide    | pages/...                                 |
|              | Records     | /optometrist/records  | pages/...                                 |
|              | Tutorial    | /optometrist/tutorial | pages/...                                 |
| **GP**       | Home        | /gp/home              | pages/gp/GPApp.tsx                        |
|              | Assess*     | /gp/assess            | placeholder                               |
|              | Guide*      | /gp/guide             | placeholder                               |
|              | Records*    | /gp/records           | placeholder                               |
|              | Tutorial*   | /gp/tutorial          | placeholder                               |
| **Patient**  | Home        | /patient/home         | pages/patient/PatientApp.tsx              |
|              | Assess*     | /patient/assess       | placeholder                               |
|              | Guide*      | /patient/guide        | placeholder                               |
|              | Records*    | /patient/records      | placeholder                               |
|              | Tutorial*   | /patient/tutorial     | placeholder                               |
| **Global Sidebar** | Settings | /settings         | pages/sidebar/SettingsPage.tsx            |
|              | About       | /about                | pages/sidebar/AboutPage.tsx               |
|              | Contact     | /contact              | pages/sidebar/ContactPage.tsx             |


\* Rows marked “placeholder” mean the component/page has not yet been implemented.  
Update this table whenever you add, rename, or remove routes to keep everyone in sync.

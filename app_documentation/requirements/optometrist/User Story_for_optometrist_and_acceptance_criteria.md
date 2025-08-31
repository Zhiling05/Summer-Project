*The acceptance criteria primarily focus on verifiability, functional completeness, edge case error handling, and UI/UX considerations*

### user story 1

**As an optometrist,<br>
I want the diagnostic conclusion output to align with the content of the clinical guideline, <br>
so that I can make traceable and reliable clinical decisions.**

| ID   | Acceptance Criteria                                                                                                                                                                                                                                        | Category                                   |
|------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| AC1  | Given the system generates a diagnostic conclusion,<br>When the result is presented to the user,<br>Then it must correspond to a specific path or statement found in the official guideline document                                                       | Verifiability                              |
| AC2  | Given the system is using a diagnostic pathway structure,<br>When the flowchart is constructed or updated,<br>Then it must follow the logical sequence and content of the PDF-based guideline flowchart,<br>Then it must be manually reviewed for accuracy | Structural integrity / Manual verification |

<br>



### user story 2
**As an optometrist,<br>
I want to click and return to any previously answered decision and modify my answer,<br>
so that I can reassess based on new findings.**

| ID  | Acceptance Criteria                                                                                                                                                                                                                                                                                         v   | Category                 |
|-----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| AC1 | Given the user is on an evaluation page,<br>When the page is displayed,<br>Then the user should see the decision history of the current path,<br>Then the history should show all previously answered questions and corresponding answers                                                                       | Visibility               |
| AC2 | Given the user is viewing the decision history,<br>When the user clicks on any completed node,<br>Then they should be navigated back to that step,<br>Then they should be allowed to change their answer,<br>And all subsequent steps after that node must be automatically refreshed according to their answer | Interaction / Navigation |
| AC3 | Given the user has edited a previous answer,<br>When the system updates the evaluation flow,<br>Then the user should be able to continue the evaluation from the updated position                                                                                                                               | UX                       |
| AC4 | Given the user is on a question within the decision flow,<br>When the question is displayed,<br>Then the current question should be visually highlighted to help the user identify their position in the decision flow                                                                                          | UI / UX                  |


<br>


### user story 3
**As an optometrist, <br>
I want the selected option to be highlighted when I click on any option, <br>
so that I can clearly confirm my selection.**

| ID   | Acceptance Criteria                                                                                                                        | Category |
|------|--------------------------------------------------------------------------------------------------------------------------------------------|----------|
| AC1  | Given the optometrist has entered the assessment flow, <br>when the user clicks on any option, <br>then that option should be highlighted. | UI/UX    |

<br>


### user story 4
**As an optometrist,<br>
when the assessment page is closed intentionally or accidentally,<br>
I want my progress to be saved automatically,<br>
so that I can resume my work seamlessly when I return to the assessment flow.**

| ID   | Acceptance Criteria                                                                                                                                                                                                                                              | Category                   |
|------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|
| AC1  | Given the user accidentally exits the app,<br>When the user returns to the app,<br>Then a prompt should appear saying “You exited unexpectedly” and ask whether the user wants to resume the previous assessment or start a new one.                             | Edge Case & Error Handling |
| AC2  | Given the optometrist navigate away to any other page intentionally, when the optometrist return to the assessment page<br>then the system should let the optometrist to choose whether they want to “Continue previous assessment”or “Start a new assessment”   | Edge Case & Error Handling |
| AC3  | Given the user returns to the assessment page for any reason,<br>When the user chooses to resume the previous assessment,<br>Then they should be navigated back to the exact page where they left off.                                                           | Functional Integrity       |
| AC4  | Given the user returns to the assessment page for any reason,<br>When the user chooses to start a new assessment,<br>Then any previously saved data should be discarded and the assessment should begin from the first page.                                     | Functional Integrity       |

<br>


### user story 5
**As an optometrist with age-related or impaired vision, <br>
I want adjustable font sizes, <br>
so that I can read content comfortably.**

| ID  | Acceptance Criteria                                                                                                                 | Category                              |
|-----|-------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| AC1 | Given the optometrist opens the settings menu,<br>When they adjust the font size,<br>Then interface text should update immediately  | Functional Completeness/Accessibility |

<br>

### user story 6

**As an optometrist using the system for the first time,<br> 
I want a clear and brief tutorial, <br>
so that I can quickly understand how to use the system.**

| ID  | Acceptance Criteria                                                                                                                                                                                                                                                                                                                                                                   | Category                        |
|-----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| AC1 | Given the user is using the system for the first time<br>,When they enter the system<br>Then the system should prompt the user asking whether they would like to start a tutorial. <br>And when they select "Yes", <br>then it should clearly explain the assessment workflow.<br> And when they select "No", <br>then they should be taken directly to the assessment starting page. | Functional Completeness         |
| AC2 | Given user has chosen to view the tutorial after being prompted,When they are viewing the tutorial,<br>, then they will be given a "Next" option,<br>And when the user clicks the “Next” button,<br>Then the system should advance to the next step of the tutorial.                                                                                                                  | Functional Completeness/ UI/UX  |
| AC3 | Given the user has chosen to view the tutorial and entered the tutorial screen.<br>When the user clicks "Exit" during any step of the tutorial,<br>Then the system should immediately exit the entire tutorial,and take the user directly to the home page without requiring the user to finish the remaining steps.                                                                  | Functional Completeness/ UI/UX  |
| AC4 | Given the user dismissed or completed the tutorial,<br>When they later want to view it again,<br>Then they should be able to access the tutorial manually from the Guide page.                                                                                                                                                                                                        | Functional Completeness/ UI/UX  |

<br>

### user story 7

**As an optometrist,<br>
I want to generate a PDF/txt/docs version of the diagnostic outcome after completing the assessment process,<br>
so that I can use it as a documented record for referral purposes.**


| ID   | Acceptance Criteria                                          | Category                              |
| ---- | ------------------------------------------------------------ | ------------------------------------- |
| AC1  | Given the user has completed the assessment and received a referral outcome,<br>When the results page is displayed,<br>Then the “Download PDF/txt/docs” button should be visible and enabled. | Verifiability/Functional Completeness |
| AC2  | Given the "Download PDF/txt/docs" button is visible,<br>When the user clicks the “Download PDF/txt/docs” button,<br>Then the user should be able to choose between downloading a full version or a summary version.<br>And when user select to download a full version PDF/txt/docs,<br>Then it should include symptoms found during the assessment workflow, referral recommendation and all assessment questions and answers.<br>And when user select to download a summary version PDF,<br>Then it should include only key symptoms and referral recommendations. | Verifiability/Functional Completeness |


<br>


### user story 8

**As an optometrist,
I want to have access to example reference images with diagnostic guidance,
so that I can improve my diagnostic accuracy when encountering borderline or ambiguous cases.**

| ID  | Acceptance Criteria                                                                                                                                                                                                                                                                                                                   | Category                              |
|-----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| AC1 | Given the user is using the system,<br>When the user navigates to the Guide section,<br>Then they should be presented with a button labeled "Reference Image Gallery",<br>And when the user clicks the "Reference Image Gallery" button,<br>Then the system should navigate to a separate page containing diagnostic reference images | Verifiability/Functional Completeness |
| AC2 | Given the user is viewing the reference image gallery,<br>When the user clicks on any image,<br>Then the image should open in an enlarged view mode,<br>And the user should be able to zoom in and out on the image                                                                                                                   | Verifiability/Functional Completeness |
| AC3 | Given the user is browsing the image gallery page,<br>When the user selects any image category (e.g., "Typical Edema" or "Blurred Margins"),<br>Then the system should display the corresponding image thumbnails,<br>And each thumbnail should be accompanied by key diagnostic notes                                                | Functional Completeness               |
| AC4 | Given the user clicks on multiple image examples in succession,<br>When switching between images or zooming in on an image,<br>Then the loading time should not exceed 1 second, and the page should remain smooth without lag.                                                                                                       | Performance/UIUX                      |

<br>

### user story 9

**As an optometrist,<br>
I want to view my past assessment records in a dedicated Records page,<br>
so that I can review previous outcomes and referral decisions at any time.**

| ID  | Acceptance Criteria                                                                                                                                                                                 | Category                               |
|-----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| AC1 | Given the optometrists enter the app,<br>When they navigate to the “Records” page,<br>Then the system should display a list of their previously completed assessments.                              | Verifiability/Functional Completeness  |
| AC2 | Given the optometrist has not completed any assessments yet,<br>When they navigate to the Records page,<br>Then the system should display a friendly message such as:<br>“You have no records yet.” | Verifiability/Functional Completeness. | 

<br>


### user story 10

**As an optometrist,<br>
I want to categorize my completed patient assessments based on urgency levels using visual tags (e.g., red, yellow, green),<br>
so that I can efficiently locate the relevant patient records when reviewing past diagnostic workflows.**

| ID  | Acceptance Criteria                                                                                                                                                                                                                                              | Category                |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| AC1 | Given the optometrist is performing a diagnostic assessment,<br>When a diagnosis is completed,<br>Then the system should assign an urgency tag to the result,<br>And developer should assign a color to the tag,<br>And all tag should be stored in database.    | Functional Completeness |
| AC2 | Given the optometrist has completed the assessment,<br>When the user reaches the referral recommendation page,<br>Then the referral suggestion should be visually color-coded according to its level of urgency, so that the priority is easily distinguishable. | UIUX/Verifiability      |
| AC3 | Given the optometrist is on the Record page,<br>When the page loads,<br>Then a tag filter dropdown should be visible at the top of the page.                                                                                                                     | Functional Completeness |
| AC4 | Given the optometrist is on the Record page,<br>When they click on or select a tag filter (e.g., Red tag: "Immediate/urgent referral cases"),<br>Then the system should display only entries that match the selected urgency level                               | Functional Completeness |
| AC5 | Given the user enters the Records page,<br>When the list of previous assessment records is displayed,<br>Then each record should be accompanied by a visible colored tag representing its urgency level.                                                         | Functional Completeness |










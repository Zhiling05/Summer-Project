# 1. Optometrists: Think Aloud + SUS

## 1.1 System Trial & Issue Identification
**Objective:** Simulate normal usage to discover issues in the interface and interactions.  
- **Estimated Duration:** 10–15 mins  

**Evaluator trials the system and completes a set of assigned tasks:**

- **Task 1:** Enter the optometrist pathway and start the assessment  
  - Open the system Home page  
  - Select `"I am an Optometrist"` to enter the questionnaire start page  
  - Click `"Start Now"`  

- **Task 2:** Complete one full questionnaire assessment and return to modify or restart it  
  - Randomly fill in one round of the questionnaire until redirected to the recommendation page (e.g., *Immediate Referral*)  
  - Try going back to a previous question from the middle of the questionnaire or restarting from the results page  

- **Task 3:** View and export the report
  - On the recommendation page, click `"Preview Report"`  
  - Try clicking `"Download TXT"` or `"Send via Email"`  

- **Task 4:** Go to the Records page and try filtering results  
  - Click **Records** on the bottom navigation bar  
  - Observe the page structure (High/Medium/Low risk color blocks + table)  
  - Try filtering using the **Risk Level** dropdown  
  - Try setting **Start Date** and **End Date** to view records  

- **Task 5:** Visit the Guide page  
  - Click **Guide** on the bottom navigation bar  
  - Go to **Reference Image Gallery** and find an image for *Peripapillary retinal folds*  
  - Go to **App Tutorial for Optometrists** and read the content  

- **Task 6:** Open the sidebar menu and browse 3 subpages  
  - Click the **≡** button in the top left → visit:  
    - **About Us** – observe the content  
    - **Settings** – observe font sizes and buttons  
    - **Contact Us** – observe contact information  

## 1.2 During the tasks — ‘Think Aloud’ method:
- Only point out confusion encountered during usage:  
  - Which content you didn’t understand  
  - Which actions you didn’t know where to click  
  - Which medical terms were difficult to understand  
- You may express issues verbally at any time; team members will assist with recording.  

**Note:** Record problem location and description in full.  

**Sample guiding questions:**  
- Was there any part where you felt uncertain or confused?  
- Was there any button you hesitated to click?  
- Was there any content you didn’t quite understand?  
- Was there anything you felt “should be there but wasn’t”?  

## 1.3 After completing the tasks — SUS Questionnaire:
**Estimated Duration:** 1–2 mins  
- Distribute the SUS questionnaire immediately after the tasks (10 statements, 5-point agreement scale).  
- Participants score each statement based on their recent experience (1 = Strongly Disagree, 5 = Strongly Agree).  
- Ensure participants complete the questionnaire independently, without discussing answers.  

**Note:** Evaluators should only provide technical help when necessary, without interfering with the participant’s operation or responses.  
Participants may take notes during system use to assist in completing the questionnaire later.  

---

# 2. Students: Heuristic Evaluation + SUS

## 2.1 Heuristic Evaluation
- **Estimated Duration:** 10–15 mins  

### 2.1.1 Trial System and Problem Discovery
All assessors use the system separately and record the problems or confusions encountered during operation.  
- Participants in the evaluation independently test the system while considering whether there are User Experience issues in combination with heuristic principles  
- Record the problem description on your own and initially attempt to classify the problem type (refer to Appendix B: Common Problem Types)  

**Note:** In subsequent stages, team members will rate the severity of the issue based on the issue description, so the description should be detailed and fully documented.  

**Sample guiding questions:**  
- Is there any part that you feel unsure or confused about?  
- Is there any button that makes you hesitate whether to click?  
- Is there any content you don’t quite understand?  
- Is there anything you think “should exist but doesn’t”?  

## 2.2 System Usability Scale (SUS)
- **Estimated Duration:** 1–2 mins  

### 2.2.1 Questionnaire Completion:
- Immediately distribute the SUS questionnaire (10 statements, five-level agreement rating) after the task is completed.  
- Participants rate each question based on their recent usage experience (1 = Strongly Disagree, 5 = Strongly Agree).  
- Ensure that participants complete the questionnaire independently without discussing answers with each other.  

**Note:** Evaluators only provide technical assistance when necessary and do not interfere with the participants' operations and filling processes.  
Allows participants to take notes at any time during the use of the system (for easy reference when filling out the questionnaire later).  

---

## Appendix A – Problem Record Form (Example & Column Meanings)

### Example Entry
| Page Location     | Issue Description                                | Issue Type               | Frequency | Severity Score | Duplicate | Average Severity |
| ----------------- | ------------------------------------------------ | ------------------------ | --------- | -------------- | --------- | ---------------- |
| Question Page Q3  | No “Back” button, cannot change previous selection | User Control & Freedom   | 3 users   | 2+3+3=8         | Yes       | 8/3 = 2.67       |

### Column Name Meanings
| Column Name  | Meaning |
| ------------ | ------- |
| Interface    | The interface where the issue occurs |
| Issue        | Description of the issue |
| Heuristic(s) | The violated heuristic principle(s) |
| Frequency    | Occurrence frequency (0–4) |
| Impact       | Degree of impact on the user (0–4) |
| Persistence  | Whether the issue recurs (0–4) |
| Severity     | Average severity = (F + I + P) / 3 |

---

## Appendix B – Types of Common Usability Issues (Revised from Nielsen’s 10 Heuristics)

| Principle                   | Description |
| --------------------------- | ----------- |
| Visibility of System Status | Does the system inform me what it is doing? Does it show if loading is successful? |
| Use of Familiar Language    | Are the terms and words easy to understand? Are they unlikely to be misunderstood? |
| User Control & Freedom      | Can the user easily go back, undo, or modify an action? |
| Consistency                 | Are the style, buttons, and titles consistent across pages? |
| Error Prevention            | Is there design to prevent misclicks or wrong selections in advance? |
| Reduce Memory Load          | Does it require remembering too much information to proceed? |
| Efficiency                  | Are there simple and quick ways to perform tasks? |
| Aesthetic & Minimalist Design | Is the page clean, clear, and focused on key points? |
| Error Recognition & Guidance | When errors occur, does it clearly state the problem and how to fix it? |
| Help & Support              | Are there help buttons, tips, or tutorials available? |

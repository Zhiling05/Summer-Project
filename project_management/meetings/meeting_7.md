# Meeting 7 (23 July 2025)

## Part 1 Client Demo & Requirements Alignment  

### 1. Demo Overview  
* **User flow:** Launch animation (TBD) → Role selection → Optometrist module with bottom nav (Assessment / Records / Guide / Home).  
* **Assessment:**  
  * Dynamic questionnaire (single / multiple choice, Back / Next).  
  * Recommendation page – three features: **Preview Report ▪ Download TXT ▪ Send via Email**.  
* **Records:**  
  * Chart with risk levels (High / Moderate / Low) and filters (date range + risk).  
  * Future integration with DB for real-time counts; **View Details** will open the generated PDF/Word.  
* **Guide:**  
  * Image gallery: examples of papilloedema / pseudopapilloedema / normal discs, with traffic-light tags, dropdown filter & search.  
  * Tutorial: text to teach optometrists; content still under construction.  
* **Deployment:** Online demo currently blocked; fix expected in 1-2 days, link to be emailed for testing.  

### 2. Client Feedback & Key Discussion Points  

| Topic | Discussion Highlights | Conclusions / To-Dos |
|-------|----------------------|----------------------|
| **Records & Data Privacy** | – Who can view? Sensitive? <br>– Records stored locally for learning only | Keep **local storage for 3 months**; no server upload |
| **NHS Branding** | Olivia unsure whether NHS logo may be used | Re-confirm with Denise |
| **Image Tags** | One photo may contain multiple findings; need clear labels | Rename cards after real images arrive; add arrows / captions |
| **GP & Patient Pathways** | Team needs GP & patient decision trees | Olivia to send **GP draft**; patient version will be simplified later |
| **Wording / Tone** | Patient version must be plain language; avoid technical terms like “end-user” | Await Denise’s review → unify copywriting |

### 3. Action Items  
1. Fix deployment and send test link (within 2 days).  
2. Confirm NHS logo licensing.  
3. Receive **GP pathway** draft, convert to spec doc, return for approval.  
4. Collect authorised fundus photos and design multi-label display.  
5. Keep Records local, auto-delete after 3 months.  

---

## Part 2 Internal Sprint Retrospective & Plan  

### 1. Current Progress & Pain Points  

| Module | Status | Outstanding Issues |
|--------|--------|--------------------|
| **Frontend** | All pages rebuilt; animation & sidebar WIP | – **State resume** when returning to Assessment <br>– **Go Back** logic & responsive UI |
| **Backend / Arch** | Base APIs live; email send OK | – **Report parser** to generate readable findings <br>– **DB schema** for logs & stats |
| **Testing** | UI interaction tests done | – Add backend unit & integration tests <br>– Prepare usability study (Think-Aloud + SUS) |
| **UI/UX** | NHS style & cards refined | – Unify question box width for long text <br>– Polish Guide / Records visuals |

### 2. Tasks for the Coming Week  
* **Backend:**  
  * Finalise DB schema (assessment logs, risk metrics).  
* **Frontend:**  
  * Clone Optometrist flow to **GP & Patient** versions (separate JSON & styles).  
  * Finish launch animation & sidebar; convert Go Back to a header “<” icon.  
* **Testing:**  
  * Write regression scripts; integrate Cypress/Playwright.  
  * Schedule first **usability evaluation** with Denise’s team (1-2 weeks).  

### 3. Thesis Writing Progress  

| Chapter | Status | Next Steps |
|---------|--------|-----------|
| **Introduction / Background** | Iterated 3-5 versions | Send to Prof. Brid for feedback on bullet vs paragraph style |
| **Methodology** | Drafted (architecture & TDD) | Split implementation details; describe first iteration |
| **Implementation** | To be written | Cover tech stack & Sprint 1-2 outputs this week |
| **Evaluation** | Planning phase | Design 2-stage tests: usability & medical accuracy |
| **Timeline** | Goal: **full draft by 15 Aug** | Reserve 2-3 weeks for revisions reports |

### 4. Decisions & Next Meeting  
1. **This week’s goal:** backend report + DB; frontend GP/Patient flow.  
2. **Figma** no longer updated; add only if needed for final presentation.  
3. **Next team meeting:** review progress & deployment status.  


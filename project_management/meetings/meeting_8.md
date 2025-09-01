# Meeting 8 – Detailed Minutes

Date: **6 August 2025** 

---

## Participants

* **Denize** – Clinical supervisor
* **John Bird** – Academic supervisor
* **Project Team** – all members

---

## Meeting Objectives

1. Present the **evaluation plan** (Think-Aloud, Heuristic Evaluation, SUS) to both supervisors.
2. Confirm the development priority and feasibility of the **GP / Patient versions**.
3. Discuss the **work schedule and delivery path** for the final four weeks of the project.

---

## Project Status Report

* Optometrist version is **≈ 80 % complete**; database connection is in place, a few bugs will be fixed within this week.
* The **GP decision tree** from Olivia still contains broken logic links; coding cannot start yet.
* The Patient flow is only a draft and is beyond the current resource scope.

---

## Discussion & Decisions

### 1  Target Users & Product Scope

* **John’s concern:** development so far focuses only on optometrists; extending to GPs and patients requires extra research on language and usage scenarios.
* **Denize’s assessment:**

  * The *Patient* version must use layman language and focus on headache triage; **time does not allow** this now.
  * The *GP* version shares the same structure as the Optometrist flow, with different referral destinations and wording; **if** the decision tree is complete **and** time permits, it can be finished in about two weeks.
* **Conclusions**

  1. The Optometrist version is **locked in** as the mandatory deliverable.
  2. The GP version will be tackled **“best-effort”** depending on decision-tree completeness and remaining time.
  3. The Patient version is postponed to a later phase or a separate grant.

### 2  GP Decision-Tree Gap

* Team: the draft received has “open branches” and is not closed.
* Denize: will locate the latest version on SharePoint and send it; the team can align it with the Optometrist logic as before.

### 3  Evaluation Plan Details

**(a) Heuristic Evaluation**

* Based on *Nielsen’s 10 principles*, carried out by 4-6 MSc students.
* Setting: on-campus testing day **11 Aug**; outcome is an issue list with severity ratings.

**(b) Think-Aloud Test**

* Participants: Denize + at least three optometrists or 4-6 MSc students.
* Tasks: six typical operations covering Assessment / Records / Guide / Home.
* Format: preferably on-site at the Eye Hospital, about 15 min each; online if summer schedules conflict.
* Denize can contact three optometrists; Mondays outside clinic hours are easiest.

**(c) SUS Questionnaire**

* Participants: Optometrists.
* Filled in immediately after each Think-Aloud session; target score ≥ 68.
* If changes are small and time remains, run a second SUS for comparison.

**(d) Feedback Loop & Iteration**

* Denize asked whether changes will be implemented after testing; the team committed to:

  1. Collect feedback → compile an improvement list.
  2. Quickly fix “minor issues” and, if needed, run a second evaluation.
* John added that major issues can be documented as limitations instead of forcing a fix.

### 4  Testing Logistics & Privacy

* The app holds no personally identifiable data—only symptoms and advice—so GDPR risk is minimal for university testing.
* MSc classmates may be invited for the heuristic evaluation and SUS.

### 5  Timeline & Writing Plan

* **Two-week freeze:** collect all usability data and complete first-round fixes by **20 Aug**.
* **Four-week submission:** thesis due in early September; John advised drafting the Discussion section (method strengths/weaknesses, future work) immediately.
* The team must provide both supervisors a **four-week Gantt chart** detailing development, evaluation, and writing streams.

### 6  Post-Project Continuation & Handover

* **Denize’s question:** who will extend the Patient / Secondary-care pathways after the project?

  * **John’s proposal:** from September, hand over to an undergraduate Software Engineering team with Denize as the client.
  * Code is owned by the University, can be shared via a private GitHub repo; the team will invite Denize and John this week.
* If Denize secures additional research funding, a CS collaborator can be hired for long-term expansion.

---

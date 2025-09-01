# Meeting 9 – Detailed Minutes

Date: **2025-08-20**

---

## Meeting Objectives

1. Report progress on post-evaluation fixes and remaining items.
2. Finalise key implementations for **ID generation**, **email workflow**, and the **Statistics page with access control**.
3. Clarify deliverables, thesis and meeting arrangements, and plans for **code handover and deployment documentation**.

---

## Project Status

* Major frontend and backend features are complete; one iteration of fixes has been made based on last week’s evaluation.
* Still pending: **ID scheme adjustments**, **Statistics page (Statistics)**, **email feature updated to the new approach**, and several wording/spelling fixes.
* Records page updated: the report no longer shows “Yes / None of the above”; answers are converted into specific symptom text, and records update quickly after an assessment.
* Data is stored locally per device/browser. **Private browsing mode** or switching browsers may cause record loss. Users are advised to use the **same device and browser**, and avoid private mode.

---

## Discussion & Conclusions

### 1) User Identifier (ID) & Privacy

* **Do not use the NHS Number.** Denise reiterated that NHS numbers are highly identifying and must not be stored alongside clinical information.
* Use an **app-generated random ID** (optionally incorporating date/time). Length and rules are at the team’s discretion; goal: **recordable/searchable in patient notes without being personally identifiable**.
* The current long, random, non-semantic ID may be **format-optimised**, but must remain **random and non-identifiable**.

### 2) Email Feature: Positioning & Implementation

* Current implementation: a team-managed mailbox (e.g., Gmail) **sends an email with the report attachment to the user**. Denise’s view:

  * This has **high maintenance cost** and **limited value** to users.
  * **Preferred approach**: **open the user’s default email client** (NHS/Outlook/iCloud, etc.) and **auto-populate** the email body/attachment, so the user can send it to a referral target or include it in medical records.
* **Interim**: keep the existing “app-to-user” email flow, but document “**default mail client + auto-populate**” as the **preferred improvement** in the thesis; attempt the new approach if time allows.

### 3) Statistics Page (Statistics) & Access Control

* **Access method**: Denise prefers **password-based access** (consistent with clinical systems), not a “special admin link.”
* **Audit boundary**: after login, users should **only see their own audit/statistics data**, not others’.
* **Filters & presentation**:

  * Time filters: **Today / Last 7 days / Last 30 days / custom date range (banking-style picker)**.
  * Align with **data retention**: e.g., if records are kept for 1 month, do not offer a 3-month filter.
  * Support viewing by **referral recommendation** and by **risk level**, with user-selectable combinations.

### 4) Record Retention & Filter Consistency

* Reconfirm the **official retention period** (noted in discussion: avoid offering filters beyond the retention window). The team will constrain filters accordingly.

### 5) Deployment & Handover

* **Code hosting**: all code in **GitHub** (in progress).
* **Deployment guide**: per John’s suggestion, write a concise **README** that:

  * Explains how to deploy from GitHub to **Render**;
  * Optionally outlines approaches for **other platforms**.
* This guide will serve as the base document for future handover and maintenance.

### 6) Evaluation & Thesis Writing

* Denise can perform a **brief review** of new/changed features (**ID**, **Statistics**).
* The team should provide a **short questionnaire** (e.g., **Likert** scale) to capture “requirement fit/extent of implementation” and include this in the thesis **evaluation** section.
* Denise will share **wording improvements** for UI copy.

### 7) Meetings, Presentation, Schedule & Visa

* **Meetings**: schedule a **separate short online meeting with John next week** to focus on the thesis.
* **Group presentation (10 minutes)**: all members should ideally participate (\~1 minute each), focusing on **what you built (outcomes)** with minimal process content. Coordinate the time/arrangements with **Pete Bennett**.
* **On-site check/visa**: only one student will still be in Bristol next week; John will arrange **in-person confirmation** at the school office. Remote status for others **does not affect graduation**.

### 8) Publication Opportunity

* Denise shared the **NIHR Open Research** publishing route; the team is interested in preparing a submission **after September**, and Denise is supportive.

---

## Items to Confirm (based on this meeting)

* **Official thesis submission deadline**: two dates were mentioned (“9/2” and “9/4”); follow the official school notice and **unify internally**.
* **Email feature end-state**: if time is insufficient, document **“default mail client invocation”** as follow-up work in the thesis; if time allows, prioritise implementing **“default mail client + auto-populated content.”**

## Part 1: Data Security & Privacy Questions

1. **About the PDF download feature**  
   **Answer:** Do not generate a PDF; instead generate a Word document. Denize requires that optometrists be able to open the Word document and copy-paste the text of the report.  
   The text in the report should include only **Findings and Provisional Diagnosis**. There are no formatting requirements; the layout can be customised. As long as the patient’s symptoms and the final referral result are included, nothing else — not even date and time — should be present.  
   *(The following are actions we believe we can take based on the discussion.)*  
   According to Denize’s requirement, there are two possible approaches:  
   1) **Direct copy-paste of text.** After providing the referral advice, the backend automatically generates the report containing symptoms and referral suggestion. The user can click **Preview Report** and has a **Copy Full Report** button; clicking it automatically copies the text of the report without downloading Word. This fully satisfies Denize’s copy-paste need.  
   2) **Send a Word document by email.** The backend automatically generates the Word document and sends it. This was suggested by the supervisor. On mobile devices this makes it easier for users to keep the data than searching for a downloaded file.

2. **Do we need to link the data to individual patients?**  
   **Answer:** Absolutely not.

3. **Backend statistics on daily usage and referral-outcome counts**  
   Confirm whether we only collect these two data points, who can access them and what they are used for.  
   **Answer:** The purpose is optometrist audit. This time Denize said she only needs the counts of outcomes and did not mention tracking daily usage. We can also choose *date and time* as the identifier in the database.  
   **Q:** It was not clarified whether every optometrist can see these data; ask this next time.

4. **Clinical workflow integration**  
   Besides the download feature that automatically fills a template, how will this tool be integrated into clinical workflow (e.g., a patient’s EHR), or is it just standalone medical software?  
   **Answer:** It is only standalone medical software.

5. **Information-gathering questions that do not affect decisions**  
   Confirm with Denize why these data must be collected and how they will be used.  
   **Answer:** These answers still need to be collected, *first* to ensure the referral letter contains complete symptoms, and *second* to let optometrists know which symptoms they still need to assess — for example, most optometrists currently have no awareness of distinguishing pseudopapilloedema.

6. **Whether we need a Records page**  
   Our original idea was to store local history (question answers and referral advice) for several months on the device. We need to clarify the purpose of collecting these data and discuss how long they should be kept.  
   **Answer:** The purpose is: our software is also a learning tool for optometrists, allowing them to review history and learn which symptoms and final triggers led to a referral outcome.  
   We finally confirmed with Denize to keep records for **3 months**.

7. **Guide page sample images**  
   The Guide page needs some sample images, which are actual fundus photos of real patients; they may need patient consent. Ask whether they can provide them.  
   **Answer:** They can; authorised images are readily available.
---

## Part 2: Frontend Page Demonstration and Feedback 

### Denise’s Comments & Suggestions:

#### Entry Page:
- Must clearly state DIP study goals (avoid excessive explanation); may skip App registration.
- Prefer simple web-based tools over complex apps or logins.
- Summary: Needs to be lightweight, standalone, and fast.

#### User Entry Flow:
- When entering the tool, clearly show “optometrist version” and “patient version”.
- Do not use technical terms like “end users”.
- Summary: Patients and doctors must clearly distinguish their versions.

#### Text & Terminology Suggestions:
- Clinical documentation example: replace “continuous monitoring of vital signs” with professional language.
- Avoid using overly formal or hospital-based expressions unless necessary.

#### Format Suggestions:
- All textual suggestions from Denise (above) should be compiled into a Word file.

---

### About Referral Output:

- Referral documents are derived from DIPP logic; do not require app login or account binding.
- Summary: Only exports text-based referral advice; no automatic transmission to downstream systems.

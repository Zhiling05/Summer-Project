# Ophthalmic Referral Software Flow

## 1. Software Workflow

### 1.1 Role Selection
- Upon entering the application, the user selects their role: Doctor or Patient.
- No login required; no username or personal identity information is stored. Role selection is session-based.

### 1.2 Initial Symptom Screening
- Based on the selected role, the user enters a corresponding decision tree.
- For optometrist pathways, patients are initially asked about the following symptom categories:
  - No visual symptoms or headache (routine vision screening)
  - Headache with no red flags (no impaired consciousness, seizures, sudden severe onset, etc.)
  - Visual symptoms suggestive of raised intracranial pressure (transient visual obscurations, diplopia)
  - Headache with red flags (e.g., sudden thunderclap headache, altered consciousness)

### 1.3 Papilloedema Assessment
- For each symptom branch, the software asks whether optic disc swelling is observed:
  - **Definite papilloedema**  
  - **Uncertain**  
  - **No swelling**

### 1.4 Further Branching and Outcomes
- **Definite papilloedema** → Immediate referral to Eye Emergency (on call)
- **Uncertain** → If possible: imaging sent for ophthalmologist triage within 1 week; otherwise, follow standard outpatient triage process.
- **No swelling** → Assess for pseudopapilloedema features:
  - If features like PHOMS, crowded/tilted discs, or visible white-yellow bodies are present, evaluate via pseudopapilloedema pathway to determine if referral is needed.
  - If pseudopapilloedema is previously diagnosed with no changes, consider standard referral or no referral.

### 1.5 Referral Form and Download
- The app generates textual referral suggestions (e.g., Emergency, GP, Outpatient), without naming specific hospitals—final referral execution is left to local institutions.
- Provides a **Download Referral Form** feature containing:
  - Q&A session summary (symptoms, findings, recommendation)
  - Vision test results, refractive error data
  - Optional: attach images (OCT, visual field, fundus photography) if available

### 1.6 Usage Statistics
- Anonymously logs:
  - Number of app launches
  - Role selection distribution
  - Decision pathway statistics
- No personally identifiable information is collected or stored.

---

## 2. Future Plans and Documentation

- **Upcoming Tasks:**
  - Complete full optometrist decision tree within 2 weeks
  - Draft full disease decision tree with symptom-specific questions and options within 2 weeks
  - Client will provide documentation for Patient, Specialist, and Neurology/Emergency pathways (DIPP guide)

- **Available Files:**
  - Optometrist Pathways PowerPoint
  - Patient and Doctor pathway documents will be shared subsequently

---

## 3. Q&A Summary

**Q1. What form will the app take? Will it integrate with other systems?**  
- A one-time-use app/web tool. No integration with other systems. Only generates textual referral advice. No hospital names provided. No data is pushed to downstream systems.

**Q2. Will the app retain referral history?**  
- No patient history or past actions are stored. Only anonymized usage data is recorded. No login required.

**Q3. Diagnostic standards for true vs. pseudo-papilloedema?**  
- True papilloedema is confirmed by major features (e.g., cotton wool spots, disc hemorrhages). Auxiliary features require combination judgment. Pseudopapilloedema features (PHOMS, tilted discs, etc.) follow a separate pathway.

**Q4. Should OCT features be visible to optometrists?**  
- OCT features are auxiliary; only applicable if the optometrist has OCT access. Not mandatory—serves as guidance.

**Q5. For cases requiring referral within one week, what should the optometrist do?**  
- Yes, under the ophthalmology pathway: Optometrist refers, and the ophthalmologist completes triage within 1 week.

**Q6. If a patient initially reports visual symptoms like blackouts/greyouts but no swelling is detected, what’s the next step?**  
- Further evaluation for pseudopapilloedema is required. If no swelling is found, follow alternative pathways. Key distinction is whether optic disc swelling (true or pseudo) is present.

**Q7. What is PHOMS?**  
- PHOMS = Peripapillary Hyperreflective Ovoid Mass–like Structures.

**Q8. Will we be provided with patient and doctor workflow (DIPP guide)?**  
- Yes, client is preparing and will share the Pathways documents.

**Q9. Should post-referral outcomes be tracked?**  
- Not necessary. The workflow can suggest that follow-up is encouraged, but does not track outcome data.

**Q10. What patient information is retained?**  
- Minimum: Visual acuity values and refractive error data  
- Optional: OCT, visual field, fundus photos if available—should be sent with referral form

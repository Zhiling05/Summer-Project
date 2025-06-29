# meeting_4

## 1. Meeting Objectives & Project Status
- **Purpose of this meeting**: Clear up contract/licensing issues, refine decision-making logic, and lock down the MVP prototype direction, establishing a solid baseline for Sprint 2.  
- **Project progress**: Sprint 1 is complete; the team is preparing its review and planning the next two Sprints.  
- **Team roles**
  - **Architecture team**: React + React Router skeleton finished.  
  - **Front-end UI team**: First-round prototype design done, implementation phase next.  
  - **Testing team**: Will apply **TDD**; test cases for the full workflow are being written before code starts, then automated scripts will be added alongside development.  
  - **UI/UX group**: Demonstrated an MVP for the optometrist module.  

## 2. Decision-Tree Logic Review (Optometrist Pathway)
### Issues
- Color scheme and labels for **“Immediate vs Urgent Referral”** are inconsistent; a legend is missing.  
- **Question 3** (clustered symptoms) conflicts with Question 2 in logic and weighting; dead-ends and multi-selection validation gaps exist.  
- Several misleading labels (e.g., “Immediate referral with headache” is only a page jump, not an outcome).  

### Actions
1. **Denise & Olivia** will revisit Delphi consensus data and supply a clear **Boolean formula (AND/OR)** defining each symptom trigger.  
2. Delete or rewrite **Question 3**.  
3. Standardize the color palette.  
4. Redraw a complete Decision Tree so every path has a proper end node.  

## 3. Prototype Feedback
### Core functions
1. **Landing page**: Role selection – Optometrist / GP / Patient.  
2. **Onboarding**: 4–5 tutorial screens for first-time users, skippable.  
3. **Assessment flow**: Supports single-/multi-choice, back/next navigation, and state preservation.  
4. **Records**: Show de-identified, minimal case logs (timestamp, recommendation, etc.).  
5. **Guide**: Full user manual plus reference images for papilloedema.  

### Enhancement suggestions
- Adopt a **NHS-app style** minimalist UI; add UoB & DIP Study logos on the first screen.  
- **Result page**: Offer an **editable PDF** download that auto-fills selected red-flag symptoms and leaves blank fields for patient identifiers; align with the referral template.  
- Support **session resume** when the assessment is interrupted.  

## 4. Meeting Outputs
1. Licence workflow and signatories confirmed.  
2. Revised decision-tree logic to be delivered.  
3. UI prototype improvement checklist agreed.  
4. Next deliverables and owners defined.  

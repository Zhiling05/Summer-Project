# 7.4 Meeting Minutes(With Jon Bird)

## 1. Definition of Process Nature  
- The current process does not align with the characteristics of a traditional "decision tree" (as it simultaneously fulfills both "decision-making" and "information collection" functions; traditional decision trees only focus on decision-making, with questions directly serving the outcome).  
- Recommendation: It is more appropriately labeled a "logic model". The definition and rationale must be clarified in the report.  


## 2. Redundancy Issues in the Process  
- Some questions have no bearing on the final outcome (e.g., in a branch, regardless of how subsequent questions are answered, the result is always "Emergency referral to ophthalmology"). Such issues may cause process redundancy and potentially delay decision-making (e.g., in emergency consultations).  
- Recommendation: Consider client requirements (Denise wishes to retain information-collection-related questions) and explain in the report "why redundant issues are retained" (e.g., the client demands complete information collection). However, assess its impact on decision-making efficiency.  


## 3. Data Collection and Sharing  
Clarify the core elements of data:  
- **Sharing Targets**: Which roles will receive the collected data (e.g., ophthalmologists, general practitioners)?  
- **Sharing Format**: Confirm with Denise the template for medical experts (e.g., standardized report format) to ensure data presentation matches their workflow (medical staff have limited time and need quick access to key information).  
- **Sharing Method**: The current "download function" may be inadequate. Discuss whether to integrate with medical systems (e.g., direct synchronization to patients’ electronic health records).  


## 4. Patient Information Security and Association  
The core challenge: Collected health data are sensitive, requiring resolution of two key issues—"association" and "security":  
- **Data Association**: Jon suggested linking data to individuals via a patient identifier (e.g., National Health ID or Patient ID) (otherwise, the data lack practical value).  
- **Information Security**: Store data encrypted and restrict access (e.g., only authorized medical staff can view). Embed security measures in the design (e.g., encryption algorithms, permission management modules).  
- **Extended Consideration**: Confirm with Denise whether "linking to an ID is necessary" and "how to ensure data security", and evaluate the need for a permission management module.  


## 5. Proposal Writing Recommendations  
The Supervisor emphasized: The *Background* chapter is the most challenging part of the report and should be completed early. The evaluation plan should be staged, balancing usability and professionalism. Embed data security awareness in the design.  


### 5.1 Background Chapter  
- **Core Goal**: Demonstrate the project’s "uniqueness" and "necessity".  
  - **Uniqueness**: No existing tool simultaneously enables "ophthalmology triage decision-making" and "patient information collection". Compare with similar products (e.g., existing triage tools) to identify gaps.  
  - **Necessity**: Use evidence (e.g., literature, statistical data) to justify "why this tool is needed" (e.g., how many patients’ conditions worsen due to triage delays, or inefficiencies in existing processes).  
- **Recommendation**: Start drafting early. Use Overleaf to build the framework, list key references, and request domain-specific literature from Denise (e.g., current state of ophthalmology triage).  


### 5.2 Implementation Chapter  
- Explain the *rationale for technology choices* (e.g., why ReactJS for the frontend, Express for the backend, and MongoDB for the database—consider flexibility and suitability for unstructured health data).  
- Demonstrate the *problem-solving process*:  
  - Show the system’s evolution (e.g., early logic flaws → optimization plan → final version), explaining issues and solutions for each iteration (to highlight the team’s problem-solving capability).  


### 5.3 Evaluation Chapter  
Design the evaluation plan in two stages:  
- **Stage 1 (Non-Medical Experts)**: Test system usability (e.g., classmates, colleagues) using heuristic evaluation, the Think Aloud method, and SUS questionnaires to verify process clarity and operational ease.  
- **Stage 2 (Medical Experts)**: Tested by Denise or ophthalmologists to validate the accuracy of medical logic (e.g., whether recommendations are reasonable).  
- **Recommendation**: Attach a simple timeline (e.g., Gantt chart) to clarify time nodes and testing methods for both stages.  


## 6. Next Actions  

### 6.1 Prototype Development  
Use Microsoft Forms to quickly build a logical process prototype for Denise to test. Prioritize logical correctness over aesthetics.  


### 6.2 Report Writing  
- Create a *Background* chapter document on Overleaf and share it with the Supervisor for feedback.  
- Request relevant literature from Denise (e.g., shortcomings of existing ophthalmology triage tools).  


### 6.3 Client Meeting Preparation  

#### 1. Core Logic of Information Sharing and Collection  
- Which specific roles will ultimately receive the collected information? (e.g., ophthalmologists, general practitioners, emergency departments—clarify targets).  
- What are the core use cases for this data? (e.g., assisting diagnosis, serving as a referral basis, or other scenarios).  
- Why collect "information that does not impact decision-making" in the current process? (e.g., a branch where all answers lead to the same result but collection continues—clarify the data’s actual value).  
- Beyond the "download function", is integration with medical systems (e.g., patient electronic health records) needed? What does the template familiar to medical experts include?  


#### 2. Evaluation Plan Details  
- Present the two-stage evaluation plan (attach a simple timeline/Gantt chart).  
- Tester sources: Are there available testers? If not, is inviting medical students (e.g., Bartiek) appropriate? Does Denise need to contact medical-field testers?  


#### 3. Overleaf Document and *Related Work* Chapter Progress  
- Explain that drafting has started using the template. The *Related Work* chapter outline roughly includes:  
  - Comparison of existing tools (analyze pros/cons of similar products to clarify this project’s differentiation).  
  - The project’s uniqueness (no existing tool covers "ophthalmology triage decision-making + information collection").  
  - The necessity of ophthalmology triage (use data/literature to explain why such a tool is needed, e.g., triage delays, process inefficiencies).  
- Request key references from Denise (e.g., shortcomings of existing ophthalmology triage tools, triage data for eye disease patients) to support the chapter.  


#### 4. Clarifying Client Needs and Project Motivation  
- What is the software’s core goal? Which specific pain points in the current process does it address? (e.g., low triage efficiency, incomplete information, inconsistent decision-making).  
- Do other tools offer similar functions? If not, what makes this project irreplaceable?
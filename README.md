# Web-based Papilloedema Referral Platform - Technical Documentation

## How to Use This Documentation

For Clinicians and stakeholders, please read Section A (Customer Guide). 
For engineers please read Section B (Engineering Handover).

If you have any specific questions, please check contents below.


---

## Customer Guide (for NHS clinicians)

### A1 : System Instruction

**Logins and User Selection**

This system categorises roles into two types. Standard users encompassing *GPs, Ophthalmologists, Neurologists, Optometrists, and Patients*. 
**The Optometrist interface currently offers full functionality, while other roles remain under development.**
Administrator users must log in to the administrative interface using a password to view global data.

Users may select their role identity via the role selection page.


#### Assessment Workflow

You may start the assessment via the Assessment interface. During the assessment process, navigate between questions using the previous and next buttons, or alternatively, utilise your browser's back button.
However, please refrain from refreshing the page during the assessment process, as this carries the risk of losing your progress.

When you try to leave the assessment page, a pop-up window will automatically appear asking if you want to save your current assessment progress. 
Please choose according to your needs. If you choose to save, the system will automatically return you to the last question you were on when you navigate back to the assessment page.

To view or export a report, please go to the Report page after completing the questionnaire. For each assessment you have completed, you can click the View Details button on the details page to perform more operations, including:
- `Copy` the report results to the clipboard
- `Download` a preview of the report (in PDF format)
- Send `Email`: This will open your default email client. The subject line will be automatically filled with *Assessment Report,* the body will be automatically populated with the assessment report content, and you can enter the recipient yourself.

----插入邮件功能截图----

#### Other Main Pages

You can navigate between the *Home, Assess, Records,* and *Help* pages using the navigation bar at the bottom of the page.

---添加底部导航栏截图--

**Records** 
- Displays all assessment data the user has handled. 
- Users can use the filter box to narrow down the results.<br>

**Help：**  It includes a system user guide and a reference image gallery.
- **Reference Image Gallery:**  Provides visual references and diagnostic imaging examples for assessments. Users can use the filter box to find specific reference images.
- **App Tutorial for Optometrists:** A text-based guide on how to use all system functions.

For more detailed information (e.g. DIPP website and email), please check the Sidebar.

<br>
<br>


### A2: How to Read the Questionnaire JSON
Core JSON files including
`questionnaire.json` and
`recommendations.json` .
Here's a table illustrates what function each field maps to:

| Field | Function | Safe to edit |
|---|---|---|
| `id` | Unique identifier of each question; used for routing and answer linking |  Do not change once published |
| `type` | Defines question style and input mode (`single`, `multiple`, `input`, `confirm`) |  Change only if you understand the effect on UI and logic |
| `question` | The text shown to clinicians during the assessment |  Safe to edit wording |
| `hint` | Helper text displayed under the question (e.g. “Choose any that apply”) |  Safe to edit |
| `options` | List of answer choices. Can be strings or objects with `{ "label", "value", "isNone" }` |  Safe to edit labels; keep `value` stable; `isNone` should not be removed if used for logic |
| `meta.symptomOnYes` | Maps a “Yes” response to an internal symptom keyword |  Edit only if symptom coding changes |
| `meta.optionSymptomMap` | Maps each option text/value to a symptom keyword |  Edit carefully; option texts must match keys |
| `navigation.type` | Navigation mode (`simple`, `conditional`, `cross-question`) |  Do not change unless you are a developer |
| `navigation.rules` | Defines jump logic: e.g. `{ "Yes": "Q2", "No": "Q9" }` or conditional objects |  Clinical and technical review required before editing |
| `navigation.defaultNext` | Fallback target `id` if no rule matches |  Ensure target `id` exists |

What it looks like in code example:
<img src="docs/src/assets/README_IMG/JOSN_Example.png" alt="An example of JSON">

如果clinicians想要修改JSON文件，请仔细对照safe to edit栏再决定是否需要请求技术人员的支持。

### A3: Standard Change Process (via GitHub)

Follow these steps to safely update the questionnaire:
1. **Open the file**
    - Navigate to `docs/src/data/questionnaire.json`.

2. **Enter edit mode**
    - Click the pencil icon in the top-right corner of the file view to edit this file.

3. **Make safe edits only**
    - Change question text (`question`) or option labels (`options`), you may also add new options. **Do not change `id` values.**

4. **Increase the version number**
    - Locate the top-level field `"questionnaireVersion"`.
    - Increase it by **+1** (e.g. `12 → 13`). This helps track changes and allows rollback.

5. **Save your changes**
    - Scroll to the bottom of the page, in the `Commit changes` box, briefly describe what you changed.
    - Select `Create a new branch for this commit and start a pull request`.
    - Click `Propose changes`.

6. **Submit a Pull Request (PR)**
    - On the next page, click `Create pull request`. Your changes will now be reviewed. 
    - Then, wait for automated checks, the system will run automatic tests on your branch. A green ✔️ means the file passed validation. Before merging, please go through the following checklist:

| Check item | What to do |
|---|---|
| **All `goto` targets exist** | In every `navigation.rules`, make sure the `id` you point to is present in the file. |
| **Flow is continuous** | Starting from `Q1`, you should be able to reach an end state (e.g. `URGENT_TO_OPH`, `NO_REFERRAL`) without loops or dead ends. |
| **Required questions can be answered** | For every `"validation": { "required": true }`, check that options exist and can be selected. |
| **Edits tested locally if possible** | Walk through the JSON logic mentally or with a local/test environment if available. |
| **Version updated** | The top-level `"questionnaireVersion"` has been increased by **+1**. |
| **Change description added** | The PR commit message or description clearly explains the change. |

If all checks are satisfied, proceed to merge (Step 7).

7. **Confirm clinical logic → merge PR**
    - Review your edits in the PR and confirm they are correct.
    - Then, Merge the PR into the main branch (by **Admin or any authorized user**).

8. **Wait for automatic deployment**
    - After merging, deployment starts automatically.
    - Wait a few minutes, then open the usual deployment link [here](https://dipp-frontend.onrender.com) to walk through the questionnaire end-to-end to confirm your edits appear and work correctly.

9. **Rollback if needed**
    - If the new questionnaire does not behave as expected, notify the Admin.
    - They can roll back to the previous `questionnaireVersion`.



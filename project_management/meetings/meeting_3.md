# Clarifying the Optometrist Decision Tree

## Topic

Detailed review of the decision-tree logic and next development steps for the optometrist pathway

---

## Key Questions & Answers

### Q1. Two slides both cover “headache without signs of raised ICP,” but list different symptom sets. Which slide is correct?

**Answer**
Both are correct; they describe two distinct clinical contexts that the app should keep separate:

* **Slide 2 (headache only)** – Patient reports headache **with no visual symptoms**.

  * App action: keep a branch for *headache alone* → screen for red-flag headache features → explore optometric causes before moving on.

* **Slide 3 (visual symptoms ± headache)** – Patient has transient visual obscurations or diplopia and **may or may not** have headache.

  * App action: keep a branch for *visual symptoms present* → first rule out optometric causes → then assess raised-ICP risk.


Implementation tip: After ruling out red-flag symptoms, the flow may branch into four categories—no symptoms, visual symptoms only, headache only, and both visual + headache. This intermediate split helps structure downstream logic clearly, even if some branches later converge.

---

### Q2. In Slide 3 the list of “optometric causes” has Point 1 and Point 4 that look redundant—how should this be handled?

**Answer**

* Point 1 = heterophoria/heterotropia **with headache** and intermittent blur/diplopia.
* Point 4 was meant to cover the **same alignment issue without headache** but its header was truncated.
* **Fix:** merge them or label explicitly (“with headache” vs “without headache”). Ensure the item is flagged as an *optometric (benign) cause*, not a raised-ICP sign.
* Stable, long-standing heterotropia with diplopia can be removed to keep the pathway concise.

---

### Q3. How do we decide whether binocular diplopia points to raised ICP?

**Answer**

1. Determine if the diplopia is **new-onset**; chronic cases are rarely ICP-related.
2. Check for documented heterophoria/heterotropia.
3. **Route only new, unexplained binocular diplopia**—especially if compatible with a cranial-nerve palsy—down the possible raised-ICP branch. Long-standing alignment problems stay in the benign optometric branch.

---

### Q4. The slide says “two or more additional symptoms in combination with any above.” If a patient shows only one extra symptom, do we still class it as urgent?

**Answer**

Yes. Any single item on that “additional symptoms” list (e.g., pulsatile tinnitus) is sufficient to trigger urgent referral. The “two or more” wording was overly conservative.Although the slide says 'two or more,' the supervisor confirmed that even a single symptom warrants urgent referral.

---

### Q5. What do we do with patients who already have a known diagnosis of pseudopapilledema that has not changed?

**Answer**
Treat them like patients with a normal disc regarding ICP risk:

* Headache management can be **GP-led**.
* If referral is needed for other reasons, send to **ophthalmology**, not neurology—ophthalmologists can confirm the disc is unchanged.

---

### Q6. What about newly discovered pseudopapilledema with no visual loss?

**Answer**

* Document with fundus photos/OCT where possible.
* Refer routinely to ophthalmology for confirmation (not emergency).
* Do not place on raised-ICP pathway unless they also show ICP-type symptoms.

---

### Q7. If the patient has a non-red-flag headache and no raised-ICP clues, where does the pathway end?

**Answer**
Terminate with **“Advise GP-led headache management.”** No ophthalmology or neurology referral unless red flags emerge later.

---

### Q8. We have both a simplified and a granular decision tree; which should the app follow?

**Answer**
Use the **granular (four-branch) version** for software logic. It captures cleaner analytics and lets future updates target specific branches, even though some downstream steps converge.

---

### Q9. Pathway for “binocular diplopia + headache but no other ICP signs”?

**Answer**
Send as a **standard, non-urgent ophthalmology referral**—likely causes include isolated cranial-nerve palsy or thyroid eye disease. It is not part of the raised-ICP algorithm unless new warning signs appear.

---

## Next Steps

1. **Decision-tree revision**

   * Restore four initial branches (none / visual-only / headache-only / both).
   * Remove or relabel the redundant heterotropia item.

2. **Slide corrections**

   * Add the missing header to Point 4 under optometric causes.
   * Delete the “heterotropia + diplopia” branch if it still confuses users.

3. **Development timeline**

   * Deliver the updated Optometrist decision tree draft **within one week**.
   * Integrate any slide revisions from the supervisor as soon as they arrive.

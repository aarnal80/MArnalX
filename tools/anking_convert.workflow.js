export const meta = {
  name: 'anking-step1-convert-pilot',
  description: 'Convert a bounded batch of remaining AnKing Step 1 cloze cards into MCQs with rich explanations',
  phases: [
    { title: 'Generate' },
    { title: 'QA' },
  ],
}

const BASE = 'C:/Users/arnal/Desktop/Documentos/IA/USMLE-Step-1/data/anking'
// NOTE: reading these from `args` proved unreliable in this environment
// (reproduced twice: the run silently used the function defaults instead
// of the passed args, re-processing already-done batches). Hardcode the
// values for each run directly here instead, and double-check the very
// first agent's actual prompt/transcript before letting a run continue.
const START_BATCH = 10
const N_BATCHES = 80
const QA_GROUP = 5
const IN_DIR = '_batches_in_v6'
const OUT_DIR = '_batches_out_v6'
const GEN_EFFORT = 'high'

const TAXONOMY = `1. Medical Ethics [Public Health & Ethics]
2. Histamine & Antihistamines [Respiratory Pharmacology]
3. Reproductive Pharmacology [Reproductive System]
4. Antimicrobials [Microbiology]
5. Endocrine Pathology [Endocrine]
6. Hematology & Oncology Pathology [Hematology & Oncology]
7. Autonomic Drugs [Pharmacology]
8. Reproductive System Pathology [Reproductive System]
9. Neurology & Special Senses Pathology [Neurology & Special Senses]
10. Gastrointestinal Pathology [Gastrointestinal]
11. Immune Responses [Immunology]
12. Renal Physiology [Renal]
13. Metabolism [Biochemistry]
14. Neoplasia [Pathology]
15. Cardiovascular Pathology [Cardiovascular]
16. Musculoskeletal Pathology [Musculoskeletal, Skin & Connective Tissue]
17. Respiratory Pathology [Respiratory]
18. Psychiatry Pathology [Psychiatry]
19. Epidemiology & Biostatistics [Public Health & Ethics]
20. Virology [Microbiology]
21. Clinical Bacteriology [Microbiology]
22. Parasitology [Microbiology]
23. Endocrine Physiology [Endocrine]
24. Endocrine Pharmacology [Endocrine]
25. Endocrine Anatomy [Endocrine]
26. Hematology & Oncology Pharmacology [Hematology & Oncology]
27. Hematology & Oncology Anatomy [Hematology & Oncology]
28. Hematology & Oncology Physiology [Hematology & Oncology]
29. Toxicities & Side Effects [Pharmacology]
30. Miscellaneous Pharmacology [Pharmacology]
31. Pharmacokinetics & Pharmacodynamics [Pharmacology]
32. Reproductive System Physiology [Reproductive System]
33. Reproductive System Embryology [Reproductive System]
34. Reproductive System Anatomy [Reproductive System]
35. Neurology & Special Senses Anatomy & Physiology [Neurology & Special Senses]
36. Neurology & Special Senses Pharmacology [Neurology & Special Senses]
37. Ophthalmology [Neurology & Special Senses]
38. Gastrointestinal Anatomy [Gastrointestinal]
39. Gastrointestinal Physiology [Gastrointestinal]
40. Gastrointestinal Pharmacology [Gastrointestinal]
41. Immunosuppressants [Immunology]
42. Cellular Immunology [Immunology]
43. Lymphoid Structures [Immunology]
44. Molecular Biology [Biochemistry]
45. Genetics [Biochemistry]
46. Nutrition [Biochemistry]
47. Cardiovascular Physiology [Cardiovascular]
48. Cardiovascular Pharmacology [Cardiovascular]
49. Cardiovascular Anatomy [Cardiovascular]
50. Dermatology [Musculoskeletal, Skin & Connective Tissue]
51. Musculoskeletal Anatomy & Physiology [Musculoskeletal, Skin & Connective Tissue]
52. Musculoskeletal Pharmacology [Musculoskeletal, Skin & Connective Tissue]
53. Respiratory Physiology [Respiratory]
54. Respiratory Anatomy [Respiratory]
55. Respiratory Embryology [Respiratory]
56. Cellular Injury [Pathology]
57. Inflammation [Pathology]
58. Renal Pathology [Renal]
59. Renal Pharmacology [Renal]
60. Renal Embryology [Renal]
61. Psychiatry Pharmacology [Psychiatry]
62. Psychology [Psychiatry]
63. Healthcare Delivery [Public Health & Ethics]
64. Quality & Safety [Public Health & Ethics]
65. Communication Skills [Public Health & Ethics]
66. Respiratory Pharmacology [Respiratory]
67. Congenital Lung Malformations [Respiratory]`

const EXAMPLES = `[
 {
  "id": "anking-ophthalmology-320",
  "q": "Internuclear ophthalmoplegia is distinguished from a CN III lesion by having normal function of which process?",
  "o": {"A": "Convergence", "B": "Pupillary constriction to light", "C": "Eyelid elevation", "D": "Accommodation"},
  "r": "A",
  "e": {
   "correcta": "In INO, convergence is preserved because the medial rectus can still be activated via the convergence pathway (not dependent on the MLF), distinguishing it from a CN III lesion, which impairs convergence along with ptosis and mydriasis.",
   "incorrectas": {
    "B": "Pupillary constriction to light depends on CN III parasympathetics and is impaired in CN III lesions but not typically tested as the distinguishing convergence feature in INO.",
    "C": "Eyelid elevation (levator palpebrae) is impaired in CN III lesions causing ptosis, but this is not the distinguishing feature described for INO versus CN III lesion in this context.",
    "D": "Accommodation is a CN III-mediated parasympathetic function impaired in CN III lesions, but the classic distinguishing preserved feature highlighted for INO is convergence."
   }
  }
 },
 {
  "id": "anking-psychology-760",
  "q": "A patient begins treating her psychiatrist as though he were her critical father, projecting feelings from that relationship onto him. What is this phenomenon called?",
  "o": {"A": "Transference", "B": "Countertransference", "C": "Displacement", "D": "Projection"},
  "r": "A",
  "e": {
   "correcta": "Transference occurs when a patient projects feelings about formative or other important persons in their life onto the physician, such as viewing the psychiatrist as a parent figure.",
   "incorrectas": {
    "B": "Countertransference is the reverse phenomenon, in which the doctor projects feelings about important persons onto the patient.",
    "C": "Displacement is an ego defense in which emotions are redirected onto a neutral third party, not specifically the projection of relationship-based feelings onto a caregiver in therapy.",
    "D": "Projection is a defense mechanism where one's own unacceptable feelings are attributed to another person, distinct from the therapeutic relationship dynamic of transference."
   }
  }
 },
 {
  "id": "anking-cardiovascular-pharmacology-114",
  "q": "A patient taking a non-dihydropyridine calcium channel blocker for rate control is started on a second agent that also slows AV nodal conduction. Which combination poses the greatest risk of complete heart block?",
  "o": {"A": "Verapamil + metoprolol", "B": "Amlodipine + metoprolol", "C": "Verapamil + hydralazine", "D": "Amlodipine + furosemide"},
  "r": "A",
  "e": {
   "correcta": "Verapamil (a non-dihydropyridine CCB) and metoprolol (a beta-blocker) both slow conduction through the AV node — verapamil by blocking L-type calcium channels that drive the slow upstroke of the AV nodal action potential, and metoprolol by reducing sympathetic drive to the same node. Given together, their AV-nodal-suppressing effects are additive rather than complementary, so the combination carries a real risk of pushing a patient into complete heart block, especially in someone who already has borderline conduction disease.",
   "incorrectas": {
    "B": "Amlodipine is a dihydropyridine CCB — it acts mainly on vascular smooth muscle calcium channels and has little effect on the AV node, so pairing it with metoprolol does not meaningfully add to nodal blockade the way verapamil would.",
    "C": "Hydralazine is a direct arteriolar vasodilator with no effect on AV nodal conduction, so this combination doesn't compound conduction slowing the way a second nodal-blocking drug would.",
    "D": "Furosemide is a loop diuretic that affects volume status, not cardiac conduction, so it does not add to the AV-nodal-suppressing burden the way combining two nodal blockers would."
   }
  }
 }
]`

function genPrompt(batchFile, outFile) {
  return `You are converting raw AnKing Step 1 Anki cloze flashcards into finished USMLE Step 1 single-best-answer multiple-choice questions (4 options + rich explanations) for a study app called "USMLE Step 1 Study".

Read the JSON array at this absolute path: ${batchFile}
Each element has:
- anki: original Anki note id (string) — keep unchanged, for traceability
- sistema: First Aid chapter/system name (string)
- subtema: First Aid subtopic name (string, may be null)
- stem: flashcard text with the tested term/phrase marked as {{c1::answer text}} (may have an extra "::hint" segment after another "::" inside the braces — ignore/strip any hint, use only the answer text)
- extra: supplementary notes from the original flashcard (may be empty) — use as source material for your explanation, do not copy verbatim

For EVERY element in the array (all of them, same order, do not skip any), produce one finished question object:

{
  "anki": "<unchanged from input>",
  "sistema": "<unchanged from input>",
  "subtema": "<unchanged from input, or null>",
  "tema_nombre": "<topic name, see TAXONOMY below>",
  "q": "<clean single-best-answer question stem, your own words, no cloze braces>",
  "o": {"A": "...", "B": "...", "C": "...", "D": "..."},
  "r": "<correct letter>",
  "e": {
    "correcta": "<why the correct answer is right — teach the underlying concept, 2-4 sentences>",
    "incorrectas": {"<letter>": "<why THIS specific option is wrong, contrasted with the correct answer — 2-3 sentences, substantive>", "...": "... (the other 2 wrong letters)"}
  }
}

REQUIREMENTS — this app's whole value is the explanations, where the student actually learns, so do not rush them:
1. The correct answer comes from {{c1::...}} in "stem". Rephrase the surrounding sentence as a proper question (a direct question, "Which of the following...", or a short clinical-vignette stem) — no literal blanks or cloze braces left in "q".
2. Write 3 distractors of the SAME CATEGORY as the correct answer (e.g. if the answer is a receptor, distractors are other receptors; if it's a pathway step, distractors are other steps/similar pathways). Clearly wrong to someone who knows the concept, but plausible enough to require real understanding to rule out — never a random unrelated term.
3. Vary which letter (A-D) holds the correct answer across the batch — do not always put it at A.
4. Every explanation (correct AND all 3 incorrect) must be substantive and pedagogical, NOT a one-clause restatement of the fact. This is the single most important part of the task — the explanation is where the student actually learns, so take real care and don't default to the shortest possible sentence:
   - For the correct answer: don't just name the concept — explain the underlying mechanism/pathway/reasoning that makes it correct, and where useful, add why it matters clinically or how to remember it. Aim for roughly 2-4 sentences of real teaching content, not a single flat clause.
   - For each incorrect option: don't just say "this is wrong" or "this is a different thing" — say what that option actually IS/does, and specifically why it fails to satisfy what the question asks, ideally contrasting the mechanism with the correct answer. A distractor from the SAME category (per point 2) makes this natural: explain the real distinguishing feature between it and the correct answer, not a generic dismissal.
   - Avoid filler phrases that sound substantive but say nothing new (e.g. "this option does not fit the scenario described" without saying what it actually is or why). Every explanation should teach the reader something true and specific about the wrong option itself.
   - Mine the "extra" field for real content when present, but don't copy it verbatim — synthesize it into your own teaching explanation.
5. "tema_nombre": reuse one of the EXISTING topic names below when the card clearly belongs there; only invent a new name (specific, First-Aid-style, 2-5 words) if none fit — don't invent near-duplicates of an existing name.
6. Output a JSON array with exactly one object per input element, same order, no omissions.

EXISTING TOPIC TAXONOMY (format "id. Name [System]" — reuse a Name when it fits):
${TAXONOMY}

STYLE EXAMPLES — match this voice, depth and explanation quality (real entries already shipped in the app):
${EXAMPLES}

When finished, write the JSON array (only the array, valid JSON, no markdown fences, no comments) to this absolute path using your Write tool: ${outFile}

Then reply with exactly one line: "wrote N questions" (N = how many objects you wrote).`
}

function qaPrompt(outFiles) {
  return `You are quality-checking a batch of auto-generated USMLE Step 1 multiple-choice questions for a study app, before they go live.

Read these JSON files (each is an array of finished question objects with fields anki/sistema/subtema/tema_nombre/q/o/r/e):
${outFiles.join('\n')}

For each question, check for genuine problems:
- Is there exactly ONE clearly correct option? (flag if a "wrong" option is actually also correct, or "r" is arguably not the best answer)
- Do the "incorrectas" explanations actually match their own letter (not swapped/contradictory)?
- Is any explanation (correct or incorrect) too shallow to teach anything — a single flat clause, a generic "this is wrong" with no actual content about what the option is or why, or just restating the option text back? These should be flagged just as much as factual errors — depth matters as much as correctness for this app.
- Is the question stem still leaking cloze artifacts like "{{c1::" or "::}}"?
- Are all 4 options present, non-empty, and genuinely distinct from each other?

Be selective: only flag REAL problems (factual errors, letter mismatches, or explanations with essentially no teaching content), not stylistic nitpicks. Most questions should pass with no issues.

Return the "anki" id and a one-sentence reason for every question you flag. If none, return an empty array.`
}

const FLAG_SCHEMA = {
  type: 'object',
  properties: {
    flagged: {
      type: 'array',
      items: {
        type: 'object',
        properties: { anki: { type: 'string' }, reason: { type: 'string' } },
        required: ['anki', 'reason'],
      },
    },
  },
  required: ['flagged'],
}

const pad = (n) => String(n).padStart(4, '0')
const batchFiles = Array.from({ length: N_BATCHES }, (_, i) => `${BASE}/${IN_DIR}/batch_${pad(START_BATCH + i)}.json`)
const outFiles = batchFiles.map((f) => f.replace(IN_DIR, OUT_DIR))

log(`Config: ${N_BATCHES} batches starting at ${START_BATCH}, reading from ${IN_DIR}/, writing to ${OUT_DIR}/. First batch file: ${batchFiles[0]}`)

phase('Generate')
const genResults = await pipeline(
  batchFiles,
  (batchFile, _item, i) =>
    agent(genPrompt(batchFile, outFiles[i]), { label: `gen:${i}`, phase: 'Generate', effort: GEN_EFFORT })
      .then(() => outFiles[i])
      .catch(() => null)
)

log(`Generation done: ${genResults.filter(Boolean).length}/${N_BATCHES} batches wrote output`)

phase('QA')
const groups = []
for (let i = 0; i < outFiles.length; i += QA_GROUP) groups.push(outFiles.slice(i, i + QA_GROUP))

const qaResults = await pipeline(
  groups,
  (group, _item, i) => agent(qaPrompt(group), { label: `qa:${i}`, phase: 'QA', schema: FLAG_SCHEMA, effort: 'high' }).catch(() => null)
)

const flagged = qaResults.filter(Boolean).flatMap((r) => r.flagged || [])
log(`QA done: ${flagged.length} questions flagged for review`)

return {
  batchesRequested: N_BATCHES,
  batchesWritten: genResults.filter(Boolean).length,
  outFiles: genResults.filter(Boolean),
  flagged,
}

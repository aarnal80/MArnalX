export const meta = {
  name: 'nbme-official-convert',
  description: 'Generate explanations + topic classification for the 119 official NBME/FSMB Step 1 sample questions',
  phases: [
    { title: 'Generate' },
    { title: 'QA' },
  ],
}

const BASE = 'C:/Users/ca-urgencias/Desktop/Arnal Config/Documentos IA/USMLE_step_1/data/anking'
const N_BATCHES = 6
const QA_GROUP = 3
const IN_DIR = '_official_batches_in'
const OUT_DIR = '_official_batches_out'
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
65. Communication Skills [Public Health & Ethics]`

const EXAMPLES = `[
 {
  "stem": "A patient taking a non-dihydropyridine calcium channel blocker for rate control is started on a second agent that also slows AV nodal conduction. Which combination poses the greatest risk of complete heart block?",
  "options": {"A": "Verapamil + metoprolol", "B": "Amlodipine + metoprolol", "C": "Verapamil + hydralazine", "D": "Amlodipine + furosemide"},
  "answer": "A",
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
  return `You are writing explanations for a study app called "USMLE Step 1 Study". The questions in this batch are REAL, OFFICIAL USMLE Step 1 sample questions published by the NBME/FSMB — the stem, options, and correct answer are already final and correct. Your ONLY job is to write the teaching explanation for each one, plus classify it into a topic.

Read the JSON array at this absolute path: ${batchFile}
Each element has: num (question number, keep unchanged), stem (question text), options (object with 2-7 lettered keys), answer (correct letter), img (image filename or null — if present, the question has an image the student will see; write your explanation as if you can see whatever a labeled figure/photo/ECG/histology slide of that kind would show, consistent with the stem's own description of it).

For EVERY element (all of them, same order, do not skip any), produce:

{
  "num": "<unchanged from input>",
  "tema_nombre": "<topic name, see TAXONOMY below>",
  "e": {
    "correcta": "<why the correct answer is right — teach the underlying mechanism/concept, 2-4 sentences>",
    "incorrectas": {"<letter>": "<why THIS specific option is wrong, contrasted with the correct answer — 2-3 sentences, substantive>", "...": "one entry for every OTHER letter present in this item's options, i.e. all option letters except the answer"}
  }
}

DO NOT change or echo back "stem", "options", or "answer" — they are official, final content and out of scope.

REQUIREMENTS — this app's whole value is the explanations, where the student actually learns, so do not rush them:
1. Every explanation (correct AND every incorrect option) must be substantive and pedagogical, NOT a one-clause restatement of the fact:
   - For the correct answer: explain the underlying mechanism/pathway/clinical reasoning that makes it correct, and where useful, why it matters clinically or how to remember it. Aim for roughly 2-4 sentences of real teaching content.
   - For each incorrect option: say what that option actually IS/does, and specifically why it fails to satisfy what the question asks, ideally contrasting the mechanism/reasoning with the correct answer. Avoid generic dismissals like "this is wrong" or "this is unrelated" — every explanation should teach the reader something true and specific about that option.
2. "incorrectas" must have exactly one entry per option letter OTHER than "answer" — if the item has options A-G, and answer is C, incorrectas must have keys A,B,D,E,F,G (whichever of those actually appear in "options").
3. "tema_nombre": reuse one of the EXISTING topic names below when the item clearly belongs there; only invent a new name (specific, First-Aid-style, 2-5 words) if none fit — don't invent near-duplicates of an existing name.
4. Output a JSON array with exactly one object per input element, same order, no omissions.

EXISTING TOPIC TAXONOMY (format "id. Name [System]" — reuse a Name when it fits; these came from a different question source but the subject-matter buckets are the same organ-system/discipline taxonomy):
${TAXONOMY}

STYLE EXAMPLE — match this voice and depth (a real entry already shipped in the app):
${EXAMPLES}

When finished, write the JSON array (only the array, valid JSON, no markdown fences, no comments) to this absolute path using your Write tool: ${outFile}

Then reply with exactly one line: "wrote N questions" (N = how many objects you wrote).`
}

function qaPrompt(outFiles, inFiles) {
  return `You are quality-checking a batch of explanations written for REAL, OFFICIAL USMLE Step 1 questions in a study app, before they go live. The stem/options/answer are official NBME content and are NOT to be judged — only judge the explanations.

Read these JSON output files (each is an array of objects with fields num/tema_nombre/e):
${outFiles.join('\n')}

For cross-reference, the corresponding original inputs (stem/options/answer) are at:
${inFiles.join('\n')}

For each item, check for genuine problems:
- Is any explanation (correct or incorrect) too shallow — a single flat clause, a generic "this is wrong" with no actual content, or just restating the option text back? Depth matters as much as correctness.
- Do the "incorrectas" keys exactly match every option letter other than the answer (no letter missing, no extra/wrong letter, no swapped/contradictory content)?
- Is the explanation for the correct answer actually consistent with the official answer letter (not quietly arguing for a different option)?
- Any leftover artifacts (placeholder text like "TODO"/"N/A", truncated sentences)?

Be selective: only flag REAL problems, not stylistic nitpicks. Most items should pass.

Return the "num" and a one-sentence reason for every item you flag. If none, return an empty array.`
}

const FLAG_SCHEMA = {
  type: 'object',
  properties: {
    flagged: {
      type: 'array',
      items: {
        type: 'object',
        properties: { num: { type: 'number' }, reason: { type: 'string' } },
        required: ['num', 'reason'],
      },
    },
  },
  required: ['flagged'],
}

const pad = (n) => String(n).padStart(4, '0')
const batchFiles = Array.from({ length: N_BATCHES }, (_, i) => `${BASE}/${IN_DIR}/batch_${pad(i)}.json`)
const outFiles = batchFiles.map((f) => f.replace(IN_DIR, OUT_DIR))

log(`Config: ${N_BATCHES} batches, reading from ${IN_DIR}/, writing to ${OUT_DIR}/. First batch file: ${batchFiles[0]}`)

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
const inGroups = []
for (let i = 0; i < outFiles.length; i += QA_GROUP) {
  groups.push(outFiles.slice(i, i + QA_GROUP))
  inGroups.push(batchFiles.slice(i, i + QA_GROUP))
}

const qaResults = await pipeline(
  groups,
  (group, _item, i) => agent(qaPrompt(group, inGroups[i]), { label: `qa:${i}`, phase: 'QA', schema: FLAG_SCHEMA, effort: 'high' }).catch(() => null)
)

const flagged = qaResults.filter(Boolean).flatMap((r) => r.flagged || [])
log(`QA done: ${flagged.length} items flagged for review`)

return {
  batchesRequested: N_BATCHES,
  batchesWritten: genResults.filter(Boolean).length,
  outFiles: genResults.filter(Boolean),
  flagged,
}

export const meta = {
  name: 'anking-step1-fix-explanations',
  description: 'Rewrite shallow explanations on already-shipped AnKing Step 1 questions to match the reinforced-depth style',
  phases: [
    { title: 'Rewrite' },
    { title: 'QA' },
  ],
}

const BASE = 'C:/Users/ca-urgencias/Desktop/Arnal Config/Documentos IA/USMLE_step_1/data/anking'
const START_BATCH = 0
const N_BATCHES = 48
const QA_GROUP = 7
const IN_DIR = '_fix_batches_in_v3'
const OUT_DIR = '_fix_batches_out_v3'
const GEN_EFFORT = 'high'

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
  return `You are improving explanations on ALREADY-FINISHED USMLE Step 1 single-best-answer multiple-choice questions for a study app called "USMLE Step 1 Study". These questions shipped early in the project with shallow, one-clause explanations. Your job is ONLY to rewrite the explanations to real teaching depth — the question itself is correct and must not change.

Read the JSON array at this absolute path: ${batchFile}
Each element has: id, anki, q (question stem), o (options A-D), r (correct letter).

For EVERY element (all of them, same order, do not skip any), produce:

{
  "id": "<unchanged from input>",
  "anki": "<unchanged from input>",
  "e": {
    "correcta": "<why the correct answer is right — teach the underlying mechanism/concept, 2-4 sentences>",
    "incorrectas": {"<letter>": "<why THIS specific option is wrong, contrasted with the correct answer — 2-3 sentences, substantive>", "...": "... (the other 2 wrong letters)"}
  }
}

DO NOT change or echo back "q", "o", or "r" — the question and its correct answer are final and out of scope. Do not second-guess whether "r" is right; assume it is and write the explanations to support it.

REQUIREMENTS — this app's whole value is the explanations, where the student actually learns, so do not rush them:
1. Every explanation (correct AND all 3 incorrect) must be substantive and pedagogical, NOT a one-clause restatement of the fact. This is the single most important part of the task:
   - For the correct answer: explain the underlying mechanism/pathway/reasoning that makes it correct, and where useful, why it matters clinically or how to remember it. Aim for roughly 2-4 sentences of real teaching content, not a single flat clause.
   - For each incorrect option: say what that option actually IS/does, and specifically why it fails to satisfy what the question asks, ideally contrasting the mechanism with the correct answer. Explain the real distinguishing feature between it and the correct answer, not a generic dismissal like "this is wrong" or "this is unrelated".
   - Avoid filler phrases that sound substantive but say nothing new. Every explanation should teach the reader something true and specific about that option.
2. "incorrectas" must have exactly the 3 letters that are NOT "r", matching the input's own letters exactly.
3. Output a JSON array with exactly one object per input element, same order, no omissions.

STYLE EXAMPLES — match this voice and depth (real entries already shipped in the app):
${EXAMPLES}

When finished, write the JSON array (only the array, valid JSON, no markdown fences, no comments) to this absolute path using your Write tool: ${outFile}

Then reply with exactly one line: "wrote N questions" (N = how many objects you wrote).`
}

function qaPrompt(outFiles) {
  return `You are quality-checking a batch of rewritten explanations for USMLE Step 1 multiple-choice questions, before they replace the shallow originals in a live study app.

Read these JSON files (each is an array of objects with fields id/anki/e):
${outFiles.join('\n')}

For each entry, check for genuine problems:
- Is any explanation (correct or incorrect) still too shallow — a single flat clause, a generic "this is wrong" with no actual content about what the option is or why, or just restating the option text back? Depth matters as much as correctness here.
- Do the "incorrectas" keys look internally consistent (three distinct letters, no letter repeated, explanation content matches its own letter and doesn't contradict itself)?
- Any leftover artifacts (cloze braces, placeholder text like "TODO" or "N/A", truncated sentences)?

Be selective: only flag REAL problems (shallow explanations or structural issues), not stylistic nitpicks. Most entries should pass.

Return the "anki" id and a one-sentence reason for every entry you flag. If none, return an empty array.`
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

phase('Rewrite')
const genResults = await pipeline(
  batchFiles,
  (batchFile, _item, i) =>
    agent(genPrompt(batchFile, outFiles[i]), { label: `fix:${i}`, phase: 'Rewrite', effort: GEN_EFFORT })
      .then(() => outFiles[i])
      .catch(() => null)
)

log(`Rewrite done: ${genResults.filter(Boolean).length}/${N_BATCHES} batches wrote output`)

phase('QA')
const groups = []
for (let i = 0; i < outFiles.length; i += QA_GROUP) groups.push(outFiles.slice(i, i + QA_GROUP))

const qaResults = await pipeline(
  groups,
  (group, _item, i) => agent(qaPrompt(group), { label: `qa:${i}`, phase: 'QA', schema: FLAG_SCHEMA, effort: 'high' }).catch(() => null)
)

const flagged = qaResults.filter(Boolean).flatMap((r) => r.flagged || [])
log(`QA done: ${flagged.length} entries flagged for review`)

return {
  batchesRequested: N_BATCHES,
  batchesWritten: genResults.filter(Boolean).length,
  outFiles: genResults.filter(Boolean),
  flagged,
}

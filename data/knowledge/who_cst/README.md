# WHO CST Knowledge Base

Place the WHO Caregiver Skills Training (WHO CST) PDF documents in this folder,
then run `npm run ingest` from the project root to build the vector database.

The ingestion script auto-discovers **every `*.pdf`** in this directory, so exact
filenames do not matter.

## Expected WHO CST documents

| File (example)              | Document                                              |
| --------------------------- | ----------------------------------------------------- |
| `9789240048973-eng.pdf`     | WHO CST Introduction                                  |
| `9789240048911-eng.pdf`     | WHO CST Participants' Guide — Group Sessions 1–9      |
| `9789240048935-eng.pdf`     | WHO CST Facilitators' Guide — Group Sessions 1–9      |
| `9789240048850-eng.pdf`     | WHO CST Adaptation and Implementation Guide           |
| `9789240120983-eng.pdf`     | WHO CST Caregiver Well-being Guide                    |

Optional: WHO CST Home Visit Guide (if you have it).

## Do NOT put these here

- ASQ-3 questionnaires
- Vanderbilt assessment scales

Those assessments will use a separate deterministic scoring engine later, not
this conversational RAG knowledge base.

> Note: PDFs in this folder are git-ignored (see `.gitignore`) so they are never
> committed. Copying them here does not remove the originals from your machine.

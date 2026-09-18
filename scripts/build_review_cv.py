"""
Builds an anonymized copy of the CV for public review (e.g. Reddit).

Reuses build_cv.py as the single source of truth: reads its source,
swaps every identifying string for a generic placeholder, and runs it
with the output redirected to the repo root (NOT public/, so the file
is never deployed or committed).

Run from repo root:
    python scripts/build_review_cv.py

Writes to: ~/Downloads/CV_Anonymized_Review.pdf
"""

from pathlib import Path

REPLACEMENTS = [
    # Output path: Downloads instead of public/
    (
        'OUT = ROOT / "public" / "Nandakishore_Reddy_CV.pdf"',
        'OUT = Path.home() / "Downloads" / "CV_Anonymized_Review.pdf"',
    ),
    # Identity
    ("GADUSATLA NANDAKISHORE REDDY", "JOHN DOE"),
    ("Nandakishore Reddy - CV", "John Doe - CV (anonymized for review)"),
    ('author="Nandakishore Reddy"', 'author="John Doe"'),
    # Contact
    ("+91 8555 042 086", "+91 XXXXX XXXXX"),
    ("nandakishorereddyg@outlook.com", "johndoe@example.com"),
    ("github.com/N9601", "github.com/johndoe"),
    ("gnandhakishorereddy", "johndoe"),
    ("dev.to/n9601", "dev.to/johndoe"),
    # Education
    (
        "VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)",
        "College 1",
    ),
    ("VNR VJIET", "College 1"),
    ("TRR College of Technology", "College 2"),
    ("Delhi School of Excellence", "School 1"),
    # Employer
    ("Verge Scales", "Company 1"),
    # Projects (named repos are searchable back to the real profile)
    ("<b>SolderDB</b>", "<b>Project 1</b>"),
    ("<b>PyroOS</b>", "<b>Project 2</b>"),
    ("<b>AlgoWizard</b>", "<b>Project 3</b>"),
    ("<b>Coefficient</b>", "<b>Project 4</b>"),
    ("<b>Personal Portfolio</b>", "<b>Project 5</b>"),
]


def main():
    src = Path(__file__).with_name("build_cv.py").read_text(encoding="utf-8")
    for needle, sub in REPLACEMENTS:
        if needle not in src:
            raise SystemExit(
                f"Anonymizer out of sync with build_cv.py: {needle!r} not found"
            )
        src = src.replace(needle, sub)
    exec(
        compile(src, "build_cv_anonymized", "exec"),
        {
            "__name__": "__main__",
            "__file__": str(Path(__file__).with_name("build_cv.py")),
        },
    )


if __name__ == "__main__":
    main()

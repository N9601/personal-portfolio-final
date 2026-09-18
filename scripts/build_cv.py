"""
Builds Nandakishore Reddy's CV as a PDF using ReportLab Platypus.

Run from repo root:
    python scripts/build_cv.py

Writes to: public/Nandakishore_Reddy_CV.pdf
"""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    KeepTogether,
)

# --- Output ---
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "Nandakishore_Reddy_CV.pdf"

# --- Colors ---
INK = HexColor("#111111")
SUB = HexColor("#555555")
LINE = HexColor("#1f3a8a")  # underline blue
ACCENT = HexColor("#0066ff")
MUTED = HexColor("#777777")

# --- Styles ---
styles = getSampleStyleSheet()


def style(name, parent="Normal", **kwargs):
    return ParagraphStyle(name=name, parent=styles[parent], **kwargs)


s_name = style(
    "Name",
    "Title",
    fontName="Helvetica-Bold",
    fontSize=20,
    leading=23,
    textColor=INK,
    alignment=1,  # center
    spaceAfter=4,
)
s_contact = style(
    "Contact",
    fontName="Helvetica",
    fontSize=9.5,
    leading=12,
    textColor=SUB,
    alignment=1,
    spaceAfter=2,
)
s_section = style(
    "Section",
    fontName="Helvetica-Bold",
    fontSize=11.5,
    leading=14,
    textColor=INK,
    spaceBefore=10,
    spaceAfter=4,
)
s_role_left = style(
    "RoleLeft",
    fontName="Helvetica-Bold",
    fontSize=10.5,
    leading=13,
    textColor=INK,
    spaceBefore=4,
    spaceAfter=0,
)
s_role_right = style(
    "RoleRight",
    fontName="Helvetica",
    fontSize=9.5,
    leading=12,
    textColor=SUB,
    alignment=2,  # right
)
s_meta = style(
    "Meta",
    fontName="Helvetica-Oblique",
    fontSize=9.5,
    leading=12,
    textColor=SUB,
    spaceAfter=2,
)
s_body = style(
    "Body",
    fontName="Helvetica",
    fontSize=10,
    leading=13,
    textColor=INK,
    alignment=4,  # justify
    spaceAfter=2,
)
s_bullet = style(
    "Bullet",
    fontName="Helvetica",
    fontSize=10,
    leading=13,
    textColor=INK,
    leftIndent=14,
    bulletIndent=2,
    spaceAfter=1,
)
s_pill = style(
    "Pill",
    fontName="Helvetica",
    fontSize=9.5,
    leading=12,
    textColor=INK,
    spaceAfter=2,
)


def hr():
    return HRFlowable(
        width="100%", thickness=0.6, color=LINE, spaceBefore=2, spaceAfter=2
    )


def section(title: str):
    return [Paragraph(title.upper(), s_section), hr()]


def two_col_row(left_html: str, right_html: str):
    """Render an entry header with title on left, dates on right using a table."""
    from reportlab.platypus import Table, TableStyle

    t = Table(
        [[Paragraph(left_html, s_role_left), Paragraph(right_html, s_role_right)]],
        colWidths=["72%", "28%"],
        hAlign="LEFT",
    )
    t.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return t


def two_col_sub(left_html: str, right_html: str):
    from reportlab.platypus import Table, TableStyle

    t = Table(
        [[Paragraph(left_html, s_meta), Paragraph(right_html, s_role_right)]],
        colWidths=["72%", "28%"],
        hAlign="LEFT",
    )
    t.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return t


def build():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=LETTER,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title="Nandakishore Reddy - CV",
        author="Nandakishore Reddy",
    )

    story = []

    # --- Header ---
    story.append(Paragraph("GADUSATLA NANDAKISHORE REDDY", s_name))
    story.append(
        Paragraph(
            "Hyderabad, India &nbsp;|&nbsp; +91 8555 042 086 &nbsp;|&nbsp; "
            '<a href="mailto:nandakishorereddyg@outlook.com" color="#0066ff">'
            "nandakishorereddyg@outlook.com</a>",
            s_contact,
        )
    )
    story.append(
        Paragraph(
            '<a href="https://github.com/N9601" color="#0066ff">github.com/N9601</a>'
            " &nbsp;·&nbsp; "
            '<a href="https://www.linkedin.com/in/gnandhakishorereddy/" color="#0066ff">'
            "linkedin.com/in/gnandhakishorereddy</a>"
            " &nbsp;·&nbsp; "
            '<a href="https://dev.to/n9601" color="#0066ff">dev.to/n9601</a>',
            s_contact,
        )
    )
    story.append(Spacer(1, 6))

    # --- Summary ---
    story += section("Summary")
    story.append(
        Paragraph(
            "Software Engineer specialising in AI and automation, working at the intersection "
            "of intelligent systems and operational engineering. Currently building AI-driven "
            "automation pipelines and e-commerce infrastructure at Verge Scales - on the team "
            "through its revenue scale from 5-figure to 8-figure. Combines a top-1% CSE "
            "academic record, now continued in a B.Tech at VNR VJIET, with hands-on systems "
            "work - from React frontends to a from-scratch Go LSM database and an in-progress "
            "custom OS.",
            s_body,
        )
    )

    # --- Experience ---
    story += section("Experience")
    story.append(
        two_col_row(
            "Software Engineer – AI &amp; Automation",
            "Jan 2026 - Present",
        )
    )
    story.append(
        two_col_sub("<i>Verge Scales</i>", "Remote · Hyderabad, IN")
    )
    for b in [
        "Building internal automation pipelines for e-commerce and marketing workflows; "
        "n8n-first stack integrating across company tooling via webhooks and REST APIs.",
        "Owning logistics end-to-end - supplier coordination, inbound and outbound "
        "shipment tracking, fulfillment continuity.",
        "Front-line customer relations: direct support, issue triage and resolution, "
        "feedback loop into the product and ops teams.",
        "Designing reusable workflow components that cut recurring manual operations overhead.",
        "On the team through the company's revenue growth from <b>5-figure</b> to "
        "<b>8-figure</b> scale.",
    ]:
        story.append(Paragraph(b, s_bullet, bulletText="•"))

    # --- Education ---
    story += section("Education")
    story.append(
        two_col_row(
            "VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)",
            "2026 - Present",
        )
    )
    story.append(
        two_col_sub(
            "<i>B.Tech in Computer Science and Engineering</i>",
            "Hyderabad, India",
        )
    )
    story.append(
        Paragraph(
            "Joined 2026; building core CS depth on top of the diploma foundation.",
            s_bullet,
            bulletText="•",
        )
    )

    story.append(Spacer(1, 4))
    story.append(
        two_col_row(
            "TRR College of Technology",
            "2023 - Apr 2026",
        )
    )
    story.append(
        two_col_sub(
            "<i>Polytechnic Diploma in Computer Science and Engineering</i>",
            "Hyderabad, India",
        )
    )
    for b in [
        "Final cumulative CGPA of <b>9.18 / 10.0</b>; ranked in the top 1% of the diploma cohort.",
        "A+ grades in core technical modules: Java Programming, Data Structures, RDBMS.",
    ]:
        story.append(Paragraph(b, s_bullet, bulletText="•"))

    story.append(Spacer(1, 4))
    story.append(
        two_col_row(
            "Delhi School of Excellence",
            "2013 - 2023",
        )
    )
    story.append(two_col_sub("<i>10th - CBSE</i>", "Hyderabad, India"))

    # --- Technical Skills ---
    story += section("Technical Skills")
    skill_rows = [
        ("Languages", "JavaScript, TypeScript, Java, Python, C / C++, C#, SQL, Bash"),
        (
            "Frameworks &amp; Runtimes",
            "React, Next.js, Node.js, .NET, Three.js, Tailwind",
        ),
        ("Data", "Supabase, PostgreSQL, RDBMS"),
        (
            "Automation",
            "n8n, Webhooks, API Integration, Workflow Design, E-commerce Ops",
        ),
        (
            "Tooling",
            "Git, Linux, GitHub Actions, CI / CD, Agile Methodologies",
        ),
        (
            "Cloud",
            "Vercel, Cloudflare, AWS, Docker, nginx",
        ),
    ]
    for label, items in skill_rows:
        story.append(
            Paragraph(
                f"<b>{label}:</b> &nbsp; {items}",
                s_pill,
            )
        )

    # --- Technical Projects ---
    # Header travels with the first project so it cannot be orphaned at
    # the bottom of a page.
    story.append(
        KeepTogether(
            section("Technical Projects")
            + [
                two_col_row(
                    "<b>SolderDB</b> &nbsp;|&nbsp; "
                    "<i>Systems · Local-First Database</i> &nbsp;|&nbsp; "
                    "Go, LSM Tree, Wails, SSE, Bloom Filter, CRC32C",
                    "2026",
                ),
                Paragraph(
                    "A local-first database with PocketBase / Supabase parity, built on a "
                    "from-scratch Go LSM storage engine and shipped as a single Wails "
                    "desktop executable. Wrote the complete LSM-tree engine in Go: WAL "
                    "with CRC32C torn-tail recovery, memtable flush, SSTables, leveled "
                    "compaction, bloom filters in front of disk reads. Added power-aware "
                    "compaction that pauses background work on battery / thermal pressure. "
                    "Wrapped the engine in a BaaS layer - collections with schemas and "
                    "rules, bcrypt + HMAC-SHA256 auth, multipart blob storage, realtime "
                    "via Server-Sent Events, REST CRUD endpoints, JS and Go SDKs, plus a "
                    "Wails React control center with a live LSM memtable-flush visualizer.",
                    s_body,
                ),
            ]
        )
    )

    # PyroOS
    story.append(
        KeepTogether(
            [
                two_col_row(
                    "<b>PyroOS</b> &nbsp;|&nbsp; "
                    "<i>Systems · Custom Operating System (In Progress)</i> &nbsp;|&nbsp; "
                    "Assembly, C, x86, QEMU",
                    "2026 -",
                ),
                Paragraph(
                    "Custom operating system built from the bootloader up: an x86 hobby OS "
                    "with an assembly bootloader (boot.asm) transitioning the CPU from Real "
                    "Mode to Protected Mode, setting up the Global Descriptor Table (GDT) "
                    "and Interrupt Descriptor Table (IDT), and shipping a VGA text-mode "
                    "driver, with a C kernel growing on top - developed and debugged "
                    "entirely in QEMU. Goal: an OS small enough to understand end-to-end "
                    "- every interrupt vector, every memory page, every scheduled task.",
                    s_body,
                ),
            ]
        )
    )

    # AlgoWizard
    story.append(
        KeepTogether(
            [
                two_col_row(
                    "<b>AlgoWizard</b> &nbsp;|&nbsp; "
                    "<i>Full-Stack · Educational Platform</i> &nbsp;|&nbsp; "
                    "React, Next.js, TypeScript, Supabase",
                    "2025 - 2026",
                ),
                Paragraph(
                    "Engineered an educational ecosystem that turns abstract data structures "
                    "and algorithms into interactive, real-time visualizations. Architected "
                    "the backend on Supabase for secure auth and persistent per-user progress "
                    "across modules. Optimized client-side rendering so heavy algorithmic "
                    "simulations stay smooth at high step counts, providing a high-performance "
                    "environment for technical mastery.",
                    s_body,
                ),
            ]
        )
    )

    # Coefficient
    story.append(
        KeepTogether(
            [
                two_col_row(
                    "<b>Coefficient</b> &nbsp;|&nbsp; "
                    "<i>Frontend · Logic Simulator</i> &nbsp;|&nbsp; "
                    "Next.js, React, SSR",
                    "2025 - 2026",
                ),
                Paragraph(
                    "High-performance frontend tool simulating complex system logic and "
                    "performance optimization techniques directly in the browser. "
                    "Engineered reusable logic components handling sub-millisecond state "
                    "transitions for logic-gate and architectural simulations. Leveraged "
                    "Next.js SSR to significantly improve initial load speeds and SEO "
                    "accessibility.",
                    s_body,
                ),
            ]
        )
    )

    # Personal Portfolio
    story.append(
        KeepTogether(
            [
                two_col_row(
                    "<b>Personal Portfolio</b> &nbsp;|&nbsp; "
                    "<i>Creative Engineering</i> &nbsp;|&nbsp; "
                    "Three.js, GLSL, GSAP, Next.js",
                    "2026",
                ),
                Paragraph(
                    "WebGL-driven portfolio built from scratch - exploded motherboard hero "
                    "scene in Three.js with custom GLSL shaders for PCB traces, cursor-magnetic "
                    "component physics, additive-blend particle systems, draggable card-stack "
                    "project deck, text-built skills sphere, intro loader, smooth-scroll, "
                    "keyboard shortcuts, optional sound system.",
                    s_body,
                ),
            ]
        )
    )

    # --- Achievements ---
    story += section("Achievements &amp; Leadership")
    for b in [
        "<b>(2026) Academic Excellence</b> - Ranked within the top 1% of the Computer "
        "Science and Engineering department across the full diploma program.",
        "<b>(2023 - 2026) Engineering Leadership</b> - Elected Class Representative for all "
        "three years of the diploma program. Primary liaison between the student body and "
        "faculty; organized technical class discussions and supported peers in academic "
        "navigation and technical tutoring.",
    ]:
        story.append(Paragraph(b, s_bullet, bulletText="•"))

    # --- Languages & Interests ---
    story += section("Languages &amp; Interests")
    story.append(
        Paragraph(
            "<b>Languages:</b> &nbsp; English (Native / Bilingual), Telugu (Native), "
            "Hindi (Proficient)",
            s_pill,
        )
    )
    story.append(
        Paragraph(
            "<b>Interests:</b> &nbsp; Performance Tuning, Open-Source Android "
            "Customization, Music, Films, Photography",
            s_pill,
        )
    )

    doc.build(story)
    print(f"Wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    build()

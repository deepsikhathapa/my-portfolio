from django.core.management.base import BaseCommand
from portfolio import models as m


class Command(BaseCommand):
    help = "Fill the CMS with starter content from Deepsikha's CV (skips if a profile exists)"

    def handle(self, *a, **k):
        if m.Profile.objects.exists():
            return self.stdout.write("Profile exists, nothing seeded.")
        m.Profile.objects.create(
            name="Deepsikha Thapa", role="QA Engineer", company="Bidhee Pvt. Ltd.", location="Kathmandu, Nepal",
            headline="I find the bug|before your users do.",
            headline_ne="म बग भेट्टाउँछु|प्रयोगकर्ताले भेट्टाउनुअघि।",
            intro="QA engineer testing ERP, HRMS and asset management systems. I write the bug report developers actually want to receive.",
            about="I test web-based business systems: an asset and inventory management system, an HRMS and a construction ERP. My days go into test plans, approval workflows, API checks and defects that I follow from first report to verified fix.\n\nI started as a QA trainee in December 2025 and moved up to QA Associate and Support Officer within six months. I also handle first-line support, so I know how a bug looks to the person who hits it.",
            email="deepseekathapa@gmail.com", linkedin="https://linkedin.com/in/deepsikhathapa",
        )
        for i, (v, l) in enumerate([("3", "Business systems tested"), ("2", "Interface languages checked"), ("API + UI", "Layers covered")]):
            m.Stat.objects.create(order=i, value=v, label=l)
        groups = [
            ("Testing types", "Planned coverage for every release.", "teal", ["Functional", "Regression", "Integration", "Smoke", "Sanity", "UAT", "End-to-end workflows"]),
            ("API and automation", "Repeatable checks, not repeated clicking.", "blue", ["REST API testing", "Browser test scripts", "Git and GitHub", "Browser dev tools"]),
            ("Defect management", "From first report to verified fix.", "red", ["JIRA", "Bug prioritisation", "Defect lifecycle", "Root cause analysis"]),
            ("Cross-platform checks", "Same behaviour, wherever it runs.", "purple", ["Cross-browser", "Mobile", "Login and roles", "English and Nepali screens"]),
            ("Systems", "Domains I know well.", "amber", ["ERP", "Asset and inventory management", "HRMS", "Approval workflows"]),
            ("Working style", "How I work with a team.", "sky", ["Developer collaboration", "Client communication", "Clear documentation", "Attention to detail"]),
        ]
        for i, (t, d, c, skills) in enumerate(groups):
            g = m.SkillGroup.objects.create(order=i, title=t, description=d, color=c)
            for j, n in enumerate(skills):
                m.Skill.objects.create(group=g, order=j, name=n)
        m.Experience.objects.create(order=0, role="QA Associate and Support Officer", company="Bidhee Pvt. Ltd.", period="May 2026 – Present", location="Kathmandu", current=True, bullets="\n".join([
            "Write and run test plans, test cases and end-to-end scenarios for web-based AIMS and ERP modules.",
            "Run functional, regression, integration, smoke, sanity and UAT cycles across approval workflows and reports.",
            "Log defects in JIRA with clear reproduction steps and follow each one to a verified fix.",
            "Test REST APIs and use browser dev tools to inspect network calls.",
            "Write browser test scripts for repeat regression checks, kept in Git and GitHub.",
            "Check cross-browser, mobile, login, role permissions and English and Nepali screens.",
            "Triage end-user issues as first-line support and escalate with reproduction steps."]))
        m.Experience.objects.create(order=1, role="Quality Assurance Trainee", company="Bidhee Pvt. Ltd.", period="Dec 2025 – May 2026", location="Kathmandu", bullets="\n".join([
            "Designed and ran test scenarios for inventory management workflows and found edge-case defects.",
            "Helped senior QA engineers prepare test plans, test cases and UAT documents.",
            "Learned fixed asset lifecycle management and ERP data validation."]))
        projs = [
            ("Asset and inventory management system", "Fixed asset lifecycle, stock movements, multi-step approvals and report outputs. Critical defects found in UAT were fixed before production.", "UAT, Regression, JIRA", "teal"),
            ("HRMS", "Login, role-based permissions and approval flows around sensitive employee data, checked against the written spec.", "Roles, Workflows, Permissions", "blue"),
            ("ERP for construction", "Links between modules, approval chains and reports, with API checks and repeat regression scripts.", "Integration, API, Automation", "red"),
        ]
        for i, (t, s, tg, c) in enumerate(projs):
            m.Project.objects.create(order=i, title=t, summary=s, tags=tg, color=c)
        m.Education.objects.create(order=0, title="Bachelor of Information Technology", institution="Texas College of Management and IT, Kathmandu", years="2022 – 2026")
        m.Education.objects.create(order=1, title="Higher Secondary, Physical Sciences", institution="St. Joseph's Secondary School, Biratnagar", years="2018 – 2020")
        self.stdout.write("Seeded. Now open /admin to edit.")

from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from services.groq_service import GroqService

SYSTEM_INSTRUCTION = """
Você é um mentor de carreira especializado em criar planos de desenvolvimento
profissional realistas e acionáveis para fechar lacunas de competências.
"""


class CareerPlanService:
    def __init__(self):
        self.groq = GroqService()

    def generate_plan(self, competencias_ausentes: list) -> dict:
        prompt = f"""
        Com base nas competências ausentes abaixo, gere um plano de desenvolvimento
        em JSON com a estrutura:
        {{
          "curto_prazo": [{{"titulo": "", "descricao": "", "tipo": "curso|certificacao|projeto|estudo"}}],
          "medio_prazo": [...],
          "longo_prazo": [...]
        }}

        curto_prazo: até 30 dias
        medio_prazo: até 90 dias
        longo_prazo: até 180 dias

        Inclua sugestões de cursos, certificações, projetos práticos,
        conteúdos de estudo e preparação para entrevistas.

        Competências ausentes: {competencias_ausentes}
        """
        return self.groq.generate_json(prompt, system_instruction=SYSTEM_INSTRUCTION)

    def render_pdf(self, plan_data: dict) -> bytes:
        buf = BytesIO()
        doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=20*mm, rightMargin=20*mm)
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "Title2", parent=styles["Heading1"],
            textColor=colors.HexColor("#1e3a8a"),
            fontSize=20, spaceAfter=6, spaceBefore=0,
        )
        section_style = ParagraphStyle(
            "Section2", parent=styles["Heading2"],
            textColor=colors.HexColor("#2563eb"),
            fontSize=14, spaceAfter=8, spaceBefore=16,
        )
        item_title = ParagraphStyle(
            "ItemTitle", parent=styles["Normal"],
            fontSize=11, fontName="Helvetica-Bold",
            textColor=colors.HexColor("#1e3a8a"),
            spaceAfter=2,
        )
        item_desc = ParagraphStyle(
            "ItemDesc", parent=styles["Normal"],
            fontSize=10, textColor=colors.HexColor("#334155"),
            leading=14, spaceAfter=10,
        )

        elements = []
        elements.append(Paragraph("Plano de Desenvolvimento", title_style))
        elements.append(Spacer(1, 4*mm))

        sections = [
            ("Curto Prazo (30 dias)", plan_data.get("curto_prazo", [])),
            ("Médio Prazo (90 dias)", plan_data.get("medio_prazo", [])),
            ("Longo Prazo (180 dias)", plan_data.get("longo_prazo", [])),
        ]

        for section_title, items in sections:
            if not items:
                continue
            elements.append(Paragraph(section_title, section_style))
            for item in items:
                elements.append(Paragraph(item.get("titulo", ""), item_title))
                elements.append(Paragraph(item.get("descricao", ""), item_desc))

        doc.build(elements)
        return buf.getvalue()

from services.gemini_service import GeminiService

SYSTEM_INSTRUCTION = """
Você é um mentor de carreira especializado em criar planos de desenvolvimento
profissional realistas e acionáveis para fechar lacunas de competências.
"""


class CareerPlanService:
    def __init__(self):
        self.gemini = GeminiService()

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
        return self.gemini.generate_json(prompt, system_instruction=SYSTEM_INSTRUCTION)

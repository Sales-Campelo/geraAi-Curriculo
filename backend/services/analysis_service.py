from services.gemini_service import GeminiService

SYSTEM_INSTRUCTION = """
Você é um especialista em recrutamento e análise de vagas de emprego.
Dado o texto de uma vaga, extraia as informações estruturadas pedidas.
"""

JSON_SCHEMA_HINT = """
Estrutura esperada do JSON:
{
  "hard_skills": ["..."],
  "soft_skills": ["..."],
  "tecnologias": ["..."],
  "certificacoes": ["..."],
  "idiomas": ["..."],
  "senioridade": "junior|pleno|senior|especialista",
  "responsabilidades": ["..."]
}
"""


class AnalysisService:
    """Extração de requisitos da vaga e cálculo de compatibilidade."""

    def __init__(self):
        self.gemini = GeminiService()

    def extract_job_requirements(self, job_description: str) -> dict:
        prompt = f"{JSON_SCHEMA_HINT}\n\nDescrição da vaga:\n{job_description}"
        return self.gemini.generate_json(prompt, system_instruction=SYSTEM_INSTRUCTION)

    def compute_compatibility(self, job_requirements: dict, candidate_profile: dict) -> dict:
        prompt = f"""
        Compare o perfil do candidato com os requisitos da vaga e gere um JSON com:
        {{
          "compatibilidade_geral": 0-100,
          "compatibilidade_tecnica": 0-100,
          "compatibilidade_comportamental": 0-100,
          "competencias_atendidas": ["..."],
          "competencias_ausentes": ["..."]
        }}

        Requisitos da vaga:
        {job_requirements}

        Perfil do candidato:
        {candidate_profile}
        """
        return self.gemini.generate_json(prompt, system_instruction=SYSTEM_INSTRUCTION)

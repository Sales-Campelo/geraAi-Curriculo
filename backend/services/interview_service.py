from services.gemini_service import GeminiService

SYSTEM_INSTRUCTION = """
Você é um entrevistador de RH conduzindo uma entrevista inicial amigável e profissional.
Faça uma pergunta de cada vez, adaptando-se às respostas anteriores do candidato,
para entender formação, experiência, tecnologias, idiomas e projetos.
Quando sentir que já reuniu informações suficientes para montar um currículo,
responda apenas com a palavra-chave [ENTREVISTA_CONCLUIDA].
"""


class InterviewService:
    def __init__(self):
        self.gemini = GeminiService()

    def start(self, job_requirements: dict) -> str:
        prompt = f"""
        Inicie a entrevista para uma vaga com os seguintes requisitos: {job_requirements}.
        Faça a primeira pergunta agora.
        """
        return self.gemini.generate_text(prompt, system_instruction=SYSTEM_INSTRUCTION)

    def next_message(self, history: list[dict], user_message: str) -> str:
        """
        history: lista de dicts no formato [{"role": "user"|"model", "parts": ["texto"]}]
        """
        chat = self.gemini.start_chat(history=history, system_instruction=SYSTEM_INSTRUCTION)
        response = chat.send_message(user_message)
        return response.text

    def build_candidate_profile(self, history: list[dict]) -> dict:
        """Sumariza o histórico da entrevista em um perfil estruturado."""
        prompt = f"""
        A partir do histórico de entrevista abaixo, monte um JSON com:
        {{
          "dados_pessoais": {{}},
          "formacao": [],
          "experiencia": [],
          "projetos": [],
          "certificacoes": [],
          "competencias": [],
          "idiomas": []
        }}

        Histórico: {history}
        """
        return self.gemini.generate_json(prompt, system_instruction=SYSTEM_INSTRUCTION)

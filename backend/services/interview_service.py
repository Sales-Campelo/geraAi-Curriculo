from services.groq_service import GroqService

SYSTEM_INSTRUCTION = """
Você é um entrevistador de RH conduzindo uma entrevista inicial amigável e profissional.
Você deve fazer exatamente 5 perguntas, uma de cada vez, adaptando-se às respostas 
anteriores do candidato, para entender formação, experiência, tecnologias, idiomas e projetos.
Após receber a 5ª resposta do candidato, agradeça e informe que a entrevista foi concluída.
"""


class InterviewService:
    def __init__(self):
        self.groq = GroqService()

    def start(self, job_requirements: dict) -> str:
        prompt = f"""
        Inicie a entrevista para uma vaga com os seguintes requisitos: {job_requirements}.
        Faça a primeira pergunta agora.
        """
        return self.groq.generate_text(prompt, system_instruction=SYSTEM_INSTRUCTION)

    def next_message(self, history: list[dict], user_message: str) -> str:
        return self.groq.send_message(history, user_message, system_instruction=SYSTEM_INSTRUCTION)

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
        return self.groq.generate_json(prompt, system_instruction=SYSTEM_INSTRUCTION)

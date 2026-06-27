"""
Camada de serviço responsável por toda comunicação com a API do Gemini.
Nenhuma view deve importar google.generativeai diretamente — sempre
passar por este módulo (ou pelos services especializados que o usam).
"""
import json
import logging

from django.conf import settings

logger = logging.getLogger(__name__)

try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover
    genai = None


class GeminiService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY não configurada no .env")
        if genai is not None and settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model_name = settings.GEMINI_MODEL

    def _get_model(self, system_instruction: str | None = None):
        if genai is None:
            raise RuntimeError(
                "Pacote google-generativeai não instalado. Rode pip install -r requirements.txt"
            )
        return genai.GenerativeModel(
            model_name=self.model_name,
            system_instruction=system_instruction,
        )

    def generate_text(self, prompt: str, system_instruction: str | None = None) -> str:
        model = self._get_model(system_instruction)
        response = model.generate_content(prompt)
        return response.text

    def generate_json(self, prompt: str, system_instruction: str | None = None) -> dict:
        """
        Força o modelo a responder apenas em JSON e faz o parse seguro.
        """
        full_instruction = (
            (system_instruction or "")
            + "\n\nResponda SOMENTE com um JSON válido, sem markdown, "
            "sem ```json, sem texto antes ou depois."
        )
        raw = self.generate_text(prompt, system_instruction=full_instruction)
        cleaned = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            logger.error("Falha ao decodificar JSON do Gemini: %s", raw)
            return {}

    def start_chat(self, history: list | None = None, system_instruction: str | None = None):
        model = self._get_model(system_instruction)
        return model.start_chat(history=history or [])

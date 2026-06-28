import json
import logging

from django.conf import settings

logger = logging.getLogger(__name__)

try:
    from groq import Groq
except ImportError:
    Groq = None


class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model_name = settings.GROQ_MODEL
        self._client = None

    @property
    def client(self):
        if self._client is None:
            if Groq is None:
                raise RuntimeError(
                    "Pacote groq não instalado. Rode pip install -r requirements.txt"
                )
            if not self.api_key:
                logger.warning("GROQ_API_KEY não configurada no .env")
            self._client = Groq(api_key=self.api_key)
        return self._client

    def _build_messages(self, prompt: str, system_instruction: str | None = None) -> list:
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})
        return messages

    def generate_text(self, prompt: str, system_instruction: str | None = None) -> str:
        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=self._build_messages(prompt, system_instruction),
            )
            return completion.choices[0].message.content or ""
        except Exception as e:
            logger.error("Erro no Groq generate_text: %s", e)
            return ""

    def generate_json(self, prompt: str, system_instruction: str | None = None) -> dict:
        full_instruction = (
            (system_instruction or "")
            + "\n\nResponda SOMENTE com um JSON válido, sem markdown, "
            "sem ```json, sem texto antes ou depois."
        )
        raw = ""
        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=self._build_messages(prompt, full_instruction),
                response_format={"type": "json_object"},
            )
            raw = completion.choices[0].message.content or ""
            return json.loads(raw)
        except (json.JSONDecodeError, Exception) as e:
            logger.error("Falha ao decodificar JSON do Groq: %s | erro: %s", raw, e)
            return {}

    def send_message(
        self,
        history: list,
        user_message: str,
        system_instruction: str | None = None,
    ) -> str:
        try:
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            for msg in history:
                role = "assistant" if msg.get("role") == "model" else msg.get("role", "user")
                content = msg.get("parts", [""])[0] if isinstance(msg.get("parts"), list) else msg.get("content", "")
                messages.append({"role": role, "content": content})
            messages.append({"role": "user", "content": user_message})

            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
            )
            return completion.choices[0].message.content or ""
        except Exception as e:
            logger.error("Erro no Groq send_message: %s", e)
            return ""

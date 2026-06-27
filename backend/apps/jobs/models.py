import uuid

from django.db import models


class JobAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    raw_description = models.TextField()

    hard_skills = models.JSONField(default=list, blank=True)
    soft_skills = models.JSONField(default=list, blank=True)
    tecnologias = models.JSONField(default=list, blank=True)
    certificacoes = models.JSONField(default=list, blank=True)
    idiomas = models.JSONField(default=list, blank=True)
    senioridade = models.CharField(max_length=50, blank=True)
    responsabilidades = models.JSONField(default=list, blank=True)

    session_id = models.CharField(max_length=100, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"JobAnalysis {self.id} ({self.senioridade})"

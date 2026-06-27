import uuid

from django.db import models

from apps.interviews.models import InterviewSession
from apps.jobs.models import JobAnalysis


class Resume(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    interview_session = models.ForeignKey(
        InterviewSession, on_delete=models.CASCADE, related_name="resumes"
    )
    job_analysis = models.ForeignKey(
        JobAnalysis, on_delete=models.CASCADE, related_name="resumes"
    )

    content = models.JSONField(default=dict)  # estrutura completa do currículo

    compatibilidade_geral = models.FloatField(null=True, blank=True)
    compatibilidade_tecnica = models.FloatField(null=True, blank=True)
    compatibilidade_comportamental = models.FloatField(null=True, blank=True)
    competencias_atendidas = models.JSONField(default=list, blank=True)
    competencias_ausentes = models.JSONField(default=list, blank=True)

    share_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Resume {self.id}"

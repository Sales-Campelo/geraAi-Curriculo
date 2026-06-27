import uuid

from django.db import models

from apps.jobs.models import JobAnalysis


class InterviewSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job_analysis = models.ForeignKey(
        JobAnalysis, on_delete=models.CASCADE, related_name="interviews"
    )
    session_id = models.CharField(max_length=100, db_index=True)
    history = models.JSONField(default=list, blank=True)  # [{"role": "user"|"model", "parts": ["..."]}]
    candidate_profile = models.JSONField(default=dict, blank=True)
    finished = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"InterviewSession {self.id}"

import uuid

from django.db import models

from apps.resumes.models import Resume


class CareerPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name="career_plan")

    curto_prazo = models.JSONField(default=list, blank=True)   # até 30 dias
    medio_prazo = models.JSONField(default=list, blank=True)   # até 90 dias
    longo_prazo = models.JSONField(default=list, blank=True)   # até 180 dias

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CareerPlan {self.id}"

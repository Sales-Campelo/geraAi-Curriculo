import hashlib
import uuid

from django.db import models


class Feedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rating = models.PositiveSmallIntegerField()  # 1 a 5
    comment = models.TextField(blank=True)

    session_id = models.CharField(max_length=100, db_index=True)
    generated_resume_id = models.UUIDField(null=True, blank=True)
    user_ip_hash = models.CharField(max_length=64, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Feedback {self.rating}/5 - {self.id}"

    @staticmethod
    def hash_ip(ip_address: str) -> str:
        return hashlib.sha256(ip_address.encode()).hexdigest()

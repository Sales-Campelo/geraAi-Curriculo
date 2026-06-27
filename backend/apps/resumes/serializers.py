from rest_framework import serializers

from .models import Resume


class ResumeGenerateRequestSerializer(serializers.Serializer):
    interview_id = serializers.UUIDField()


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            "id",
            "interview_session",
            "job_analysis",
            "content",
            "compatibilidade_geral",
            "compatibilidade_tecnica",
            "compatibilidade_comportamental",
            "competencias_atendidas",
            "competencias_ausentes",
            "share_token",
            "created_at",
        ]
        read_only_fields = fields

from rest_framework import serializers

from apps.jobs.models import JobAnalysis

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
            "status",
            "share_token",
            "created_at",
        ]
        read_only_fields = fields


class ResumeListSerializer(serializers.ModelSerializer):
    job_title = serializers.SerializerMethodField()
    job_company = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            "id",
            "job_title",
            "job_company",
            "compatibilidade_geral",
            "compatibilidade_tecnica",
            "compatibilidade_comportamental",
            "status",
            "share_token",
            "created_at",
        ]

    def get_job_title(self, obj):
        return obj.job_analysis.raw_description[:80] if obj.job_analysis else ""

    def get_job_company(self, obj):
        return ""


class ResumeStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=["enviado", "teste", "entrevista", "conclusao"]
    )

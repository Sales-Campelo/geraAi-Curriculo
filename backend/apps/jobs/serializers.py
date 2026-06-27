from rest_framework import serializers

from .models import JobAnalysis


class JobAnalysisRequestSerializer(serializers.Serializer):
    job_description = serializers.CharField()
    session_id = serializers.CharField(max_length=100)


class JobAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAnalysis
        fields = [
            "id",
            "raw_description",
            "hard_skills",
            "soft_skills",
            "tecnologias",
            "certificacoes",
            "idiomas",
            "senioridade",
            "responsabilidades",
            "session_id",
            "created_at",
        ]
        read_only_fields = fields

from rest_framework import serializers

from .models import InterviewSession


class InterviewStartRequestSerializer(serializers.Serializer):
    job_analysis_id = serializers.UUIDField()
    session_id = serializers.CharField(max_length=100)


class InterviewMessageRequestSerializer(serializers.Serializer):
    interview_id = serializers.UUIDField()
    message = serializers.CharField()


class InterviewSessionSerializer(serializers.ModelSerializer):
    total_questions = serializers.SerializerMethodField()

    class Meta:
        model = InterviewSession
        fields = [
            "id",
            "job_analysis",
            "session_id",
            "history",
            "candidate_profile",
            "finished",
            "question_count",
            "total_questions",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_total_questions(self, obj):
        return 5

from rest_framework import serializers

from .models import CareerPlan


class CareerPlanGenerateRequestSerializer(serializers.Serializer):
    resume_id = serializers.UUIDField()


class CareerPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerPlan
        fields = ["id", "resume", "curto_prazo", "medio_prazo", "longo_prazo", "created_at"]
        read_only_fields = fields

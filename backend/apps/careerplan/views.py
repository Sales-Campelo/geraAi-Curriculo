from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.resumes.models import Resume
from services.careerplan_service import CareerPlanService

from .models import CareerPlan
from .serializers import CareerPlanGenerateRequestSerializer, CareerPlanSerializer


class CareerPlanGenerateView(APIView):
    """POST /api/career-plan/generate/"""

    def post(self, request):
        request_serializer = CareerPlanGenerateRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        data = request_serializer.validated_data

        resume = get_object_or_404(Resume, id=data["resume_id"])

        service = CareerPlanService()
        plan_data = service.generate_plan(resume.competencias_ausentes)

        plan, _ = CareerPlan.objects.update_or_create(
            resume=resume,
            defaults={
                "curto_prazo": plan_data.get("curto_prazo", []),
                "medio_prazo": plan_data.get("medio_prazo", []),
                "longo_prazo": plan_data.get("longo_prazo", []),
            },
        )

        return Response(CareerPlanSerializer(plan).data, status=status.HTTP_201_CREATED)


class CareerPlanDetailView(APIView):
    """GET /api/career-plan/{id}/"""

    def get(self, request, plan_id):
        plan = get_object_or_404(CareerPlan, id=plan_id)
        fmt = request.query_params.get("format")

        if fmt == "pdf":
            service = CareerPlanService()
            pdf_bytes = service.render_pdf({
                "curto_prazo": plan.curto_prazo,
                "medio_prazo": plan.medio_prazo,
                "longo_prazo": plan.longo_prazo,
            })
            return HttpResponse(pdf_bytes, content_type="application/pdf")

        return Response(CareerPlanSerializer(plan).data)

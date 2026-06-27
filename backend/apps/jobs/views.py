import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from services.analysis_service import AnalysisService

from .models import JobAnalysis
from .serializers import JobAnalysisRequestSerializer, JobAnalysisSerializer

logger = logging.getLogger(__name__)


class JobAnalyzeView(APIView):
    """POST /api/jobs/analyze/"""

    def post(self, request):
        request_serializer = JobAnalysisRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        data = request_serializer.validated_data

        try:
            analysis_service = AnalysisService()
            extracted = analysis_service.extract_job_requirements(
                data["job_description"]
            )
        except Exception as e:
            logger.error("Erro ao extrair requisitos da vaga: %s", str(e))
            return Response(
                {"error": "Falha ao analisar a descrição da vaga. Tente novamente."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        job_analysis = JobAnalysis.objects.create(
            raw_description=data["job_description"],
            session_id=data["session_id"],
            hard_skills=extracted.get("hard_skills", []),
            soft_skills=extracted.get("soft_skills", []),
            tecnologias=extracted.get("tecnologias", []),
            certificacoes=extracted.get("certificacoes", []),
            idiomas=extracted.get("idiomas", []),
            senioridade=extracted.get("senioridade", ""),
            responsabilidades=extracted.get("responsabilidades", []),
        )

        return Response(
            JobAnalysisSerializer(job_analysis).data, status=status.HTTP_201_CREATED
        )

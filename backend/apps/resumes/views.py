from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.interviews.models import InterviewSession
from services.analysis_service import AnalysisService
from services.resume_service import ResumeService

from .models import Resume
from .serializers import ResumeGenerateRequestSerializer, ResumeSerializer


class ResumeGenerateView(APIView):
    """POST /api/resumes/generate/"""

    def post(self, request):
        request_serializer = ResumeGenerateRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        data = request_serializer.validated_data

        interview = get_object_or_404(InterviewSession, id=data["interview_id"])
        job_analysis = interview.job_analysis

        job_requirements = {
            "hard_skills": job_analysis.hard_skills,
            "soft_skills": job_analysis.soft_skills,
            "tecnologias": job_analysis.tecnologias,
            "certificacoes": job_analysis.certificacoes,
            "idiomas": job_analysis.idiomas,
            "senioridade": job_analysis.senioridade,
            "responsabilidades": job_analysis.responsabilidades,
        }

        resume_service = ResumeService()
        analysis_service = AnalysisService()

        content = resume_service.generate_resume_content(
            interview.candidate_profile, job_requirements
        )
        compatibility = analysis_service.compute_compatibility(
            job_requirements, interview.candidate_profile
        )

        resume = Resume.objects.create(
            interview_session=interview,
            job_analysis=job_analysis,
            content=content,
            compatibilidade_geral=compatibility.get("compatibilidade_geral"),
            compatibilidade_tecnica=compatibility.get("compatibilidade_tecnica"),
            compatibilidade_comportamental=compatibility.get(
                "compatibilidade_comportamental"
            ),
            competencias_atendidas=compatibility.get("competencias_atendidas", []),
            competencias_ausentes=compatibility.get("competencias_ausentes", []),
        )

        return Response(ResumeSerializer(resume).data, status=status.HTTP_201_CREATED)


class ResumeDetailView(APIView):
    """GET /api/resumes/{id}/"""

    def get(self, request, resume_id):
        resume = get_object_or_404(Resume, id=resume_id)
        fmt = request.query_params.get("format")

        if fmt == "pdf":
            service = ResumeService()
            pdf_bytes = service.render_pdf(resume.content)
            return HttpResponse(pdf_bytes, content_type="application/pdf")

        if fmt == "docx":
            service = ResumeService()
            docx_bytes = service.render_docx(resume.content)
            return HttpResponse(
                docx_bytes,
                content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )

        return Response(ResumeSerializer(resume).data)

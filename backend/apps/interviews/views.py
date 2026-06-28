from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.jobs.models import JobAnalysis
from services.interview_service import InterviewService

from .models import InterviewSession
from .serializers import (
    InterviewMessageRequestSerializer,
    InterviewSessionSerializer,
    InterviewStartRequestSerializer,
)


class InterviewStartView(APIView):
    """POST /api/interviews/start/"""

    def post(self, request):
        request_serializer = InterviewStartRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        data = request_serializer.validated_data

        job_analysis = get_object_or_404(JobAnalysis, id=data["job_analysis_id"])

        interview_service = InterviewService()
        job_requirements = {
            "hard_skills": job_analysis.hard_skills,
            "soft_skills": job_analysis.soft_skills,
            "tecnologias": job_analysis.tecnologias,
            "senioridade": job_analysis.senioridade,
        }
        first_question = interview_service.start(job_requirements)

        session = InterviewSession.objects.create(
            job_analysis=job_analysis,
            session_id=data["session_id"],
            history=[{"role": "model", "parts": [first_question]}],
            question_count=1,
        )

        return Response(
            InterviewSessionSerializer(session).data, status=status.HTTP_201_CREATED
        )


class InterviewMessageView(APIView):
    """POST /api/interviews/message/"""

    def post(self, request):
        request_serializer = InterviewMessageRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)
        data = request_serializer.validated_data

        session = get_object_or_404(InterviewSession, id=data["interview_id"])

        interview_service = InterviewService()

        session.history.append({"role": "user", "parts": [data["message"]]})

        if session.question_count >= 5:
            session.finished = True
            session.candidate_profile = interview_service.build_candidate_profile(
                session.history
            )
        else:
            reply = interview_service.next_message(session.history, data["message"])
            session.history.append({"role": "model", "parts": [reply]})
            session.question_count += 1

        session.save()

        return Response(InterviewSessionSerializer(session).data)

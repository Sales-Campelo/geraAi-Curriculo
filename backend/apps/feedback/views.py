from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Feedback
from .serializers import FeedbackSerializer


def get_client_ip(request) -> str:
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "0.0.0.0")


class FeedbackCreateView(APIView):
    """POST /api/feedback/"""

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ip_hash = Feedback.hash_ip(get_client_ip(request))
        feedback = serializer.save(user_ip_hash=ip_hash)

        return Response(FeedbackSerializer(feedback).data, status=status.HTTP_201_CREATED)

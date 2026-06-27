from django.db.models import Avg, Count
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.feedback.models import Feedback
from apps.jobs.models import JobAnalysis
from apps.resumes.models import Resume


class StatisticsView(APIView):
    """GET /api/statistics/

    Dados agregados para o dashboard administrativo:
    - quantidade de currículos gerados
    - quantidade de análises realizadas
    - média das avaliações
    - comentários recebidos
    - taxa de conversão (análises -> currículos)
    """

    def get(self, request):
        total_analises = JobAnalysis.objects.count()
        total_curriculos = Resume.objects.count()
        total_feedbacks = Feedback.objects.count()
        media_avaliacao = Feedback.objects.aggregate(avg=Avg("rating"))["avg"] or 0

        taxa_conversao = (
            round((total_curriculos / total_analises) * 100, 2)
            if total_analises
            else 0
        )

        comentarios = list(
            Feedback.objects.exclude(comment="")
            .order_by("-created_at")
            .values("id", "rating", "comment", "created_at")[:50]
        )

        return Response(
            {
                "total_analises": total_analises,
                "total_curriculos_gerados": total_curriculos,
                "total_feedbacks": total_feedbacks,
                "media_avaliacao": round(media_avaliacao, 2),
                "taxa_conversao_percentual": taxa_conversao,
                "comentarios_recentes": comentarios,
            }
        )

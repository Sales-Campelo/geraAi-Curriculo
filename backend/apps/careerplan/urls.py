from django.urls import path

from .views import CareerPlanGenerateView

urlpatterns = [
    path("generate/", CareerPlanGenerateView.as_view(), name="careerplan-generate"),
]

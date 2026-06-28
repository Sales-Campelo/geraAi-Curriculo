from django.urls import path

from .views import CareerPlanDetailView, CareerPlanGenerateView

urlpatterns = [
    path("generate/", CareerPlanGenerateView.as_view(), name="careerplan-generate"),
    path("<uuid:plan_id>/", CareerPlanDetailView.as_view(), name="careerplan-detail"),
]

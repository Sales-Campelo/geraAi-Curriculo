from django.urls import path

from .views import JobAnalyzeView

urlpatterns = [
    path("analyze/", JobAnalyzeView.as_view(), name="job-analyze"),
]

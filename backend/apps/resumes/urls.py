from django.urls import path

from .views import ResumeDetailView, ResumeGenerateView

urlpatterns = [
    path("generate/", ResumeGenerateView.as_view(), name="resume-generate"),
    path("<uuid:resume_id>/", ResumeDetailView.as_view(), name="resume-detail"),
]

from django.urls import path

from .views import (
    ResumeDetailView,
    ResumeGenerateView,
    ResumeListView,
    ResumeStatusUpdateView,
)

urlpatterns = [
    path("generate/", ResumeGenerateView.as_view(), name="resume-generate"),
    path("", ResumeListView.as_view(), name="resume-list"),
    path("<uuid:resume_id>/", ResumeDetailView.as_view(), name="resume-detail"),
    path(
        "<uuid:resume_id>/status/",
        ResumeStatusUpdateView.as_view(),
        name="resume-status",
    ),
]

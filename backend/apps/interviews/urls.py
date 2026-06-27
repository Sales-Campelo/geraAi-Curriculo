from django.urls import path

from .views import InterviewMessageView, InterviewStartView

urlpatterns = [
    path("start/", InterviewStartView.as_view(), name="interview-start"),
    path("message/", InterviewMessageView.as_view(), name="interview-message"),
]

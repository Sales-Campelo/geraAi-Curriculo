from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/jobs/", include("apps.jobs.urls")),
    path("api/interviews/", include("apps.interviews.urls")),
    path("api/resumes/", include("apps.resumes.urls")),
    path("api/career-plan/", include("apps.careerplan.urls")),
    path("api/feedback/", include("apps.feedback.urls")),
    path("api/statistics/", include("apps.statistics.urls")),
]

from django.urls import include, path
from rest_framework.routers import SimpleRouter

from . import dashboard as d
from .views import ContactView, PortfolioView

router = SimpleRouter()
router.register("stats", d.StatViewSet, "dash-stats")
router.register("skill-groups", d.SkillGroupViewSet, "dash-skills")
router.register("experiences", d.ExperienceViewSet, "dash-experiences")
router.register("projects", d.ProjectViewSet, "dash-projects")
router.register("education", d.EducationViewSet, "dash-education")
router.register("messages", d.MessageViewSet, "dash-messages")
router.register("texts", d.TextViewSet, "dash-texts")

urlpatterns = [
    path("portfolio/", PortfolioView.as_view()),
    path("contact/", ContactView.as_view()),
    path("auth/login/", d.LoginView.as_view()),
    path("dashboard/me/", d.MeView.as_view()),
    path("dashboard/profile/", d.ProfileView.as_view()),
    path("dashboard/", include(router.urls)),
]

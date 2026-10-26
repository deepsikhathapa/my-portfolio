from django.conf import settings
from django.core.mail import send_mail
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from . import models as m, serializers as s


class ContactThrottle(AnonRateThrottle):
    scope = "contact"


class PortfolioView(APIView):
    def get(self, request):
        ctx = {"request": request}
        profile = m.Profile.objects.first()
        many = lambda ser, qs: ser(qs, many=True, context=ctx).data
        return Response({
            "profile": s.ProfileSerializer(profile, context=ctx).data if profile else None,
            "stats": many(s.StatSerializer, m.Stat.objects.all()),
            "skillGroups": many(s.SkillGroupSerializer, m.SkillGroup.objects.prefetch_related("skills")),
            "experiences": many(s.ExperienceSerializer, m.Experience.objects.all()),
            "projects": many(s.ProjectSerializer, m.Project.objects.all()),
            "education": many(s.EducationSerializer, m.Education.objects.all()),
            "texts": {t.key: {"en": t.en, "ne": t.ne} for t in m.Text.objects.all()},
        })


class ContactView(CreateAPIView):
    serializer_class = s.ContactSerializer
    throttle_classes = [ContactThrottle]

    def create(self, request, *args, **kwargs):
        if request.data.get("website"):  # honeypot: bots fill this hidden field
            return Response({"ok": True}, status=201)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        msg = serializer.save()
        if settings.NOTIFY_EMAIL:
            send_mail(f"Portfolio: {msg.subject}", f"From {msg.name} <{msg.email}>\n\n{msg.message}",
                      None, [settings.NOTIFY_EMAIL], fail_silently=True)

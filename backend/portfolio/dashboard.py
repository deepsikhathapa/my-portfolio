"""Staff-only API used by the custom dashboard (/api/dashboard/...)."""
from rest_framework import serializers, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from django.contrib.auth import authenticate

from . import models as m


class LoginThrottle(AnonRateThrottle):
    scope = "login"


class LoginView(APIView):
    authentication_classes = []
    throttle_classes = [LoginThrottle]

    def post(self, request):
        user = authenticate(username=request.data.get("username", ""), password=request.data.get("password", ""))
        if not user or not user.is_staff:
            return Response({"detail": "Wrong username or password."}, status=400)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})


class MeView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"username": request.user.username})

    def delete(self, request):  # log out: revoke the token
        Token.objects.filter(user=request.user).delete()
        return Response(status=204)


def simple(model, read_only=()):
    meta = type("Meta", (), {"model": model, "fields": "__all__", "read_only_fields": read_only})
    return type(f"{model.__name__}DashSerializer", (serializers.ModelSerializer,), {"Meta": meta})


class SkillGroupSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(child=serializers.CharField(max_length=60), required=False)

    class Meta:
        model = m.SkillGroup
        fields = ["id", "title", "description", "color", "order", "skills"]

    def to_representation(self, obj):
        return {"id": obj.id, "title": obj.title, "description": obj.description, "color": obj.color,
                "order": obj.order, "skills": [s.name for s in obj.skills.all()]}

    def _save_skills(self, group, names):
        group.skills.all().delete()
        m.Skill.objects.bulk_create([m.Skill(group=group, name=n.strip(), order=i) for i, n in enumerate(names) if n.strip()])

    def create(self, data):
        names = data.pop("skills", [])
        group = super().create(data)
        self._save_skills(group, names)
        return group

    def update(self, inst, data):
        names = data.pop("skills", None)
        group = super().update(inst, data)
        if names is not None:
            self._save_skills(group, names)
        return group


def crud(model, serializer=None, read_only=(), create=True):
    ser = serializer or simple(model, read_only)
    methods = ["get", "post", "patch", "put", "delete", "head", "options"] if create else ["get", "patch", "delete", "head", "options"]
    return type(f"{model.__name__}ViewSet", (viewsets.ModelViewSet,), {
        "queryset": model.objects.all(), "serializer_class": ser,
        "permission_classes": [IsAdminUser], "http_method_names": methods})


StatViewSet = crud(m.Stat)
ExperienceViewSet = crud(m.Experience)
ProjectViewSet = crud(m.Project)
EducationViewSet = crud(m.Education)
SkillGroupViewSet = crud(m.SkillGroup, SkillGroupSerializer)
MessageViewSet = crud(m.Message, read_only=("name", "email", "subject", "message", "created"), create=False)


class ProfileView(APIView):
    """There is only one profile: GET it, PATCH it (JSON or multipart for photo/resume)."""
    permission_classes = [IsAdminUser]
    serializer = simple(m.Profile)

    def get(self, request):
        p = m.Profile.objects.first()
        return Response(self.serializer(p, context={"request": request}).data if p else None)

    def patch(self, request):
        p = m.Profile.objects.first()
        ser = self.serializer(p, data=request.data, partial=True, context={"request": request})
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)


TextViewSet = crud(m.Text)

from rest_framework import serializers
from . import models as m


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.Profile
        exclude = ["id"]


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.Stat
        fields = ["value", "label"]


class SkillGroupSerializer(serializers.ModelSerializer):
    skills = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")

    class Meta:
        model = m.SkillGroup
        fields = ["title", "description", "color", "skills"]


class ExperienceSerializer(serializers.ModelSerializer):
    bullets = serializers.SerializerMethodField()

    class Meta:
        model = m.Experience
        fields = ["role", "company", "period", "location", "current", "bullets"]

    def get_bullets(self, obj):
        return [l.strip() for l in obj.bullets.splitlines() if l.strip()]


class ProjectSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = m.Project
        fields = ["title", "summary", "tags", "url", "color"]

    def get_tags(self, obj):
        return [t.strip() for t in obj.tags.split(",") if t.strip()]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.Education
        fields = ["kind", "title", "institution", "years"]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.Message
        fields = ["name", "email", "subject", "message"]

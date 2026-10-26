from django.contrib import admin
from . import models as m


@admin.register(m.Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "role")

    def has_add_permission(self, request):  # only one profile
        return not m.Profile.objects.exists()


class SkillInline(admin.TabularInline):
    model = m.Skill
    extra = 3


@admin.register(m.SkillGroup)
class SkillGroupAdmin(admin.ModelAdmin):
    list_display = ("title", "color", "order")
    inlines = [SkillInline]


for model in (m.Stat, m.Experience, m.Project, m.Education):
    admin.site.register(model, type(f"{model.__name__}Admin", (admin.ModelAdmin,), {"list_display": ("__str__", "order")}))


@admin.register(m.Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created", "is_read")
    list_filter = ("is_read",)
    readonly_fields = ("name", "email", "subject", "message", "created")

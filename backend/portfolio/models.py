from django.db import models

import os
from django.core.files.storage import default_storage


def resume_storage():
    # PDFs need Cloudinary's "raw" storage; fall back to local disk without CLOUDINARY_URL
    if os.environ.get("CLOUDINARY_URL"):
        from cloudinary_storage.storage import RawMediaCloudinaryStorage
        return RawMediaCloudinaryStorage()
    return default_storage

COLORS = [("teal", "Teal"), ("blue", "Blue"), ("red", "Red"), ("purple", "Purple"), ("amber", "Amber"), ("sky", "Sky")]


class Ordered(models.Model):
    order = models.PositiveIntegerField(default=0, help_text="Lower numbers show first")

    class Meta:
        abstract = True
        ordering = ["order", "id"]


class Profile(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120)
    company = models.CharField(max_length=120, blank=True)
    location = models.CharField(max_length=120, blank=True)
    headline = models.CharField(max_length=200, help_text="Use | to split the white part from the teal part")
    headline_ne = models.CharField("Headline (Nepali)", max_length=200, blank=True)
    intro = models.TextField(help_text="Short text under the headline")
    intro_ne = models.TextField("Intro (Nepali)", blank=True)
    about = models.TextField(help_text="Blank line between paragraphs")
    about_ne = models.TextField("About (Nepali)", blank=True)
    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)
    photo = models.ImageField(upload_to="profile", blank=True)
    resume = models.FileField(upload_to="resume", blank=True, storage=resume_storage)
    available = models.BooleanField(default=True, help_text="Shows the 'available for QA roles' badge")

    def __str__(self):
        return self.name


class Stat(Ordered):
    value = models.CharField(max_length=20)
    label = models.CharField(max_length=60)

    def __str__(self):
        return f"{self.value} {self.label}"


class SkillGroup(Ordered):
    title = models.CharField(max_length=80)
    description = models.CharField(max_length=200, blank=True)
    color = models.CharField(max_length=10, choices=COLORS, default="teal")

    def __str__(self):
        return self.title


class Skill(Ordered):
    group = models.ForeignKey(SkillGroup, related_name="skills", on_delete=models.CASCADE)
    name = models.CharField(max_length=60)

    def __str__(self):
        return self.name


class Experience(Ordered):
    role = models.CharField(max_length=120)
    company = models.CharField(max_length=120)
    period = models.CharField(max_length=60, help_text="e.g. May 2026 – Present")
    location = models.CharField(max_length=60, blank=True)
    current = models.BooleanField(default=False)
    bullets = models.TextField(help_text="One responsibility per line")

    def __str__(self):
        return f"{self.role} at {self.company}"


class Project(Ordered):
    title = models.CharField(max_length=120)
    summary = models.TextField()
    tags = models.CharField(max_length=200, blank=True, help_text="Comma separated")
    url = models.URLField(blank=True)
    color = models.CharField(max_length=10, choices=COLORS, default="teal")

    def __str__(self):
        return self.title


class Education(Ordered):
    kind = models.CharField(max_length=10, choices=[("education", "Education"), ("training", "Training")], default="education")
    title = models.CharField(max_length=160)
    institution = models.CharField(max_length=200)
    years = models.CharField(max_length=40, blank=True)

    def __str__(self):
        return self.title


class Message(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return f"{self.name}: {self.subject}"


class Text(models.Model):
    """Overrides for any text on the site. Blank means: use the built-in text."""
    key = models.CharField(max_length=80, unique=True)
    en = models.TextField(blank=True)
    ne = models.TextField(blank=True)

    def __str__(self):
        return self.key

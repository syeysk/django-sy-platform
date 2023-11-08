from rest_framework import serializers

from project.models import ContactProject, Project, ProjectNews


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title']


class ProjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'short_description', 'description', 'seo_keywords', 'seo_description']
        extra_kwargs = {
            'title': {'required': False},
            'short_description': {'required': False},
            'description': {'required': False},
            'seo_keywords': {'required': False},
            'seo_description': {'required': False},
        }


class NewsAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectNews
        fields = ['title', 'text']


class EditContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactProject
        fields = ['sign', 'value', 'contact_type']

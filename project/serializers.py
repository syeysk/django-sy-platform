from rest_framework import serializers

from project.models import Project, ProjectNews


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title']


class ProjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'short_description', 'description']
        extra_kwargs = {
            'title': {'required': False},
            'short_description': {'required': False},
            'description': {'required': False},
        }


class NewsAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectNews
        fields = ['title', 'text']

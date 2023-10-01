from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from project_specificity.models import CompostSpecificity, WebportalSpecificity


class SpecificityEditSerializer(serializers.Serializer):
    specificity = serializers.CharField(max_length=100, allow_blank=True, allow_null=True)

    @staticmethod
    def validate_specificity(value):
        value = None if value == 'null' or not value else value
        if value:
            value = ContentType.objects.filter(app_label='project_specificity', model=value).first()
            if not value:
                raise ValidationError('Неправильное значение')

        return value


class WebportalSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebportalSpecificity
        fields = ['url']


class CompostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompostSpecificity
        fields = ['resources']


def get_serializer(content_type: str):
    return globals()[f'{content_type[:-11].title()}Serializer']

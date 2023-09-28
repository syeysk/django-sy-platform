from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


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

import copy

from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from project_specificity.models import CompostInputResourceDetailsSpecificity, WebportalSpecificity


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


class ResourcesCompostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompostInputResourceDetailsSpecificity
        fields = ['comment']


class CompostSerializer(serializers.BaseSerializer):
    def to_representation(self, instance):
        data = {'resources': {}}
        for resource in instance.resources.values('input_resource__id', 'input_resource__name', 'comment'):
            data['resources'][resource['input_resource__id']] = {
                'comment': resource['comment'],
                'name': resource['input_resource__name'],
            }

        return data

    def to_internal_value(self, data):
        data['resources'] = {int(key): value for key, value in data['resources'].items()}
        return data

    def update(self, instance, validated_data):
        resources = copy.deepcopy(validated_data['resources'])
        resources_to_delete = []
        for resource in instance.resources.all():
            if resource.pk in resources:
                if resource.comment != resources[resource.pk]['comment']:
                    resource.comment = resources[resource.pk]['comment']
                    resource.save()

                del resources[resource.pk]
            else:
                resources_to_delete.append(resource.pk)

        with transaction.atomic():
            instance.resources.filter(pk__in=resources_to_delete).delete()
            for resource_id, data in resources.items():
                data.pop('name')
                instance.resources.create(input_resource_id=resource_id, **data)

        return instance


def get_serializer(content_type: str):
    return globals()[f'{content_type[:-11].title()}Serializer']

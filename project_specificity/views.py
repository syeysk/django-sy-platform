from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from project.models import Project
from project_specificity.serializers import (
    SpecificityEditSerializer,
    get_serializer
)


class SpecificityEditView(APIView):
    def post(self, request, project_pk):
        user = request.user

        if not user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        project = (
            Project.objects
            .select_related('created_by').prefetch_related('created_by')
            .filter(pk=project_pk, created_by=user).first()
        )
        if not project:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SpecificityEditSerializer(data=request.POST)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        content_type = data['specificity']
        updated_fields = []
        if content_type:
            if project.content_type != content_type:
                updated_fields.append('specificity')
                specificity = content_type.get_all_objects_for_this_type(project_permanent=project).first()
                if not specificity:
                    specificity = content_type.model_class()(project_permanent=project)

                project.content_object = specificity

            spec_data = get_serializer(project.content_type.model)(project.content_object).data
            # обновляем данные
            spec_serializer = get_serializer(content_type.model)(project.content_object, data=request.POST)
            spec_serializer.is_valid(raise_exception=True)
            spec_serializer.save()

            updated_fields.extend(
                [name for name, value in spec_serializer.validated_data.items() if spec_data.get(name) != value],
            )
        else:
            if project.content_type != content_type:
                updated_fields.append('specificity')

            project.content_object = None

        if updated_fields and updated_fields[0] == 'specificity':
            project.save()

        return Response(status=status.HTTP_200_OK, data={'updated_fields': updated_fields})

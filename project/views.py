from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render
from django.views import View
from requests.exceptions import ConnectionError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django_sy_framework.utils.universal_api import API
from project.models import Project
from project.serializers import ProjectCreateSerializer, ProjectUpdateSerializer


def get_linked_object(project, api, json_data, verbose_name):
    error_json = {'error': f'ошибка получения {verbose_name} :('}
    try:
        response = api.linker.project.post(f'/{project.pk}/', json=json_data)
    except ConnectionError:
        return error_json

    if response.status_code != 200:
        return error_json

    objects = response.json()
    objects['url_new'] = '{}?link_to=project-{}'.format(objects['url_new'], project.pk)
    return objects


class ProjectListView(View):
    def get(self, request):
        page_number = request.GET.get('p', '1')
        which = request.GET.get('which') or 'my' if request.user.is_authenticated else 'all'
        page_number = int(page_number) if page_number.isdecimal() else 1
        count_on_page = 20

        projects = Project.objects.order_by('-pk')
        if which == 'my':
            projects = projects.filter(created_by=request.user)
        else:
            projects = projects.all()

        paginator = Paginator(projects, count_on_page)
        page = paginator.page(page_number)

        context = {
            'projects': page.object_list,
            'current_page': page_number,
            'last_page': paginator.num_pages,
            'which': which,
        }
        return render(request, 'project/project_list.html', context)


class ProjectEditorView(APIView):
    def get(self, request, pk=None):
        fields = {field.name: field for field in Project._meta.get_fields(include_parents=False)}
        if not pk:
            if not request.user.is_authenticated:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            context = {'project': None, 'fields': fields}
            return render(request, 'project/project_editor.html', context)

        project = get_object_or_404(Project, pk=pk)
        json_data_faci = {'object': 'faci', 'fields': ['id', 'aim'], 'extra_fields': ['url']}
        json_data_note = {'object': 'note', 'fields': ['id', 'title'], 'extra_fields': ['url'], 'order_by': ['title']}
        context = {
            'project': {
                'title': project.title,
                'short_description': project.short_description,
                'description': project.description,
                'created_by': project.created_by.username,
                'facis': get_linked_object(project, API('1', 'faci'), json_data_faci, 'холстов'),
                'notes': get_linked_object(project, API('1', 'note'), json_data_note, 'заметок'),
                'news': [
                    {'text': 'njf nfj nff eijbiobioboi dd', 'datetime': '2022-23-43 54:76', 'pk': 4},
                    {'text': 'nfdgbjf nfiobioboi dd', 'datetime': '2022-23-43 54:76', 'pk': 3},
                    {'text': 'njf  m ovjkff', 'datetime': '2022-23-43 54:76', 'pk': 2},
                    {'text': 'df f njf nffkkfkfkffk dd', 'datetime': '2022-23-43 54:76', 'pk': 1},
                ],
            },
            'fields': fields,
        }
        return render(request, 'project/project_editor.html', context)

    def post(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        response_data = {}
        if pk:
            project = get_object_or_404(Project, pk=pk)
            if request.user.pk != project.created_by.pk:
                return Response(status=status.HTTP_403_FORBIDDEN)

            serializer = ProjectUpdateSerializer(project, data=request.POST)
            serializer.is_valid(raise_exception=True)
            response_data['updated_fields'] = [
                name for name, value in serializer.validated_data.items() if getattr(project, name) != value
            ]
            serializer.save()
        else:
            serializer = ProjectCreateSerializer(data=request.POST)
            serializer.is_valid(raise_exception=True)
            project = serializer.create({**serializer.validated_data, 'created_by': request.user})
            response_data['project_id'] = project.pk

        return Response(status=status.HTTP_200_OK, data=response_data)

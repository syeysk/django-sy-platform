from django.core.paginator import Paginator
from django.http import Http404
from django.shortcuts import get_object_or_404, render
from django.views import View
from requests.exceptions import ConnectionError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django_sy_framework.utils.universal_api import API
from project.models import Project
from project.serializers import NewsAddSerializer, ProjectCreateSerializer, ProjectUpdateSerializer
from project_specificity.models import CompostInputResourceSpecificity, get_specificities
from project_specificity.serializers import get_serializer

NEWS_DATE_FORMAT = '%d.%m.%Y %H:%M'


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


class ProjectView(View):
    def get(self, request, pk=None):
        fields = {field.name: field for field in Project._meta.get_fields(include_parents=False)}
        if not pk:
            if not request.user.is_authenticated:
                return render(request, '401.html')

            context = {'project': None, 'fields': fields}
            return render(request, 'project/project_editor.html', context)

        project = Project.objects.filter(pk=pk).first()
        if not project:
            raise Http404('Проект не найден')

        json_data_faci = {'object': 'faci', 'fields': ['id', 'aim'], 'extra_fields': ['url']}
        json_data_note = {'object': 'note', 'fields': ['id', 'title'], 'extra_fields': ['url'], 'order_by': ['title']}
        news = []
        for new in project.news.order_by('-dt_create').values('pk', 'title', 'text', 'dt_create'):
            new['dt_create'] = new['dt_create'].strftime(NEWS_DATE_FORMAT)
            news.append(new)

        specificity = project.content_type.model if project.content_type else None
        specificity_data = None
        if specificity:
            specificity_serializer = get_serializer(specificity)
            specificity_data = specificity_serializer(project.content_object).data if specificity_serializer else {}

        context = {
            'project': {
                'title': project.title,
                'short_description': project.short_description,
                'description': project.description,
                'created_by': project.created_by.username,
                'facis': get_linked_object(project, API('1', 'faci'), json_data_faci, 'холстов'),
                'notes': get_linked_object(project, API('1', 'note'), json_data_note, 'заметок'),
                'news': news,
                'specificity': specificity,
                'specificity_data': specificity_data,
            },
            'compost_input_resources': tuple(CompostInputResourceSpecificity.objects.values_list('id', 'name')),
            'specificities': get_specificities(),
            'fields': fields,
            'has_access_to_edit': request.user.is_authenticated and request.user == project.created_by,
        }
        return render(request, 'project/project_editor.html', context)


class ProjectEditView(APIView):
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


class NewsAddView(APIView):
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

        serializer = NewsAddSerializer(data=request.POST)
        serializer.is_valid(raise_exception=True)
        project_news = serializer.save(created_by=user, project=project)
        response_data = {'dt_create': project_news.dt_create.strftime(NEWS_DATE_FORMAT), 'id': project_news.pk}
        return Response(status=status.HTTP_200_OK, data=response_data)

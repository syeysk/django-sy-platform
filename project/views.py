from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import get_user_model
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from project.models import Project


class ProjectListView(View):
    def get(self, request):
        page_number = request.GET.get('p', '1')
        which = request.GET.get('which', 'my' if request.user.is_authenticated else 'all')
        page_number = int(page_number) if page_number.isdecimal() else 1
        count_on_page = 20

        if which == 'my':
            projects = Project.objects.filter(created_by=request.user)
        else:
            projects = Project.objects.all()

        paginator = Paginator(projects, count_on_page)
        page = paginator.page(page_number)

        context = {
            'projects': page.object_list,
            'current_page': page_number,
            'last_page': paginator.num_pages,
            'which': which,
        }
        return render(request, 'project/project_list.html', context)


class ProjectEditorView(View):
    def get(self, request, pk=None):
        project = None
        if pk:
            project = get_object_or_404(Project, pk=pk)

        fields = {field.name: field for field in Project._meta.get_fields(include_parents=False)}
        context = {'project': project, 'fields': fields}
        return render(request, 'project/project_editor.html', context)

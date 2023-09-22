from django.contrib import admin
from project.models import ProjectNews, Project


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_by', 'title', 'short_description')


admin.site.register(Project, ProjectAdmin)


class ProjectNewsAdmin(admin.ModelAdmin):
    list_display = ('id', 'dt_create', 'created_by', 'title', 'text')


admin.site.register(ProjectNews, ProjectNewsAdmin)

from django.urls import path

from project.views import (
    ProjectEditorView,
    ProjectListView,
)

urlpatterns = [
    path('<int:pk>', ProjectEditorView.as_view(), name='project_editor'),
    path('new', ProjectEditorView.as_view(), name='project_create'),
    path('', ProjectListView.as_view(), name='project_list'),
]

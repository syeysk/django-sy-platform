from django.urls import path

from project.views import (
    NewsAddView,
    ProjectEditView,
    ProjectListView,
    ProjectView,
)

urlpatterns = [
    path('<int:pk>/edit', ProjectEditView.as_view(), name='project_editor_post'),
    path('new/edit', ProjectEditView.as_view(), name='project_create_post'),
    path('<int:pk>', ProjectView.as_view(), name='project_editor'),
    path('new', ProjectView.as_view(), name='project_create'),
    path('<int:project_pk>/publicate-news', NewsAddView.as_view(), name='project_add_new_post'),
    path('', ProjectListView.as_view(), name='project_list'),
]

from django.conf.urls import url
from django.urls import path

from faci.views import (
    FaciEditorView,
    FaciEditAimView,
    FaciEditMembersView,
    FaciEditAgendaView,
    FaciListView,
    SearchUserView,
)


urlpatterns = [
    url(r'new/aim/$', FaciEditMembersView.as_view(), name='faci_editor_create'),
    url(r'(?P<canvas_id>[0-9]+)/aim/$', FaciEditAimView.as_view(), name='faci_editor_aim'),
    url(r'(?P<canvas_id>[0-9]+)/member/(?P<invited_username>[0-9a-zA-Zа-яА-ЯёЁ_-]+)/$', FaciEditMembersView.as_view(), name='faci_editor_member'),
    url(r'(?P<canvas_id>[0-9]+)/agenda/$', FaciEditAgendaView.as_view(), name='faci_editor_agenda'),

    url(r'(?P<canvas_id>[0-9]+)/$', FaciEditorView.as_view(), name='faci_editor'),
    path('new', FaciEditorView.as_view(), name='faci_new'),

    path('search_user/', SearchUserView.as_view(), name='search_user'),
    path('', FaciListView.as_view(), name='faci_list'),
]

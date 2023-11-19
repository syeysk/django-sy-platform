from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('server.urls_api')),
    path('auth/', include('django_sy_framework.custom_auth.urls')),
    path('token/', include('django_sy_framework.token.urls')),
    path('project/', include('project.urls')),
    path('', include('django_sy_framework.base.urls')),
]

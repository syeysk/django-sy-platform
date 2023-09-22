from django.contrib.auth import get_user_model
from django.db import models

from django_sy_framework.utils.mixins import DatetimeMixin


class Project(models.Model):
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='projects')
    title = models.CharField('Название проекта', max_length=100)
    short_description = models.CharField('Краткое описание проекта', max_length=200, blank=True, default='')
    description = models.CharField('Описание проекта', max_length=10000, blank=True, default='')

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'


class ProjectNews(DatetimeMixin, models.Model):
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='project_news')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='news')
    title = models.CharField('Заголовок проекта', max_length=80, blank=False)
    text = models.CharField('Новость проекта', max_length=2900, blank=False)

    class Meta:
        verbose_name = 'Новость проект'
        verbose_name_plural = 'Новости проекта'

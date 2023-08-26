from django.contrib.auth import get_user_model
from django.db import models


class Project(models.Model):
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='projects')
    title = models.CharField('Название проекта', max_length=100)
    short_description = models.CharField('Краткое описание проекта', max_length=200, blank=True, default='')
    description = models.CharField('Описание проекта', max_length=10000, blank=True, default='')

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'

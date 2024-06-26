from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.contrib.gis.db import models as gis_models

from django_sy_framework.utils.mixins import DatetimeMixin


class Project(models.Model):
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='projects')
    title = models.CharField('Название проекта', max_length=100, unique=True)
    short_description = models.CharField('Краткое описание проекта', max_length=200, blank=True, default='')
    description = models.CharField('Описание проекта', max_length=10000, blank=True, default='')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, help_text='Специфика', null=True)
    object_id = models.PositiveIntegerField('ID специфики', null=True)
    content_object = GenericForeignKey()
    seo_keywords = models.CharField('SEO ключевые слова', max_length=100, blank=True, default='')
    seo_description = models.CharField('SEO-описание', max_length=200, blank=True, default='')

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        indexes = [
            models.Index(fields=('content_type', 'object_id'), name='index_content_type_project'),
        ]


class ProjectNews(DatetimeMixin, models.Model):
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='project_news')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='news')
    title = models.CharField('Заголовок проекта', max_length=80, blank=False)
    text = models.CharField('Новость проекта', max_length=2900, blank=False)

    class Meta:
        verbose_name = 'Новость проект'
        verbose_name_plural = 'Новости проекта'


class GeoPointProject(gis_models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='geo_points')
    point = gis_models.PointField(verbose_name='Позиция на карте')


class ContactProject(models.Model):
    CONTACT_TYPE_OTHER = 1
    CONTACT_TYPE_PHONE = 2
    CONTACT_TYPE_EMAIL = 3
    CONTACT_TYPE_WEBSITE = 4
    CONTACT_TYPE_TELEGRAM = 5
    CONTACT_TYPE_DISCORD = 6
    CONTACT_TYPE_CHOICES = (
        (CONTACT_TYPE_OTHER, 'Другое'),
        (CONTACT_TYPE_PHONE, 'Телефон'),
        (CONTACT_TYPE_EMAIL, 'Электронная почта'),
        (CONTACT_TYPE_WEBSITE, 'Вебсайт',),
        (CONTACT_TYPE_TELEGRAM, 'Телеграм'),
        (CONTACT_TYPE_DISCORD, 'Дискорд'),
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='contacts')
    sign = models.CharField('Наименование контакта', max_length=100, blank=True)
    value = models.CharField('Значение', max_length=100, blank=False)
    contact_type = models.IntegerField('Тип контакта', blank=False, choices=CONTACT_TYPE_CHOICES)

    class Meta:
        verbose_name = 'Контакт проекта'
        verbose_name_plural = 'Контакты проекта'

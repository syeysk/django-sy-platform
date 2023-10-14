from django.contrib.contenttypes.fields import GenericRelation
from django.db import models

from project.models import Project


class BaseSpecificityModel(models.Model):
    """Наследуемые модели специфик не должны иметь обязательных полей."""
    project_permanent = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='+')

    class Meta:
        abstract = True


class WebportalSpecificity(BaseSpecificityModel):
    url = models.URLField('Ссылка на портал', default='', blank=True)
    project = GenericRelation(Project, related_query_name='webportal')

    class Meta:
        verbose_name = 'Разработка веб-портала'
        verbose_name_plural = 'Веб-порталы'


class CompostInputResourceSpecificity(models.Model):
    name = models.CharField('Наименование ресурса', max_length=100)

    class Meta:
        verbose_name = 'Принимаемое сырьё'
        verbose_name_plural = 'Сырьё'


class CompostInputResourceDetailsSpecificity(models.Model):
    compost = models.ForeignKey(
        'project_specificity.CompostSpecificity',
        on_delete=models.CASCADE,
        related_name='resources',
    )
    input_resource = models.ForeignKey(
        CompostInputResourceSpecificity,
        on_delete=models.CASCADE,
        related_name='+',
    )
    comment = models.CharField('Комментарий', max_length=150, default='', blank=True)


class CompostSpecificity(BaseSpecificityModel):
    project = GenericRelation(Project, related_query_name='compost')

    class Meta:
        verbose_name = 'Компостирование'
        verbose_name_plural = 'Компосты'


class ProdcoopSpecificity(BaseSpecificityModel):
    project = GenericRelation(Project, related_query_name='prodcoop')

    class Meta:
        verbose_name = 'Производственный кооператив'
        verbose_name_plural = 'Производственные кооперативы'


class ConsumercoopSpecificity(BaseSpecificityModel):
    project = GenericRelation(Project, related_query_name='consumercoop')

    class Meta:
        verbose_name = 'Потребительский кооператив'
        verbose_name_plural = 'Потребительские кооперативы'


def get_specificities():
    return {
        subclass.__name__.lower(): subclass._meta.verbose_name for subclass in BaseSpecificityModel.__subclasses__()
    }

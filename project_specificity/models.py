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
        verbose_name = 'Программное обеспечение'
        verbose_name_plural = 'Программное обеспечение'


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
        verbose_name = 'Компостный друг | Червеферма'
        verbose_name_plural = 'Компостные друзья | Червефермы'


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


class CoopeaterySpecificity(BaseSpecificityModel):
    project = GenericRelation(Project, related_query_name='coopeatery')

    class Meta:
        verbose_name = 'Кооперативная столовая'
        verbose_name_plural = 'Кооперативные столовые'


class CoopgardenSpecificity(BaseSpecificityModel):
    project = GenericRelation(Project, related_query_name='coopgarden')

    class Meta:
        verbose_name = 'Кооп. теплиц., огород, сад'
        verbose_name_plural = 'Кооп. теплицы., огороды, сады'


class CoworkingSpecificity(BaseSpecificityModel):
    project = GenericRelation(Project, related_query_name='coworking')

    class Meta:
        verbose_name = 'Открытая мастерская'
        verbose_name_plural = 'Открытые мастерские'


class PeoplecampingSpecificity(BaseSpecificityModel):
    project = GenericRelation(Project, related_query_name='peoplecamping')

    class Meta:
        verbose_name = 'Народная база отдыха'
        verbose_name_plural = 'Народные базы отдыха'


class EcocenterSpecificity(BaseSpecificityModel):
    project = GenericRelation(Project, related_query_name='ecocenter')

    class Meta:
        verbose_name = 'Экоцентр | Приём вторсырья'
        verbose_name_plural = 'Экоцентры | Приём вторсырья'


class ColivingSpecificity(BaseSpecificityModel):
    project = GenericRelation(Project, related_query_name='coliving')

    class Meta:
        verbose_name = 'Коливинг'
        verbose_name_plural = 'Коливинги'


def get_specificities():
    return {
        subclass.__name__.lower(): subclass._meta.verbose_name for subclass in BaseSpecificityModel.__subclasses__()
    }

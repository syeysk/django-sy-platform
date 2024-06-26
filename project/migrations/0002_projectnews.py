# Generated by Django 4.2.1 on 2023-09-22 20:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectNews',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dt_create', models.DateTimeField(auto_now_add=True)),
                ('dt_modify', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(max_length=80, verbose_name='Заголовок проекта')),
                ('text', models.CharField(max_length=2900, verbose_name='Новость проекта')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_news', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='news', to='project.project')),
            ],
            options={
                'verbose_name': 'Новость проект',
                'verbose_name_plural': 'Новости проекта',
            },
        ),
    ]

# Generated by Django 4.2.1 on 2023-10-15 00:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0003_project_content_type_project_object_id_and_more'),
        ('project_specificity', '0004_alter_compostinputresourcedetailsspecificity_compost'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProdcoopSpecificity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project_permanent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='project.project')),
            ],
            options={
                'verbose_name': 'Производственный кооператив',
                'verbose_name_plural': 'Производственные кооперативы',
            },
        ),
        migrations.CreateModel(
            name='ConsumercoopSpecificity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project_permanent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='project.project')),
            ],
            options={
                'verbose_name': 'Потребительский кооператив',
                'verbose_name_plural': 'Потребительские кооперативы',
            },
        ),
    ]
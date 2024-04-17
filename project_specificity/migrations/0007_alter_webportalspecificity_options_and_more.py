# Generated by Django 4.2.1 on 2024-01-06 02:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0007_alter_contactproject_contact_type'),
        ('project_specificity', '0006_alter_compostspecificity_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='webportalspecificity',
            options={'verbose_name': 'Программное обеспечение', 'verbose_name_plural': 'Программное обеспечение'},
        ),
        migrations.CreateModel(
            name='CityfarmerSpecificity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project_permanent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='project.project')),
            ],
            options={
                'verbose_name': 'Сити-ферма',
                'verbose_name_plural': 'Сити-ферма',
            },
        ),
    ]
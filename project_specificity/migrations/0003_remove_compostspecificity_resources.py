# Generated by Django 4.2.1 on 2023-10-03 10:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project_specificity', '0002_alter_compostinputresourcedetailsspecificity_compost_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='compostspecificity',
            name='resources',
        ),
    ]
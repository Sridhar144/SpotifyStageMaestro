# Generated by Django 4.2.3 on 2023-09-17 08:46

from django.db import migrations, models
import myapi.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default=myapi.models.generate_code, max_length=8, unique=True)),
                ('host', models.CharField(max_length=50, unique=True)),
                ('pause', models.BooleanField(default=False)),
                ('votes', models.IntegerField(default=1)),
                ('creation', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]

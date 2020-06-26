# Generated by Django 3.0.7 on 2020-06-24 15:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20200624_2252'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='analysis',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.StockAnalysis'),
        ),
        migrations.CreateModel(
            name='Bookmark',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('analysis', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.StockAnalysis')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, to_field='email')),
            ],
        ),
    ]

# Generated by Django 3.0.7 on 2020-06-26 02:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200624_2358'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookmark',
            name='analysis',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.StockAnalysis', unique=True),
        ),
    ]

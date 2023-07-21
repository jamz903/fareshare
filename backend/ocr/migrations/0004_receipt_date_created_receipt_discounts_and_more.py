# Generated by Django 4.2.1 on 2023-07-21 18:36

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('ocr', '0003_rename_assigned_users_receiptitem_assignees'),
    ]

    operations = [
        migrations.AddField(
            model_name='receipt',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='receipt',
            name='discounts',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='receipt',
            name='service_charge',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='receipt',
            name='tax',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
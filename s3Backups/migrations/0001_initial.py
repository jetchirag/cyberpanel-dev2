# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-01-23 18:47
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('loginSystem', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BackupLogs',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timeStamp', models.CharField(max_length=200)),
                ('level', models.CharField(max_length=5)),
                ('msg', models.CharField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='BackupLogsDO',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timeStamp', models.CharField(max_length=200)),
                ('level', models.CharField(max_length=5)),
                ('msg', models.CharField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='BackupLogsMINIO',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timeStamp', models.CharField(max_length=200)),
                ('level', models.CharField(max_length=5)),
                ('msg', models.CharField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='BackupPlan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('bucket', models.CharField(default='NONE', max_length=50)),
                ('freq', models.CharField(max_length=50)),
                ('retention', models.IntegerField()),
                ('type', models.CharField(default='AWS', max_length=5)),
                ('lastRun', models.CharField(default='0:0:0', max_length=50)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='loginSystem.Administrator')),
            ],
        ),
        migrations.CreateModel(
            name='BackupPlanDO',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('bucket', models.CharField(default='NONE', max_length=50)),
                ('freq', models.CharField(max_length=50)),
                ('retention', models.IntegerField()),
                ('type', models.CharField(default='DO', max_length=5)),
                ('region', models.CharField(max_length=5)),
                ('lastRun', models.CharField(default='0:0:0', max_length=50)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='loginSystem.Administrator')),
            ],
        ),
        migrations.CreateModel(
            name='BackupPlanMINIO',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('freq', models.CharField(max_length=50)),
                ('retention', models.IntegerField()),
                ('lastRun', models.CharField(default='0:0:0', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='MINIONodes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('endPointURL', models.CharField(max_length=200, unique=True)),
                ('accessKey', models.CharField(max_length=200, unique=True)),
                ('secretKey', models.CharField(max_length=200)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='loginSystem.Administrator')),
            ],
        ),
        migrations.CreateModel(
            name='WebsitesInPlan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('domain', models.CharField(max_length=100)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='s3Backups.BackupPlan')),
            ],
        ),
        migrations.CreateModel(
            name='WebsitesInPlanDO',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('domain', models.CharField(max_length=100)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='s3Backups.BackupPlanDO')),
            ],
        ),
        migrations.CreateModel(
            name='WebsitesInPlanMINIO',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('domain', models.CharField(max_length=100)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='s3Backups.BackupPlanMINIO')),
            ],
        ),
        migrations.AddField(
            model_name='backupplanminio',
            name='minioNode',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='s3Backups.MINIONodes'),
        ),
        migrations.AddField(
            model_name='backupplanminio',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='loginSystem.Administrator'),
        ),
        migrations.AddField(
            model_name='backuplogsminio',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='s3Backups.BackupPlanMINIO'),
        ),
        migrations.AddField(
            model_name='backuplogsdo',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='s3Backups.BackupPlanDO'),
        ),
        migrations.AddField(
            model_name='backuplogs',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='s3Backups.BackupPlan'),
        ),
    ]

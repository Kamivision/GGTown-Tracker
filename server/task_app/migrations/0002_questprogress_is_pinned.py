from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='questprogress',
            name='is_pinned',
            field=models.BooleanField(default=False),
        ),
    ]

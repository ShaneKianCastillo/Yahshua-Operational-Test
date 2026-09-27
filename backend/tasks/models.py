from django.db import models


class Task(models.Model):
    # `id` (AutoField) is created automatically by Django as the primary key.
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  # newest tasks first

    def __str__(self):
        return self.title

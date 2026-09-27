from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'created_at']
        # `completed` is read-only here: it can only be changed through
        # PATCH /tasks/{id}/, which toggles it (see TaskViewSet.partial_update).
        read_only_fields = ['id', 'completed', 'created_at']

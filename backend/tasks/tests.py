from rest_framework import status
from rest_framework.test import APITestCase

from .models import Task


class TaskAPITests(APITestCase):
    def setUp(self):
        self.task = Task.objects.create(title='Write README', description='Setup steps')

    def url(self, pk=None):
        return '/tasks/' if pk is None else f'/tasks/{pk}/'

    def test_list_tasks(self):
        response = self.client.get(self.url())
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Write README')

    def test_create_task(self):
        response = self.client.post(self.url(), {'title': 'New task'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New task')
        self.assertEqual(response.data['description'], '')
        self.assertFalse(response.data['completed'])
        self.assertEqual(Task.objects.count(), 2)

    def test_create_task_requires_title(self):
        response = self.client.post(self.url(), {'title': '   '}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_retrieve_task(self):
        response = self.client.get(self.url(self.task.pk))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.task.pk)

    def test_retrieve_missing_task_returns_404(self):
        response = self.client.get(self.url(9999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_task_changes_title_and_description_only(self):
        response = self.client.put(
            self.url(self.task.pk),
            {'title': 'Updated', 'description': 'Changed', 'completed': True},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, 'Updated')
        self.assertEqual(self.task.description, 'Changed')
        self.assertFalse(self.task.completed)  # PUT must not change completed

    def test_patch_toggles_completed(self):
        response = self.client.patch(self.url(self.task.pk))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['completed'])

        response = self.client.patch(self.url(self.task.pk))
        self.assertFalse(response.data['completed'])

    def test_patch_ignores_other_fields(self):
        self.client.patch(self.url(self.task.pk), {'title': 'Hacked'}, format='json')
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, 'Write README')
        self.assertTrue(self.task.completed)

    def test_delete_task(self):
        response = self.client.delete(self.url(self.task.pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(pk=self.task.pk).exists())
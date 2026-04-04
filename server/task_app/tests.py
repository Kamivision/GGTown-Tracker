from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from task_app.models import QuestProgress, TowniePin
from townie_app.models import Townie
from user_app.models import AppUser


class QuestProgressApiTests(APITestCase):
	def setUp(self):
		self.user = AppUser.objects.create_user(
			username='player@example.com',
			email='player@example.com',
			password='testpass123',
		)
		self.other_user = AppUser.objects.create_user(
			username='other@example.com',
			email='other@example.com',
			password='testpass123',
		)
		self.token = Token.objects.create(user=self.user)
		self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
		self.townie = Townie.objects.create(
			name='Addie',
			quest_type='Pay',
			quest='Coins',
			quest_amount='100',
			original_quest='Coins',
		)

	def test_create_progress_is_scoped_to_authenticated_user(self):
		response = self.client.post('/api/v1/tasks/', {'townie_id': self.townie.id, 'current_amount': 50}, format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['current_amount'], 50)
		self.assertEqual(response.data['target_amount'], 100)
		self.assertTrue(
			QuestProgress.objects.filter(user=self.user, townie=self.townie, current_amount=50).exists()
		)
		self.assertFalse(QuestProgress.objects.filter(user=self.other_user, townie=self.townie).exists())

	def test_increment_clamps_at_target_and_marks_complete(self):
		quest_progress = QuestProgress.objects.create(user=self.user, townie=self.townie, current_amount=90)

		response = self.client.post(
			f'/api/v1/tasks/{quest_progress.id}/increment/',
			{'amount': 25},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		quest_progress.refresh_from_db()
		self.assertEqual(quest_progress.current_amount, 100)
		self.assertIsNotNone(quest_progress.completed_at)
		self.assertTrue(response.data['is_complete'])

	def test_users_only_see_their_own_progress(self):
		QuestProgress.objects.create(user=self.user, townie=self.townie, current_amount=40)
		QuestProgress.objects.create(user=self.other_user, townie=self.townie, current_amount=70)

		response = self.client.get('/api/v1/tasks/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]['current_amount'], 40)

	def test_user_can_pin_and_unpin_own_progress(self):
		quest_progress = QuestProgress.objects.create(user=self.user, townie=self.townie, current_amount=10)

		pin_response = self.client.patch(
			f'/api/v1/tasks/{quest_progress.id}/',
			{'is_pinned': True},
			format='json',
		)

		self.assertEqual(pin_response.status_code, status.HTTP_200_OK)
		self.assertTrue(pin_response.data['is_pinned'])

		quest_progress.refresh_from_db()
		self.assertTrue(quest_progress.is_pinned)

		unpin_response = self.client.patch(
			f'/api/v1/tasks/{quest_progress.id}/',
			{'is_pinned': False},
			format='json',
		)

		self.assertEqual(unpin_response.status_code, status.HTTP_200_OK)
		self.assertFalse(unpin_response.data['is_pinned'])

	def test_user_can_pin_townie_without_tracking_it(self):
		response = self.client.post('/api/v1/tasks/pins/', {'townie_id': self.townie.id}, format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['townie_id'], self.townie.id)
		self.assertTrue(TowniePin.objects.filter(user=self.user, townie=self.townie).exists())
		self.assertFalse(QuestProgress.objects.filter(user=self.user, townie=self.townie).exists())

	def test_users_only_see_their_own_pinned_townies(self):
		TowniePin.objects.create(user=self.user, townie=self.townie)
		TowniePin.objects.create(user=self.other_user, townie=self.townie)

		response = self.client.get('/api/v1/tasks/pins/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]['townie_id'], self.townie.id)

	def test_user_can_unpin_saved_townie(self):
		townie_pin = TowniePin.objects.create(user=self.user, townie=self.townie)

		response = self.client.delete(f'/api/v1/tasks/pins/{townie_pin.id}/')

		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertFalse(TowniePin.objects.filter(id=townie_pin.id).exists())

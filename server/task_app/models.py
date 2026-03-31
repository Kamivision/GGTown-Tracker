from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class QuestProgress(models.Model):
    user = models.ForeignKey(
        'user_app.AppUser',
        on_delete=models.CASCADE,
        related_name='quest_progress',
    )
    townie = models.ForeignKey(
        'townie_app.Townie',
        on_delete=models.CASCADE,
        related_name='user_progress',
    )
    current_amount = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'townie'],
                name='unique_user_townie_progress',
            )
        ]
        ordering = ['townie__name']

    def __str__(self):
        return f'{self.user.email} - {self.townie.name}'

    @property
    def target_amount(self):
        try:
            return max(int(self.townie.quest_amount), 0)
        except (TypeError, ValueError):
            return 0

    @property
    def remaining_amount(self):
        return max(self.target_amount - self.current_amount, 0)

    @property
    def is_complete(self):
        return self.completed_at is not None

    def clean(self):
        if self.target_amount < 1:
            raise ValidationError(
                {'townie': 'Townie quest_amount must be a positive integer before progress can be tracked.'}
            )

    def save(self, *args, **kwargs):
        if self.target_amount and self.current_amount > self.target_amount:
            self.current_amount = self.target_amount

        self.full_clean()

        if self.target_amount and self.current_amount >= self.target_amount:
            if self.completed_at is None:
                self.completed_at = timezone.now()
        else:
            self.completed_at = None

        super().save(*args, **kwargs)

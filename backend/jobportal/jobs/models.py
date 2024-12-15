from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    email = models.EmailField(unique=True)
    institution = models.CharField(max_length=200)
    address = models.TextField()
    about = models.TextField()
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.email


class JobApplication(models.Model):
    user = models.EmailField()  # Store email directly
    job_ids = models.TextField()  # Comma-separated job IDs
    applied_at = models.DateTimeField(auto_now_add=True)  # Track application time

    def __str__(self):
        return f"{self.user} applied to jobs {self.job_ids}"
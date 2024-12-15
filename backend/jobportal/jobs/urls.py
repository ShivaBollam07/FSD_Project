from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('apply/', views.apply_job, name='apply'),
    path('applied-jobs/', views.get_applied_jobs, name='applied_jobs'),
    path('profile/', views.get_profile, name='profile'),
    path('job-application-status/', views.check_job_application_status, name='job_application_status'),
    path('unapply/', views.unapply_job, name='unapply_job'),
    path('delete-account/', views.delete_account, name='delete_account'),
]

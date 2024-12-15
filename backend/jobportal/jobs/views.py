from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, JobApplication
import json
import smtplib
from email.message import EmailMessage

@csrf_exempt
def signup(request):
    print("signup attempt")
    if request.method == 'POST':
        data = json.loads(request.body)
        if User.objects.filter(email=data['email']).exists():
            return JsonResponse({'status': 'error', 'message': 'Email already exists'})
        
        User.objects.create(
            name=data['name'],
            age=data['age'],
            email=data['email'],
            institution=data['institution'],
            address=data['address'],
            about=data['about'],
            password=data['password']
        )
        return JsonResponse({'status': 'success'})

@csrf_exempt
def login(request):
    print("login attempt")
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            user = User.objects.get(email=data['email'])
            if user.password == data['password']:
                return JsonResponse({
                    'status': 'success',
                    'user': {
                        'email': user.email,
                        'name': user.name
                    }
                })
            return JsonResponse({'status': 'error', 'message': 'Invalid password'})
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found'})

@csrf_exempt
def apply_job(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            job_id = str(data.get('job_id'))

            if not email or not job_id:
                return JsonResponse({'status': 'error', 'message': 'Invalid input. Email and Job ID are required.'}, status=400)

            # Handle job application logic
            application, created = JobApplication.objects.get_or_create(user=email)
            if application.job_ids:
                job_ids = set(application.job_ids.split(','))
                if job_id in job_ids:
                    return JsonResponse({'status': 'error', 'message': 'You have already applied for this job.'}, status=400)
            else:
                job_ids = set()
            job_ids.add(job_id)
            application.job_ids = ','.join(job_ids)
            application.save()

            # Send email notification
            send_application_email(job_id)

            return JsonResponse({'status': 'success', 'message': 'Job applied successfully.'})
        except Exception as e:
            print(f"Error during job application: {e}")
            return JsonResponse({'status': 'error', 'message': 'An unexpected error occurred. Please try again.'}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

def send_application_email(job_id):
    try:
        sender_email = 'shivabollam07@gmail.com'
        sender_password = 'rcqb diqy dxfb hbpo'
        recipient_email = 'bollamshivatilak@gmail.com'

        # Create the email message
        msg = EmailMessage()
        msg['Subject'] = f'Job Application Submitted: Job ID {job_id}'
        msg['From'] = sender_email
        msg['To'] = recipient_email

        msg.set_content(f'You have successfully applied for Job ID {job_id}', subtype='plain')
        msg.add_alternative(f"""
            <html>
                <body>
                    <h1>Job Application Notification</h1>
                    <p>The following job application has been submitted:</p>
                    <ul>
                        <li><strong>Job ID:</strong> {job_id}</li>
                    </ul>
                    <p>Thank you for using our service!</p>
                </body>
            </html>
        """, subtype='html')

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        print(f"Email sent successfully to {recipient_email} for Job ID {job_id}.")
    except Exception as e:
        print(f"Error sending email: {e}")

@csrf_exempt
def get_applied_jobs(request):
    email = request.GET.get('email')
    try:
        application = JobApplication.objects.get(user=email)
        job_ids = application.job_ids.split(',') if application.job_ids else []
        return JsonResponse({'status': 'success', 'job_ids': job_ids})
    except JobApplication.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'No applications found for this user'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

def get_profile(request):
    print('hey')
    email = request.GET.get('email')
    user = User.objects.get(email=email)
    print(user, "user")
    return JsonResponse({
        'name': user.name,
        'age': user.age,
        'email': user.email,
        'institution': user.institution,
        'address': user.address,
        'about': user.about,
        'password': user.password
    })

@csrf_exempt
def check_job_application_status(request):
    """
    Check if a user has applied for a specific job
    """
    if request.method == 'GET':
        email = request.GET.get('email')
        job_id = request.GET.get('job_id')
        
        if not email or not job_id:
            return JsonResponse({'status': 'error', 'message': 'Email and Job ID are required'}, status=400)
        
        try:
            application = JobApplication.objects.get(user=email)
            job_ids = application.job_ids.split(',') if application.job_ids else []
            
            return JsonResponse({
                'status': 'success', 
                'applied': str(job_id) in job_ids
            })
        except JobApplication.DoesNotExist:
            return JsonResponse({'status': 'success', 'applied': False})

@csrf_exempt
def delete_account(request):
    """
    Allow a user to delete their account
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return JsonResponse({'status': 'error', 'message': 'Email and password are required.'}, status=400)
            
            try:
                # Verify user credentials before deletion
                user = User.objects.get(email=email)
                
                # Check password (in a real-world scenario, use Django's password hashing)
                if user.password != password:
                    return JsonResponse({'status': 'error', 'message': 'Invalid credentials.'}, status=401)
                
                # Delete associated job applications
                JobApplication.objects.filter(user=email).delete()
                
                # Delete user
                user.delete()
                
                return JsonResponse({'status': 'success', 'message': 'Account deleted successfully.'})
            
            except User.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=404)
        
        except Exception as e:
            print(f"Error during account deletion: {e}")
            return JsonResponse({'status': 'error', 'message': 'An unexpected error occurred. Please try again.'}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)
    
@csrf_exempt
def unapply_job(request):
    """
    Allow a user to unapply from a job
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            job_id = str(data.get('job_id'))
            
            if not email or not job_id:
                return JsonResponse({'status': 'error', 'message': 'Invalid input. Email and Job ID are required.'}, status=400)
            
            application = JobApplication.objects.get(user=email)
            
            if application.job_ids:
                job_ids = set(application.job_ids.split(','))
                
                if job_id in job_ids:
                    job_ids.remove(job_id)
                    application.job_ids = ','.join(job_ids)
                    application.save()
                    
                    return JsonResponse({'status': 'success', 'message': 'Job unapplied successfully.'})
                else:
                    return JsonResponse({'status': 'error', 'message': 'You have not applied for this job.'}, status=400)
            else:
                return JsonResponse({'status': 'error', 'message': 'You have no applied jobs.'}, status=400)
        
        except JobApplication.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'No job applications found for this user.'}, status=404)
        except Exception as e:
            print(f"Error during job unapplication: {e}")
            return JsonResponse({'status': 'error', 'message': 'An unexpected error occurred. Please try again.'}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)
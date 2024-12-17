from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, JobApplication
import json
import smtplib
from email.message import EmailMessage

JOBS = [
    {
        "id": 1,
        "title": "Software Engineer",
        "company": "Tech Corp",
        "location": "San Francisco, CA",
        "description": "Develop and maintain software applications.",
        "skills": ["JavaScript", "React", "Node.js"],
        "jobType": "Full-Time",
        "experienceRequired": "2+ years",
    },
    {
        "id": 2,
        "title": "Data Analyst",
        "company": "Data Solutions",
        "location": "New York, NY",
        "description": "Analyze data trends and generate insights.",
        "skills": ["SQL", "Python", "Tableau"],
        "jobType": "Part-Time",
        "experienceRequired": "1+ years",
    },
    {
        "id": 3,
        "title": "Project Manager",
        "company": "Innovate Ltd",
        "location": "Seattle, WA",
        "description": "Lead and manage project teams effectively.",
        "skills": ["Leadership", "Agile", "Scrum"],
        "jobType": "Contract",
        "experienceRequired": "5+ years",
    },
    {
        "id": 4,
        "title": "UX Designer",
        "company": "Creative Minds",
        "location": "Austin, TX",
        "description": "Design user-friendly interfaces and experiences.",
        "skills": ["Figma", "Sketch", "Wireframing"],
        "jobType": "Full-Time",
        "experienceRequired": "3+ years",
    },
    {
        "id": 5,
        "title": "Backend Developer",
        "company": "CodeCraft",
        "location": "Chicago, IL",
        "description": "Build and maintain server-side applications.",
        "skills": ["Java", "Spring Boot", "SQL"],
        "jobType": "Full-Time",
        "experienceRequired": "2+ years",
    },
    {
        "id": 6,
        "title": "Cloud Engineer",
        "company": "Skyline Systems",
        "location": "Denver, CO",
        "description": "Implement and manage cloud infrastructure.",
        "skills": ["AWS", "Azure", "Terraform"],
        "jobType": "Full-Time",
        "experienceRequired": "4+ years",
    },
    {
        "id": 7,
        "title": "Front-End Developer",
        "company": "Bright Web",
        "location": "Los Angeles, CA",
        "description": "Develop responsive web interfaces.",
        "skills": ["HTML", "CSS", "JavaScript"],
        "jobType": "Full-Time",
        "experienceRequired": "2+ years",
    },
    {
        "id": 8,
        "title": "DevOps Engineer",
        "company": "Streamline Solutions",
        "location": "Boston, MA",
        "description": "Automate deployment pipelines and manage CI/CD.",
        "skills": ["Jenkins", "Docker", "Kubernetes"],
        "jobType": "Full-Time",
        "experienceRequired": "3+ years",
    },
    {
        "id": 9,
        "title": "QA Engineer",
        "company": "TestLab Inc.",
        "location": "Phoenix, AZ",
        "description": "Ensure product quality through rigorous testing.",
        "skills": ["Selenium", "JUnit", "Bug Tracking"],
        "jobType": "Part-Time",
        "experienceRequired": "1+ years",
    },
    {
        "id": 10,
        "title": "AI Specialist",
        "company": "FutureTech",
        "location": "Palo Alto, CA",
        "description": "Develop and deploy AI-based solutions.",
        "skills": ["TensorFlow", "PyTorch", "NLP"],
        "jobType": "Contract",
        "experienceRequired": "5+ years",
    },
    {
        "id": 11,
        "title": "Cybersecurity Analyst",
        "company": "SecureOps",
        "location": "Atlanta, GA",
        "description": "Monitor and protect systems against threats.",
        "skills": ["Firewalls", "Penetration Testing", "SIEM"],
        "jobType": "Full-Time",
        "experienceRequired": "3+ years",
    },
    {
        "id": 12,
        "title": "Mobile App Developer",
        "company": "Appify",
        "location": "San Diego, CA",
        "description": "Design and develop mobile applications.",
        "skills": ["Kotlin", "Swift", "React Native"],
        "jobType": "Full-Time",
        "experienceRequired": "2+ years",
    },
    {
        "id": 13,
        'title': "Database Administrator",
        "company": "DataGuard",
        "location": "Dallas, TX",
        "description": "Manage and optimize database systems.",
        "skills": ["SQL", "Oracle", "MongoDB"],
        'jobType': "Full-Time",
        'experienceRequired': "4+ years",
    },
    {
        "id": 14,
        "title": "Machine Learning Engineer",
        "company": "InnovAI",
        "location": "Miami, FL",
        'description': "Build ML models to solve business problems.",
        "skills": ["Python", "Pandas", "Scikit-learn"],
        "jobType": "Contract",
        "experienceRequired": "3+ years",
    },
    {
        "id": 15,
        "title": "Network Engineer",
        "company": "NetSolutions",
        "location": "Houston, TX",
        "description": "Design and maintain network infrastructure.",
        "skills": ["Routing", "Switching", "Firewalls"],
        "jobType": "Full-Time",
        "experienceRequired": "3+ years",
    },
];

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
            print(data)
            email = data.get('email')
            job_id = str(data.get('job_id'))
            resume_link = data.get('resume_link', '')

            if not email or not job_id:
                return JsonResponse({'status': 'error', 'message': 'Invalid input. Email and Job ID are required.'}, status=400)

            # Validate resume link (basic validation)
            if not resume_link or not resume_link.startswith(('http://', 'https://')):
                return JsonResponse({'status': 'error', 'message': 'Invalid resume link.'}, status=400)

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

            # Find the job details
            job = next((j for j in JOBS if str(j['id']) == job_id), None)
            
            if not job:
                return JsonResponse({'status': 'error', 'message': 'Job not found.'}, status=404)

            # Send email notification with job and resume details
            send_application_email(job_id, email, resume_link, job)

            return JsonResponse({'status': 'success', 'message': 'Job applied successfully.'})
        except Exception as e:
            print(f"Error during job application: {e}")
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

                    # Find the job details
                    job = next((j for j in JOBS if str(j['id']) == job_id), None)
                    if not job:
                        return JsonResponse({'status': 'error', 'message': 'Job not found.'}, status=404)

                    # Send email notification for withdrawing application
                    send_unapply_email(job_id, email, job)

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


def send_unapply_email(job_id, applicant_email, job_details):
    """
    Send an email when a user withdraws their job application.
    """
    try:
        sender_email = 'shivabollam07@gmail.com'
        sender_password = 'rcqb diqy dxfb hbpo'
        recipient_email =  applicant_email

        # Create the email message
        msg = EmailMessage()
        msg['Subject'] = f'Job Application Withdrawn: {job_details["title"]} (Job ID {job_id})'
        msg['From'] = sender_email
        msg['To'] = recipient_email

        # Prepare job details for email
        job_info = f"""
        Job Details:
        - Title: {job_details['title']}
        - Company: {job_details['company']}
        - Location: {job_details['location']}
        - Job Type: {job_details['jobType']}
        - Experience Required: {job_details['experienceRequired']}
        - Skills: {', '.join(job_details['skills'])}

        Applicant Details:
        - Email: {applicant_email}
        """

        msg.set_content(job_info, subtype='plain')
        msg.add_alternative(f"""
            <html>
                <body>
                    <h1>Job Application Withdrawn</h1>
                    <h2>Job Details</h2>
                    <ul>
                        <li><strong>Title:</strong> {job_details['title']}</li>
                        <li><strong>Company:</strong> {job_details['company']}</li>
                        <li><strong>Location:</strong> {job_details['location']}</li>
                        <li><strong>Job Type:</strong> {job_details['jobType']}</li>
                        <li><strong>Experience Required:</strong> {job_details['experienceRequired']}</li>
                        <li><strong>Skills:</strong> {', '.join(job_details['skills'])}</li>
                    </ul>
                    <h2>Applicant Details</h2>
                    <ul>
                        <li><strong>Email:</strong> {applicant_email}</li>
                    </ul>
                    <p><strong>Note:</strong> The user has withdrawn their application for Job ID: {job_id}.</p>
                </body>
            </html>
        """, subtype='html')

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        print(f"Unapply email sent successfully to {recipient_email} for Job ID {job_id}.")
    except Exception as e:
        print(f"Error sending unapply email: {e}")


def send_application_email(job_id, applicant_email, resume_link, job_details):
    try:
        sender_email = 'shivabollam07@gmail.com'
        sender_password = 'rcqb diqy dxfb hbpo'
        recipient_email = applicant_email
        # Create the email message
        msg = EmailMessage()
        msg['Subject'] = f'New Job Application: {job_details["title"]} (Job ID {job_id})'
        msg['From'] = sender_email
        msg['To'] = recipient_email

        # Prepare job details for email
        job_info = f"""
        Job Details:
        - Title: {job_details['title']}
        - Company: {job_details['company']}
        - Location: {job_details['location']}
        - Job Type: {job_details['jobType']}
        - Experience Required: {job_details['experienceRequired']}
        - Skills: {', '.join(job_details['skills'])}

        Applicant Details:
        - Email: {applicant_email}
        - Resume Link: {resume_link}
        """

        msg.set_content(job_info, subtype='plain')
        msg.add_alternative(f"""
            <html>
                <body>
                    <h1>New Job Application Submitted</h1>
                    <h2>Job Details</h2>
                    <ul>
                        <li><strong>Title:</strong> {job_details['title']}</li>
                        <li><strong>Company:</strong> {job_details['company']}</li>
                        <li><strong>Location:</strong> {job_details['location']}</li>
                        <li><strong>Job Type:</strong> {job_details['jobType']}</li>
                        <li><strong>Experience Required:</strong> {job_details['experienceRequired']}</li>
                        <li><strong>Skills:</strong> {', '.join(job_details['skills'])}</li>
                    </ul>
                    <h2>Applicant Details</h2>
                    <ul>
                        <li><strong>Email:</strong> {applicant_email}</li>
                        <li><strong>Resume Link:</strong> <a href="{resume_link}">{resume_link}</a></li>
                    </ul>
                    <p>Job ID: {job_id}</p>
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
    

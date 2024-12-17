const API_URL = 'http://localhost:8000/api';

function navigate(page) {
    const app = document.querySelector('#app');
    switch (page) {
        case 'signup':
            app.innerHTML = signupTemplate();
            const signupForm = document.getElementById('signupForm');
            if (signupForm) {
                signupForm.addEventListener('submit', handleSignup);
            }
            break;
        case 'login':
            app.innerHTML = loginTemplate();
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
            break;
        case 'main':
            if (!localStorage.getItem('userEmail')) {
                navigate('login');
                return;
            }
            app.innerHTML = mainTemplate();
            loadJobs();
            break;
        case 'applied':
            if (!localStorage.getItem('userEmail')) {
                navigate('login');
                return;
            }
            app.innerHTML = appliedTemplate();
            loadAppliedJobs();
            break;
        case 'profile':
            if (!localStorage.getItem('userEmail')) {
                navigate('login');
                return;
            }
            app.innerHTML = profileTemplate();
            loadProfile();
            break;
    }
}

function signupTemplate() {
    return `
        <style>
            .signup-container {
                max-width: 850px;
                margin: 3rem auto;
                background-color: #f9f9f9;
                border-radius: 8px;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                padding: 2rem;
                font-family: Arial, sans-serif;
            }
            .signup-container h2 {
                text-align: center;
                color: #0a66c2;
                font-size: 1.8rem;
                margin-bottom: 1.5rem;
                font-weight: bold;
            }
            .form-group {
                margin-bottom: 1.2rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #4a4a4a;
                font-size: 0.95rem;
            }
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 0.8rem;
                border: 1px solid #d1d1d1;
                border-radius: 6px;
                font-size: 0.95rem;
                transition: all 0.3s ease;
            }
            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #0a66c2;
                box-shadow: 0 0 4px rgba(10, 102, 194, 0.3);
            }
            button {
                width: 100%;
                padding: 0.9rem;
                background-color: #0a66c2;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            button:hover {
                background-color: #004182;
            }
            .logo {
                display: block;
                margin: 0 auto 1rem auto;
                width: 50px;
                height: auto;
            }
            .form-wrapper {
                display: flex;
                flex-wrap: wrap;
                gap: 2rem;
            }
            .form-column {
                flex: 1;
                min-width: 300px;
            }
            .login-link {
                text-align: center;
                margin-top: 1rem;
                color: #4a4a4a;
                font-size: 0.95rem;
            }
            .login-link a {
                color: #0a66c2;
                text-decoration: none;
                font-weight: bold;
            }
        </style>
        <div class="signup-container">
            <img class="logo" src="https://pngimg.com/uploads/letter_j/letter_j_PNG29.png" alt="Logo">
            <h2>Create Your Account</h2>
            <form id="signupForm">
                <div class="form-wrapper">
                    <div class="form-column">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" placeholder="Enter your name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label for="institution">Institution</label>
                            <input type="text" id="institution" placeholder="Enter your institution" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" placeholder="Enter a password" required>
                        </div>
                    </div>
                    <div class="form-column">
                        <div class="form-group">
                            <label for="age">Age</label>
                            <input type="number" id="age" placeholder="Enter your age" required>
                        </div>
                        <div class="form-group">
                            <label for="address">Address</label>
                            <input id="address" placeholder="Enter your address" required></input>
                        </div>
                        <div class="form-group">
                            <label for="about">About Myself</label>
                            <input id="about" placeholder="Write something about yourself" required></input>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" placeholder="Confirm your password" required>
                        </div>
                    </div>
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <p class="login-link">Already have an account? <a href="#" id="loginLink">Login</a></p>
        </div>
    `;
}

function loginTemplate() {
    return `
        <style>
            .login-container {
                max-width: 400px;
                margin: 3rem auto;
                background-color: #f9f9f9;
                border-radius: 8px;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
                padding: 2rem;
                font-family: Arial, sans-serif;
            }
            .login-container h2 {
                text-align: center;
                color: #0a66c2;
                font-size: 1.8rem;
                margin-bottom: 1.5rem;
                font-weight: bold;
            }
            .form-group {
                margin-bottom: 1.2rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #4a4a4a;
                font-size: 0.95rem;
            }
            .form-group input {
                width: 100%;
                padding: 0.8rem;
                border: 1px solid #d1d1d1;
                border-radius: 6px;
                font-size: 0.95rem;
                transition: all 0.3s ease;
            }
            .form-group input:focus {
                outline: none;
                border-color: #0a66c2;
                box-shadow: 0 0 4px rgba(10, 102, 194, 0.3);
            }
            button {
                width: 100%;
                padding: 0.9rem;
                background-color: #0a66c2;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            button:hover {
                background-color: #004182;
            }
            .logo {
                display: block;
                margin: 0 auto 1rem auto;
                width: 50px;
                height: auto;
            }
            .signup-link {
                text-align: center;
                margin-top: 1rem;
                color: #4a4a4a;
                font-size: 0.95rem;
            }
            .signup-link a {
                color: #0a66c2;
                text-decoration: none;
                font-weight: bold;
            }
        </style>
        <div class="login-container">
            <img class="logo" src="https://pngimg.com/uploads/letter_j/letter_j_PNG29.png" alt="Logo">
            <h2>Login to Your Account</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password" required>
                </div>
                <button type="submit">Login</button>
            </form>
            <p class="signup-link">Don't have an account? <a href="#" id="signupLink">Sign Up</a></p>
        </div>
    `;
}

function mainTemplate() {
    return `
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #ecf0f1;
                color: #2c3e50;
            }
            .navbar {
                background-color: #0073b1;
                padding: 1rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                color: white;
            }
            .navbar ul {
                display: flex;
                justify-content: center;
                list-style: none;
                margin: 0;
                padding: 0;
                gap: 2rem;
            }
            .navbar ul li {
                display: inline-block;
            }
            .navbar ul li a {
                color: white;
                text-decoration: none;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: color 0.3s ease;
            }
            .navbar ul li a:hover {
                color: #3498db;
            }
            .job-container {
                max-width: 800px;
                margin: 2rem auto;
                padding: 1.5rem;
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                transition: box-shadow 0.3s ease;
            }
            .job-container:hover {
                box-shadow: 0 6px 12px rgba(0,0,0,0.2);
            }
            .job-list h2 {
                text-align: center;
                color: #0073b1;
                margin-bottom: 1.5rem;
                font-size: 1.4rem;
            }
            .search-container {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            .search-input {
                flex-grow: 1;
                padding: 0.8rem;
                border: 1px solid #bdc3c7;
                border-radius: 6px;
                transition: all 0.3s ease;
            }
            .search-input:focus {
                outline: none;
                border-color: #3498db;
                box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            }
            .job-card {
                background-color: white;
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 1rem;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            .job-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 6px 12px rgba(0,0,0,0.2);
            }
            .job-card h3 {
                color: #0073b1;
                margin-bottom: 0.5rem;
                font-size: 1.2rem;
            }
            .job-card p {
                color: #7f8c8d;
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }
            .job-card img {
                max-width: 100%;
                border-radius: 4px;
                margin-bottom: 0.5rem;
                height: 50px;
            }
            .job-card button {
                background-color: #28a745;
                color: white;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                margin-top: 1rem;
                font-size: 1rem;
            }
            .job-card button:hover {
                background-color: #218838;
            }
            .popup {
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 1000;
                width: 90%;
                max-width: 500px;
                padding: 2rem;
                text-align: center;
                transition: all 0.3s ease;
            }
            .popup-header {
                font-size: 1.2rem;
                margin-bottom: 1rem;
            }
            .popup-close {
                position: absolute;
                top: 8px;
                right: 8px;
                cursor: pointer;
                color: #7f8c8d;
            }
            .popup-content {
                color: #2c3e50;
            }
            .popup button {
                background-color: #0073b1;
                color: white;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                margin-top: 1rem;
                font-size: 1rem;
            }
            .popup button:hover {
                background-color: #005f8a;
            }
        </style>
        <nav class="navbar">
            <ul>
                <li><a href="#" id="mainLink">Home</a></li>
                <li><a href="#" id="appliedLink">Applied Jobs</a></li>
                <li><a href="#" id="profileLink">Profile</a></li>
                <li><a href="#" id="logoutLink">Logout</a></li>
            </ul>
        </nav>
        <div class="job-container">
            <div class="job-list">
                <h2>Available Jobs</h2>
                <div class="search-container">
                    <input 
                        type="text" 
                        id="jobSearch" 
                        class="search-input" 
                        placeholder="Search by company or job title..."
                    >
                </div>
                <div id="jobsList">
                    <!-- Jobs will be listed here -->
                    <div class="job-card" data-job-id="1">
                        <h3>Software Engineer</h3>
                        <img src="path_to_image1.jpg" alt="Google Logo">
                        <p>Google - Mountain View, CA</p>
                        <button onclick="openPopup(1)">View Details</button>
                    </div>
                    <div class="job-card" data-job-id="2">
                        <h3>Data Analyst</h3>
                        <img src="path_to_image2.jpg" alt="Facebook Logo">
                        <p>Facebook - Menlo Park, CA</p>
                        <button onclick="openPopup(2)">View Details</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="popup" id="popup">
            <div class="popup-header">
                Job Details
                <span class="popup-close" onclick="closePopup()">&times;</span>
            </div>
            <div class="popup-content">
                <!-- Job details will be dynamically inserted here -->
            </div>
            <button onclick="applyJob()">Apply Now</button>
        </div>
    `;
}

function openPopup(jobId) {
    // Show the popup and load job details (mock data for now)
    const popup = document.getElementById('popup');
    const popupContent = popup.querySelector('.popup-content');
    
    if (jobId === 1) {
        popupContent.innerHTML = `
            <h3>Software Engineer at Google</h3>
            <p>Location: Mountain View, CA</p>
            <p>Salary: $120,000 - $140,000</p>
            <p>Requirements: 3+ years experience in software development, proficiency in JavaScript, and familiarity with cloud technologies.</p>
        `;
    } else if (jobId === 2) {
        popupContent.innerHTML = `
            <h3>Data Analyst at Facebook</h3>
            <p>Location: Menlo Park, CA</p>
            <p>Salary: $100,000 - $120,000</p>
            <p>Requirements: Strong analytical skills, proficiency in SQL and Python, and experience with data visualization tools.</p>
        `;
    }

    popup.style.display = 'block';
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

function appliedTemplate() {
    return `
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #ecf0f1;
                color: #2c3e50;
                margin: 0;
                padding: 0;
            }

            .navbar {
                background-color: #0073b1;
                padding: 1rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                color: white;
            }
            .navbar ul {
                display: flex;
                justify-content: center;
                list-style: none;
                margin: 0;
                padding: 0;
                gap: 2rem;
            }
            .navbar ul li a {
                color: white;
                text-decoration: none;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: color 0.3s ease;
            }
            .navbar ul li a:hover {
                color: #3498db;
            }
            .applied-container {
                max-width: 800px;
                margin: 2rem auto;
                padding: 1.5rem;
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                transition: box-shadow 0.3s ease;
            }
            .applied-container:hover {
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            }
            .applied-list h2 {
                text-align: center;
                color: #0073b1;
                margin-bottom: 1.5rem;
                font-size: 1.6rem;
            }
            .job-card {
                background-color: white;
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 1rem;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .job-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            }
            .job-card h3 {
                color: #0073b1;
                margin-bottom: 0.5rem;
                font-size: 1.4rem;
            }
            .job-card p {
                color: #7f8c8d;
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }
            .job-logo {
                max-width: 80%;
                height: 80px;
                border-radius: 4px;
                margin-bottom: 1rem;
                object-fit: contain;
            }
            .job-card button {
                background-color: #e74c3c;
                color: white;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                margin-top: 1rem;
                font-size: 1rem;
            }
            .job-card button:hover {
                background-color: #c0392b;
            }
        </style>
        <nav class="navbar">
            <ul>
                <li><a href="#" id="mainLink">Home</a></li>
                <li><a href="#" id="appliedLink">Applied Jobs</a></li>
                <li><a href="#" id="profileLink">Profile</a></li>
                <li><a href="#" id="logoutLink">Logout</a></li>
            </ul>
        </nav>
        <div class="applied-container">
            <div class="applied-list">
                <h2>Applied Jobs</h2>
                <div id="appliedJobsList">
                    <!-- Applied jobs will be dynamically loaded here -->
                </div>
            </div>
        </div>
    `;
}

function loadAppliedJobs() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
        showAlert('User email is not found. Please log in again.', 'error');
        return;
    }

    fetch(`${API_URL}/applied-jobs/?email=${encodeURIComponent(email)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch applied jobs.');
            }
            return response.json();
        })
        .then(data => {
            const appliedJobsList = document.getElementById('appliedJobsList');

            if (data.status === 'success' && data.job_ids) {
                const jobIds = data.job_ids;
                const appliedJobs = jobs.filter(job => jobIds.includes(job.id.toString()));

                if (appliedJobs.length === 0) {
                    appliedJobsList.innerHTML = `
                        <div>
                            <h3>You haven't applied to any jobs yet.</h3>
                        </div>
                    `;
                    return;
                }

                appliedJobsList.innerHTML = appliedJobs
                    .map(
                        job => `
                    <div class="job-card">
                        <img src="${job.logo}" alt="${job.company} Logo" class="job-logo" />
                        <h3>${job.title}</h3>
                        <p><strong>Company:</strong> ${job.company}</p>
                        <p><strong>Location:</strong> ${job.location}</p>
                        <p><strong>Type:</strong> ${job.jobType}</p>
                        <p><strong>Experience Required:</strong> ${job.experienceRequired}</p>
                        <button onclick="unapplyJob(${job.id})">Withdraw Application</button>
                    </div>
                `
                    )
                    .join('');
            } else {
                appliedJobsList.innerHTML = `
                    <div>
                        <h3>Error loading applied jobs: ${data.message || 'Unknown error occurred.'}</h3>
                    </div>
                `;
            }
        })
        .catch(error => {
            const appliedJobsList = document.getElementById('appliedJobsList');
            appliedJobsList.innerHTML = `
                <div>
                    <h3>Failed to load applied jobs. Please try again later.</h3>
                </div>
            `;
        });
}

function profileTemplate() {
    return `
        <style>
            .navbar {
                background-color: #2c3e50 !important;
                padding: 1rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .navbar ul {
                display: flex;
                justify-content: center;
                list-style: none;
                gap: 2rem;
                margin: 0;
                padding: 0;
            }
            .navbar ul li a {
                color: white !important;
                text-decoration: none;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: color 0.3s ease;
            }
            .navbar ul li a:hover {
                color: #3498db !important;
            }
            .profile-container {
                max-width: 800px;
                margin: 2rem auto;
                padding: 1rem;
                background-color: #f4f7f6;
                border-radius: 12px;
            }
            .profile-info {
                background-color: white;
                border-radius: 8px;
                padding: 1.5rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .profile-info h2 {
                text-align: center;
                color: #2c3e50;
                margin-bottom: 1.5rem;
            }
            .profile-info p {
                margin-bottom: 0.75rem;
                color: #34495e;
            }
            .profile-info p strong {
                color: #3498db;
                margin-right: 0.5rem;
            }
            .applied-jobs-section {
                margin-top: 2rem;
            }
            .applied-jobs-section h3 {
                color: #2c3e50;
                margin-bottom: 1rem;
                text-align: center;
            }
            .job-card {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            .job-card:hover {
                transform: translateY(-5px);
            }
            .job-card h3 {
                color: #3498db;
                margin-bottom: 0.5rem;
            }
        </style>
        <nav class="navbar">
            <ul>
                <li><a href="#" id="mainLink">Home</a></li>
                <li><a href="#" id="appliedLink">Applied Jobs</a></li>
                <li><a href="#" id="profileLink">Profile</a></li>
                <li><a href="#" id="logoutLink">Logout</a></li>
            </ul>
        </nav>
        <div class="profile-container">
            <div class="profile-info">
                <h2>Profile</h2>
                <div id="profileInfo">
                </div>
            </div>
           
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userEmail')) {
        navigate('main');
    } else {
        navigate('signup');
    }
});

document.addEventListener('click', (event) => {
    if (event.target.id === 'loginLink') {
        event.preventDefault();
        navigate('login');
    } else if (event.target.id === 'signupLink') {
        event.preventDefault();
        navigate('signup');
    } else if (event.target.id === 'mainLink') {
        event.preventDefault();
        navigate('main');
    } else if (event.target.id === 'appliedLink') {
        event.preventDefault();
        navigate('applied');
    } else if (event.target.id === 'profileLink') {
        event.preventDefault();
        navigate('profile');
    } else if (event.target.id === 'logoutLink') {
        event.preventDefault();
        logout();
    }
});

async function handleSignup(e) {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        email: document.getElementById('email').value,
        institution: document.getElementById('institution').value,
        address: document.getElementById('address').value,
        about: document.getElementById('about').value,
        password: password
    };

    try {
        const response = await fetch(`${API_URL}/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.status === 'success') {
            showAlert('Signup successful! Please login.', 'success');
            setTimeout(() => navigate('login'), 2000);
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        showAlert('Please check your internet Connection', 'error')
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.status === 'success') {    
            localStorage.setItem('userEmail', data.user.email);
            showAlert("Login success", 'success')
            navigate('main');
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        showAlert('Please check your internet Connection', 'error')
    }
}

const jobs = [
    {
        id: 1,
        title: "Software Engineer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        description: "Develop and maintain software applications.",
        skills: ["JavaScript", "React", "Node.js"],
        jobType: "Full-Time",
        experienceRequired: "2+ years",
        logo: "https://r2.erweima.ai/imgcompressed/img/compressed_f0944f47a497631540d17712999f9395.webp"
    },
    {
        id: 2,
        title: "Data Analyst",
        company: "Data Solutions",
        location: "New York, NY",
        description: "Analyze data trends and generate insights.",
        skills: ["SQL", "Python", "Tableau"],
        jobType: "Part-Time",
        experienceRequired: "1+ years",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSQ2eANJHlwGsmgUsmDp6UoAS-gN3N291wbg&s"
    },
    {
        id: 3,
        title: "Project Manager",
        company: "Innovate Ltd",
        location: "Seattle, WA",
        description: "Lead and manage project teams effectively.",
        skills: ["Leadership", "Agile", "Scrum"],
        jobType: "Contract",
        experienceRequired: "5+ years",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBvb9bjZ3x4Xi7Z4Pt4Og3C8x3ucWXpY94Hw&s"
    },
    {
        id: 4,
        title: "UX Designer",
        company: "Creative Minds",
        location: "Austin, TX",
        description: "Design user-friendly interfaces and experiences.",
        skills: ["Figma", "Sketch", "Wireframing"],
        jobType: "Full-Time",
        experienceRequired: "3+ years",
        logo: "https://logopond.com/logos/8c8ae172cf0b9181768c5c0c5499277c.png"
    },
    {
        id: 5,
        title: "Backend Developer",
        company: "CodeCraft",
        location: "Chicago, IL",
        description: "Build and maintain server-side applications.",
        skills: ["Java", "Spring Boot", "SQL"],
        jobType: "Full-Time",
        experienceRequired: "2+ years",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw4WmZWH_cEYPl6rYI_MnN4mZGaHwVRMobHw&s"
    },
    {
        id: 6,
        title: "Cloud Engineer",
        company: "Skyline Systems",
        location: "Denver, CO",
        description: "Implement and manage cloud infrastructure.",
        skills: ["AWS", "Azure", "Terraform"],
        jobType: "Full-Time",
        experienceRequired: "4+ years",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsdiPGvL5aEUKBTY51v6ugjxAnccAPGpf9vg&s"
    },
    {
        id: 7,
        title: "Front-End Developer",
        company: "Bright Web",
        location: "Los Angeles, CA",
        description: "Develop responsive web interfaces.",
        skills: ["HTML", "CSS", "JavaScript"],
        jobType: "Full-Time",
        experienceRequired: "2+ years",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqnwdBDiNGHtNuKKjaweDUIDPqHXjwVCuRCA&s"
    },
    {
        id: 8,
        title: "DevOps Engineer",
        company: "Streamline Solutions",
        location: "Boston, MA",
        description: "Automate deployment pipelines and manage CI/CD.",
        skills: ["Jenkins", "Docker", "Kubernetes"],
        jobType: "Full-Time",
        experienceRequired: "3+ years",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT911mBNFIuQc0-EwW97I023BPLxRJAC64o3w&s"
    },
    {
        id: 9,
        title: "QA Engineer",
        company: "TestLab Inc.",
        location: "Phoenix, AZ",
        description: "Ensure product quality through rigorous testing.",
        skills: ["Selenium", "JUnit", "Bug Tracking"],
        jobType: "Part-Time",
        experienceRequired: "1+ years",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWNvMAXaP2rWo1XaaOiElICHF8rJoxEahnOg&s"
    },
    {
        id: 10,
        title: "AI Specialist",
        company: "FutureTech",
        location: "Palo Alto, CA",
        description: "Develop and deploy AI-based solutions.",
        skills: ["TensorFlow", "PyTorch", "NLP"],
        jobType: "Contract",
        experienceRequired: "5+ years",
        logo: "https://campaignme.com/wp-content/uploads/2019/05/Futuretech-Logo-02.png"
    },
    {
        id: 11,
        title: "Cybersecurity Analyst",
        company: "SecureOps",
        location: "Atlanta, GA",
        description: "Monitor and protect systems against threats.",
        skills: ["Firewalls", "Penetration Testing", "SIEM"],
        jobType: "Full-Time",
        experienceRequired: "3+ years",
        logo: "https://media.licdn.com/dms/image/v2/C4E0BAQG-d666wuoxcA/company-logo_200_200/company-logo_200_200/0/1630590022883/secureops_logo?e=2147483647&v=beta&t=3H_twRW5ekHxVQdbqLeo1dWaDSAnnQzL7nY1MsxaIWM"
    },
    {
        id: 12,
        title: "Mobile App Developer",
        company: "Appify",
        location: "San Diego, CA",
        description: "Design and develop mobile applications.",
        skills: ["Kotlin", "Swift", "React Native"],
        jobType: "Full-Time",
        experienceRequired: "2+ years",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYknLvZo8CBot0b3mMXni8ikauHrMDVSF9mg&s"
    },
    {
        id: 13,
        title: "Database Administrator",
        company: "DataGuard",
        location: "Dallas, TX",
        description: "Manage and optimize database systems.",
        skills: ["SQL", "Oracle", "MongoDB"],
        jobType: "Full-Time",
        experienceRequired: "4+ years",
        logo: "https://media.licdn.com/dms/image/v2/D4D0BAQEFqhJemF4ASA/company-logo_200_200/company-logo_200_200/0/1719820255433/dataguard1_logo?e=2147483647&v=beta&t=AhyMAEqBvN54AxAMj0Mb5qRPIG5-r_k_f4C-i7V1758"
    },
    {
        id: 14,
        title: "Machine Learning Engineer",
        company: "InnovAI",
        location: "Miami, FL",
        description: "Build ML models to solve business problems.",
        skills: ["Python", "Pandas", "Scikit-learn"],
        jobType: "Contract",
        experienceRequired: "3+ years",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVBy-wjTO9s6G7STijn-ZWM4scpUdy_bRg7w&s"
    },
    {
        id: 15,
        title: "Network Engineer",
        company: "NetSolutions",
        location: "Houston, TX",
        description: "Design and maintain network infrastructure.",
        skills: ["Routing", "Switching", "Firewalls"],
        jobType: "Full-Time",
        experienceRequired: "3+ years",
        logo: "https://logopond.com/logos/e45eb5cb06bb425e5a2eb812647745c5.png"
    },
];


async function loadProfile() {
    try {
        console.log(localStorage.getItem('userEmail'));
        const response = await axios.get(`${API_URL}/profile/?email=${localStorage.getItem('userEmail')}`);
        const data = response.data;
        const profileInfo = document.getElementById('profileInfo');
        
        // Maintain the original user information display
        profileInfo.innerHTML = `
        <div class="container profile-container">
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    <div class="card profile-card shadow-lg">
                        <div class="card-header bg-primary text-white">
                            <h2 class="text-center mb-0">
                                <i class="fas fa-user-circle mr-2"></i>Profile Details
                            </h2>
                        </div>
                        <div class="card-body">
                            <div class="row profile-detail">
                                <div class="col-4 profile-label">
                                    <strong>Name</strong>
                                </div>
                                <div class="col-8">
                                    ${data.name}
                                </div>
                            </div>
                            <hr>
                            <div class="row profile-detail">
                                <div class="col-4 profile-label">
                                    <strong>Email</strong>
                                </div>
                                <div class="col-8">
                                    ${data.email}
                                </div>
                            </div>
                            <hr>
                            <div class="row profile-detail">
                                <div class="col-4 profile-label">
                                    <strong>Age</strong>
                                </div>
                                <div class="col-8">
                                    ${data.age}
                                </div>
                            </div>
                            <hr>
                            <div class="row profile-detail">
                                <div class="col-4 profile-label">
                                    <strong>Institution</strong>
                                </div>
                                <div class="col-8">
                                    ${data.institution}
                                </div>
                            </div>
                            <hr>
                            <div class="row profile-detail">
                                <div class="col-4 profile-label">
                                    <strong>Address</strong>
                                </div>
                                <div class="col-8">
                                    ${data.address}
                                </div>
                            </div>
                            <hr>
                            <div class="row profile-detail">
                                <div class="col-4 profile-label">
                                    <strong>About</strong>
                                </div>
                                <div class="col-8">
                                    ${data.about}
                                </div>
                            </div>
                           
                        </div>
                        <div class="card-footer text-center">
                            <p id="deleteAccountBtn" >
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Account Confirmation Modal -->
        <div class="modal fade" id="deleteAccountModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                       
                       
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning" role="alert">
                            <i class="fas fa-info-circle mr-2"></i>
                            This action is permanent and cannot be undone. All your data will be permanently deleted.
                        </div>
                        <form id="deleteAccountForm">
                            <div class="form-group">
                                <label for="deletePassword">
                                    <i class="fas fa-lock mr-2"></i>Confirm Password
                                </label>
                                <input 
                                    type="password" 
                                    class="form-control" 
                                    id="deletePassword" 
                                    required 
                                    placeholder="Enter your password to confirm deletion"
                                >
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                       
                        <button type="button" class="btn btn-danger" id="confirmDeleteBtn">
                            <i class="fas fa-check mr-2"></i>Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add necessary CSS -->
        <style>
            .profile-container {
                padding-top: 50px;
            }
            .profile-card {
                border-radius: 15px;
                overflow: hidden;
            }
            .profile-card .card-header {
                padding: 20px;
            }
            .profile-detail {
                padding: 10px 0;
                transition: background-color 0.3s ease;
            }
            .profile-detail:hover {
                background-color: rgba(0,0,0,0.05);
            }
            .profile-label {
                color: #6c757d;
                font-weight: 600;
            }
        </style>
        `;

        // Event listeners for delete account functionality
        document.getElementById('deleteAccountBtn').addEventListener('click', () => {
            $('#deleteAccountModal').modal('show');
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
            const password = document.getElementById('deletePassword').value;

            if (!password) {
                showAlert('Please enter your password to confirm deletion.');
                return;
            }

            try {
                const deleteResponse = await axios.post(`${API_URL}/delete-account/`, {
                    email: localStorage.getItem('userEmail'),
                    password: password,
                });

                if (deleteResponse.data.status === 'success') {
                    localStorage.clear();
                    showAlert('Account deleted successfully.');
                    window.location.href = 'login.html';
                } else {
                    showAlert(deleteResponse.data.message || 'Error deleting account.');
                }
            } catch (error) {
                showAlert('Wrong password');
            }
        });
    } catch (error) {
        alert('Error loading profile.');
        console.error(error);
    }
}

async function checkJobApplicationStatus(jobId) {
    const email = localStorage.getItem('userEmail');
    try {
        const response = await fetch(`${API_URL}/job-application-status/?email=${email}&job_id=${jobId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            return data.applied;
        } else {
            showAlert('Failed to check job application status', 'error');
            return false;
        }
    } catch (error) {
        showAlert('An error occurred while checking job application status', 'error');
        return false;
    }
}

async function loadJobs() {
    try {
        const data = { jobs }; 
        const jobsList = document.getElementById("jobsList");
        const searchInput = document.getElementById("jobSearch");

        async function renderJobs(jobsToRender) {
            const renderedJobs = await Promise.all(jobsToRender.map(async (job) => {
                const isApplied = await checkJobApplicationStatus(job.id);
                return `
                <div class="job-card">
                    <h3>${job.title}</h3>
                    <img src="${job.logo}" alt="${job.company} Logo" class="job-logo" />
                    <p><strong>Company:</strong> ${job.company}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Type:</strong> ${job.jobType}</p>
                    <p><strong>Experience Required:</strong> ${job.experienceRequired}</p>
                    <p><strong>Skills:</strong> ${job.skills.join(", ")}</p>
                    <p>${job.description}</p>
                    <button onclick="applyJob(${job.id})" ${isApplied ? 'disabled style="background-color: #cccccc; cursor: not-allowed;"' : ''}>
                        ${isApplied ? 'Applied' : 'Apply'}
                    </button>
                </div>
            `;
            }));
            
            jobsList.innerHTML = renderedJobs.join("");
        }

        // Initial rendering of jobs
        await renderJobs(data.jobs);

        // Search functionality
        searchInput.addEventListener('input', async (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            const filteredJobs = data.jobs.filter(job => 
                job.company.toLowerCase().includes(searchTerm) || 
                job.title.toLowerCase().includes(searchTerm)
            );

            await renderJobs(filteredJobs);
        });

    } catch (error) {
        showAlert('An error occurred while loading jobs. Please try again later.', 'error');
    }
}


function applyJob(jobId) {
    // Create a modal for resume link input
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        ">
            <div class="modal-content" style="
                background: white;
                padding: 20px;
                border-radius: 10px;
                width: 400px;
                text-align: center;
            ">
                <h2>Apply for Job</h2>
                <p>Please provide a link to your resume</p>
                <input 
                    type="url" 
                    id="resumeLink" 
                    placeholder="Enter resume link (e.g., Google Drive, Dropbox)" 
                    style="width: 100%; padding: 10px; margin: 10px 0;"
                    required
                >
                <div>
                    <button id="submitApplication" style="
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        margin-right: 10px;
                        border-radius: 5px;
                    ">Submit</button>
                    <button id="cancelApplication" style="
                        background-color: #f44336;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                    ">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const resumeInput = modal.querySelector('#resumeLink');
    const submitButton = modal.querySelector('#submitApplication');
    const cancelButton = modal.querySelector('#cancelApplication');

    // Cancel button closes the modal
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Submit button sends application
    submitButton.addEventListener('click', () => {
        const resumeLink = resumeInput.value.trim();
        
        // Basic URL validation
        if (!resumeLink || !(resumeLink.startsWith('http://') || resumeLink.startsWith('https://'))) {
            showAlert('Please enter a valid resume link', 'error');
            return;
        }

        // Disable submit button to prevent multiple submissions
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        fetch(`${API_URL}/apply/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                job_id: jobId,
                email: localStorage.getItem('userEmail'),
                resume_link: resumeLink
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Remove modal
            document.body.removeChild(modal);

            if (data.status === 'success') {
                showAlert('Job applied successfully!', 'success');
                loadJobs(); // Refresh the jobs list
            } else {
                showAlert(data.message, 'error');
            }
        })
        .catch(error => {
            // Remove modal
            document.body.removeChild(modal);
            showAlert('An error occurred', 'error');
        });
    });
    closePopup();

}
  
async function renderJobs(jobsToRender) {
    const renderedJobs = await Promise.all(jobsToRender.map(async (job) => {
      const isApplied = await checkJobApplicationStatus(job.id);
      
      return `
        <div class="job-card">
          <h3>${job.title}</h3>
          <p><strong>Company:</strong> ${job.company}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Type:</strong> ${job.jobType}</p>
          <p><strong>Experience Required:</strong> ${job.experienceRequired}</p>
          <p><strong>Skills:</strong> ${job.skills.join(", ")}</p>
          <p>${job.description}</p>
          <button 
            data-job-id="${job.id}" 
            onclick="applyJob(${job.id})"
            ${isApplied ? 'disabled class="applied"' : ''}
          >
            ${isApplied ? 'Applied' : 'Apply'}
          </button>
        </div>
      `;
    }));
    
    jobsList.innerHTML = renderedJobs.join("");
}

function unapplyJob(jobId) {
    fetch(`${API_URL}/unapply/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_id: jobId, email: localStorage.getItem('userEmail') }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showAlert('Job unapplied successfully!', 'success');
            loadAppliedJobs(); // Refresh the applied jobs list
            loadJobs(); // Refresh the main jobs list to update apply/unapply buttons
        } else {
            showAlert(data.message, 'error');
        }
    })
    .catch(error => {
    });
}



window.unapplyJob = unapplyJob;

function showAlert(message, type) {
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;

    // Add inline styles
    alertBox.style.position = 'fixed';
    alertBox.style.bottom = '20px';
    alertBox.style.right = '20px';
    alertBox.style.padding = '15px 20px';
    alertBox.style.borderRadius = '5px';
    alertBox.style.fontSize = '16px';
    alertBox.style.color = '#fff';
    alertBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    alertBox.style.zIndex = '1000';

    // Add background color based on the type
    if (type === 'success') {
        alertBox.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        alertBox.style.backgroundColor = '#F44336';
    } else if (type === 'info') {
        alertBox.style.backgroundColor = '#2196F3';
    } else {
        alertBox.style.backgroundColor = '#555'; // Default color
    }

    document.body.appendChild(alertBox);

    // Automatically remove the alert after 3 seconds
    setTimeout(() => {
        alertBox.remove();
    }, 1000);
}

function logout() {
    localStorage.removeItem('userEmail');
    navigate('login');
}

window.applyJob = applyJob;
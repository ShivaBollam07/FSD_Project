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
                max-width: 500px;
                margin: 2rem auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                padding: 2rem;
            }
            .signup-container h2 {
                text-align: center;
                color: #2c3e50;
                margin-bottom: 1.5rem;
                font-weight: 600;
            }
            .form-group {
                margin-bottom: 1rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #34495e;
                font-weight: 500;
            }
            .form-group input, 
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #bdc3c7;
                border-radius: 6px;
                transition: all 0.3s ease;
            }
            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #3498db;
                box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            }
            button {
                width: 100%;
                padding: 0.75rem;
                background-color: #3498db;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            button:hover {
                background-color: #2980b9;
            }
            .login-link {
                text-align: center;
                margin-top: 1rem;
                color: #7f8c8d;
            }
            .login-link a {
                color: #3498db;
                text-decoration: none;
            }
        </style>
        <div class="signup-container">
            <h2>Sign Up</h2>
            <form id="signupForm">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label>Age</label>
                    <input type="number" id="age" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label>Institution</label>
                    <input type="text" id="institution" required>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <textarea id="address" required></textarea>
                </div>
                <div class="form-group">
                    <label>About Myself</label>
                    <textarea id="about" required></textarea>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" required>
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" id="confirmPassword" required>
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
                margin: 2rem auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                padding: 2rem;
            }
            .login-container h2 {
                text-align: center;
                color: #2c3e50;
                margin-bottom: 1.5rem;
                font-weight: 600;
            }
            .form-group {
                margin-bottom: 1rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #34495e;
                font-weight: 500;
            }
            .form-group input {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #bdc3c7;
                border-radius: 6px;
                transition: all 0.3s ease;
            }
            .form-group input:focus {
                outline: none;
                border-color: #3498db;
                box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            }
            button {
                width: 100%;
                padding: 0.75rem;
                background-color: #3498db;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            button:hover {
                background-color: #2980b9;
            }
            .signup-link {
                text-align: center;
                margin-top: 1rem;
                color: #7f8c8d;
            }
            .signup-link a {
                color: #3498db;
                text-decoration: none;
            }
        </style>
        <div class="login-container">
            <h2>Login</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="loginEmail" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="loginPassword" required>
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
            .job-container {
                max-width: 800px;
                margin: 2rem auto;
                padding: 1rem;
                background-color: #f4f7f6;
                border-radius: 12px;
            }
            .job-list h2 {
                text-align: center;
                color: #2c3e50;
                margin-bottom: 1.5rem;
            }
            .search-container {
                display: flex;
                margin-bottom: 1.5rem;
                gap: 1rem;
            }
            .search-input {
                flex-grow: 1;
                padding: 0.75rem;
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
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            .job-card:hover {
                transform: translateY(-5px);
            }
            .job-card h3 {
                color: #3498db;
                margin-bottom: 0.5rem;
            }
            .job-card button {
                background-color: #2ecc71;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                margin-top: 1rem;
            }
            .job-card button:hover {
                background-color: #27ae60;
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
                </div>
            </div>
        </div>
    `;
}

function appliedTemplate() {
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
            .applied-container {
                max-width: 800px;
                margin: 2rem auto;
                padding: 1rem;
                background-color: #f4f7f6;
                border-radius: 12px;
            }
            .applied-list h2 {
                text-align: center;
                color: #2c3e50;
                margin-bottom: 1.5rem;
            }
            .job-card {
                background-color: white;
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 1rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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
        <div class="applied-container">
            <div class="applied-list">
                <h2>Applied Jobs</h2>
                <div id="appliedJobsList">
                    <!-- Applied jobs will be listed here -->
                </div>
            </div>
        </div>
    `;
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
        showAlert('An error occurred', 'error');
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
        showAlert('An error occurred', 'error');
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

        await renderJobs(data.jobs);

        searchInput.addEventListener('input', async (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            const filteredJobs = data.jobs.filter(job => 
                job.company.toLowerCase().includes(searchTerm) || 
                job.title.toLowerCase().includes(searchTerm)
            );

            await renderJobs(filteredJobs);
        });

    } catch (error) {
        if(jobsList.length() == 0){

        }
        else{
            showAlert('An error occurred', 'error');
        }
    }
}

function applyJob(jobId) {
    const applyButton = document.querySelector(`[data-job-id="${jobId}"]`);
    
    if (applyButton) {
      applyButton.disabled = true;
      applyButton.textContent = 'Applying...';
    }
  
    fetch(`${API_URL}/apply/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_id: jobId,
        email: localStorage.getItem('userEmail')
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        showAlert('Job applied successfully!', 'success');
        
        // Update button to show 'Applied' state
        if (applyButton) {
          applyButton.textContent = 'Applied';
          applyButton.classList.add('applied');
        }
        
        loadJobs(); // Refresh the jobs list
      } else {
        // Revert button state on failure
        if (applyButton) {
          applyButton.disabled = false;
          applyButton.textContent = 'Apply';
        }
        showAlert(data.message, 'error');
      }
    })
    .catch(error => {
      // Revert button state on error
      if (applyButton) {
        applyButton.disabled = false;
        applyButton.textContent = 'Apply';
      }
      showAlert('An error occurred', 'error');
    });
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
        showAlert('An error occurred', 'error');
    });
}

function loadAppliedJobs() {
    const email = localStorage.getItem('userEmail');
    fetch(`${API_URL}/applied-jobs/?email=${email}`)
        .then(response => response.json())
        .then(data => {
            const appliedJobsList = document.getElementById('appliedJobsList');
            
            if (data.status === 'success') {
                const jobIds = data.job_ids;
                const appliedJobs = jobs.filter(job => jobIds.includes(job.id.toString()));

                if (appliedJobs.length === 0) {
                    appliedJobsList.innerHTML = `
                        <div>
                            <h3>User Haven't applied to any jobs yet<h3>
                        </div>
                    `;
                    return;
                }

                appliedJobsList.innerHTML = appliedJobs
                    .map(
                        job => `
                    <div class="job-card">
                        <h3>${job.title}</h3>
                        <p><strong>Company:</strong> ${job.company}</p>
                        <p><strong>Location:</strong> ${job.location}</p>
                        <p><strong>Type:</strong> ${job.jobType}</p>
                        <p><strong>Experience Required:</strong> ${job.experienceRequired}</p>
                        <button onclick="unapplyJob(${job.id})">Unapply</button>
                    </div>
                `
                    )
                    .join('');
            } else {
                showAlert(data.message, 'error');
            }
        })
        .catch(error => {
            showAlert('Error loading applied jobs', 'error');
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
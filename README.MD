## Backend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ShivaBollam07/FSD_Project
```

### 2. Navigate to Backend Directory

```bash
cd backend/jobportal
```

### 3. Create a Virtual Environment(Optional)

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Database Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 7. Run Backend Server

```bash
python manage.py runserver
```

The backend will start on `http://localhost:8000`

---

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Frontend Development Server

```bash
npm run dev
```

The frontend development server will start, and the application will be accessible via the URL provided in the terminal (e.g., `http://localhost:3000`).

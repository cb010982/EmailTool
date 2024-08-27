from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Function to initialize the database and create the leads table
def init_db():
    conn = sqlite3.connect('leads.db')
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        company_name TEXT,
        country TEXT,
        job_title TEXT,
        mobile_phone TEXT,
        phone TEXT,
        linkedin_url TEXT,
        industry TEXT,
        department TEXT,
        company_size TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    conn.commit()
    conn.close()

# Initialize the database when the app starts
init_db()

# Route for the home page
@app.route('/')
def index():
    return "Welcome to the Email Builder!"

# Route to submit a lead
@app.route('/submit_lead', methods=['POST'])
def submit_lead():
    data = request.json
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    company_name = data.get('company_name')
    country = data.get('country')
    job_title = data.get('job_title')
    mobile_phone = data.get('mobile_phone')
    phone = data.get('phone')
    linkedin_url = data.get('linkedin_url')
    industry = data.get('industry')
    department = data.get('department')
    company_size = data.get('company_size')

    conn = sqlite3.connect('leads.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO leads (first_name, last_name, email, company_name, country, job_title, 
        mobile_phone, phone, linkedin_url, industry, department, company_size)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (first_name, last_name, email, company_name, country, job_title, mobile_phone, phone, linkedin_url, industry, department, company_size))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Lead added successfully!'}), 201

# Route to retrieve all leads
@app.route('/leads', methods=['GET'])
def get_leads():
    conn = sqlite3.connect('leads.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM leads')
    leads = cursor.fetchall()
    conn.close()

    # Convert the list of tuples into a list of dictionaries
    return jsonify([dict(ix) for ix in leads])

if __name__ == '__main__':
    app.run(port=5000)

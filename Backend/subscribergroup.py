from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Database connection helper function
def get_db_connection():
    conn = sqlite3.connect('leads.db')
    conn.row_factory = sqlite3.Row
    return conn

# Function to create necessary tables
def create_tables():
    conn = get_db_connection()
    c = conn.cursor()

    # Create groups table
    c.execute('''
        CREATE TABLE IF NOT EXISTS subscriber_groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_name TEXT NOT NULL UNIQUE
        )
    ''')

    # Create leads table if not already created
    c.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            email TEXT,
            phone TEXT,
            mobile_phone TEXT,
            country TEXT,
            company_name TEXT,
            industry TEXT,
            job_title TEXT,
            linkedin_url TEXT,
            company_size TEXT,
            department TEXT,
            other TEXT,
            group_name TEXT
        )
    ''')

    conn.commit()
    conn.close()

# API to create a new group
@app.route('/create_group', methods=['POST'])
def create_group():
    group_name = request.json['group_name']
    conn = get_db_connection()
    c = conn.cursor()
    
    # Check if the group already exists
    c.execute("SELECT * FROM subscriber_groups WHERE group_name = ?", (group_name,))
    if c.fetchone():
        return jsonify({"status": "error", "message": "Group name already exists"}), 400

    # Insert the new group
    c.execute("INSERT INTO subscriber_groups (group_name) VALUES (?)", (group_name,))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Group created successfully"})

# API to fetch all groups
@app.route('/get_groups', methods=['GET'])
def get_groups():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM subscriber_groups")
    groups = c.fetchall()
    conn.close()

    group_list = [{"id": row["id"], "group_name": row["group_name"]} for row in groups]
    return jsonify(group_list)

if __name__ == "__main__":
    create_tables()  # Create the tables when the app starts
    app.run(debug=True)

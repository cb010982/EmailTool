import sqlite3

def init_db():
    conn = sqlite3.connect('leads.db')
    cursor = conn.cursor()
    # Drop the existing leads table
    cursor.execute('DROP TABLE IF EXISTS leads')
    # Create the leads table with the new schema
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

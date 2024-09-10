import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('image_store.db')

# Create a cursor object
cursor = conn.cursor()

# Create a table to store image paths
cursor.execute('''
    CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_path TEXT NOT NULL
    )
''')

# Commit changes and close the connection
conn.commit()
conn.close()

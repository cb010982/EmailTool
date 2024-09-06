import sqlite3

# Function to create a table and insert email addresses
def create_test_table():
    # Connect to the SQLite database (or create it if it doesn't exist)
    connection = sqlite3.connect('your_database.db')
    cursor = connection.cursor()

    # Create the table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS test_recipients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL
        )
    ''')

    # List of emails to insert
    emails = [
        "senujidimansa@gmail.com",
        "senuji@acumenintelligence.com",
        "mufaddalm@techmeedigital.com",
        "maadm@techmeedigital.com"
    ]

    # Insert email addresses into the table
    cursor.executemany('INSERT INTO test_recipients (email) VALUES (?)', [(email,) for email in emails])

    # Commit the transaction and close the connection
    connection.commit()
    connection.close()

    print("Table created and emails inserted successfully.")

# Call the function to create the table and insert emails
if __name__ == "__main__":
    create_test_table()

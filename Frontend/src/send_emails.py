import smtplib
import sqlite3
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Function to fetch emails from the SQLite database
def get_recipients_from_db():
    # Print the current working directory for verification
    print("Current working directory:", os.getcwd())
    
    # Connect to the SQLite database file, ensure the path is correct
    db_path = 'E:\email-builder\Backend\your_database.db'  # Ensure this points to the correct database
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    # List all tables in the database to ensure connection is correct
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables in the connected database:", tables)

    # Select email addresses from the test_recipients table
    cursor.execute("SELECT email FROM test_recipients")
    
    # Fetch all the emails from the table
    rows = cursor.fetchall()
    
    # Convert the list of tuples to a flat list of email addresses
    emails = [row[0] for row in rows]
    
    connection.close()
    return emails

# Function to send the test email
def send_test_email(html_file_path, receiver_emails):
    # Email details
    sender_email = "senujidimansa@gmail.com"
    subject = "EDM Test Email"
    
    # Set up the server
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "senujidimansa@gmail.com"
    smtp_password = "zvap rrau tjmq kmhv"  # App-specific password

    # Read HTML content from file
    with open(html_file_path, 'r') as file:
        html_content = file.read()

    # Create the email
    msg = MIMEMultipart("alternative")
    msg['From'] = sender_email
    msg['To'] = ', '.join(receiver_emails)  # Convert list of emails to a comma-separated string
    msg['Subject'] = subject

    # Attach the HTML content to the email
    html_part = MIMEText(html_content, "html")
    msg.attach(html_part)

    try:
        # Connect to the server and send the email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        
        # Send the email to all recipients
        server.sendmail(sender_email, receiver_emails, msg.as_string())
        server.quit()

        print("Email sent successfully to all recipients!")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Specify the path to the HTML file and recipient list
if __name__ == "__main__":
    html_file_path = 'E:/email-builder/Frontend/src/email_template (8).html'  # Path to your email template

    # Get recipients from the database
    receiver_emails = get_recipients_from_db()

    # Send the email
    if receiver_emails:
        send_test_email(html_file_path, receiver_emails)
    else:
        print("No recipients found in the database.")

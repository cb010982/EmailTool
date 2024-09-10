from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS for handling cross-origin requests
import smtplib
import sqlite3
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Function to fetch emails from the SQLite database
def get_recipients_from_db():
    db_path = 'E:/email-builder/Backend/your_database.db'
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    cursor.execute("SELECT email FROM test_recipients")
    rows = cursor.fetchall()
    emails = [row[0] for row in rows]
    connection.close()
    return emails

# Function to send the test email
def send_test_email(html_content, receiver_emails):
    sender_email = "your-email@gmail.com"
    subject = "EDM Test Email"
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "senujidimansa@gmail.com"
    smtp_password = "zvap rrau tjmq kmhv"

    msg = MIMEMultipart("alternative")
    msg['From'] = sender_email
    msg['To'] = ', '.join(receiver_emails)
    msg['Subject'] = subject

    html_part = MIMEText(html_content, "html")
    msg.attach(html_part)

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, receiver_emails, msg.as_string())
        server.quit()
        return "Email sent successfully!"
    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log the error in Flask server logs
        return f"Failed to send email: {str(e)}"


# API endpoint to send the email
@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.get_json()
    html_content = data.get('html_content')
    
    if not html_content:
        return jsonify({'error': 'No HTML content provided'}), 400
    
    receiver_emails = get_recipients_from_db()
    
    if receiver_emails:
        response = send_test_email(html_content, receiver_emails)
        return jsonify({'message': response}), 200
    else:
        return jsonify({'error': 'No recipients found in the database'}), 400

if __name__ == "__main__":
    app.run(port=5000, debug=True)

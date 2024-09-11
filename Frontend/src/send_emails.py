# from flask import Flask, request, jsonify
# from flask_cors import CORS  # Import CORS for handling cross-origin requests
# import smtplib
# import sqlite3
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Function to fetch emails from the SQLite database
# def get_recipients_from_db():
#     db_path = 'E:/email-builder/Backend/your_database.db'
#     connection = sqlite3.connect(db_path)
#     cursor = connection.cursor()
#     cursor.execute("SELECT email FROM test_recipients")
#     rows = cursor.fetchall()
#     emails = [row[0] for row in rows]
#     connection.close()
#     return emails

# # Function to send the test email
# def send_test_email(html_content, receiver_emails):
#     sender_email = "your-email@gmail.com"
#     subject = "EDM Test Email"
#     smtp_server = "smtp.gmail.com"
#     smtp_port = 587
#     smtp_username = "no-reply@acumenintelligence.com"
#     smtp_password = "xexa kqse gcxs jbcm"

#     msg = MIMEMultipart("alternative")
#     msg['From'] = sender_email
#     msg['To'] = ', '.join(receiver_emails)
#     msg['Subject'] = subject

#     html_part = MIMEText(html_content, "html")
#     msg.attach(html_part)

#     try:
#         server = smtplib.SMTP(smtp_server, smtp_port)
#         server.starttls()
#         server.login(smtp_username, smtp_password)
#         server.sendmail(sender_email, receiver_emails, msg.as_string())
#         server.quit()
#         return "Email sent successfully!"
#     except Exception as e:
#         print(f"Error occurred: {str(e)}")  # Log the error in Flask server logs
#         return f"Failed to send email: {str(e)}"


# # API endpoint to send the email
# @app.route('/send-email', methods=['GET', 'POST'])
# def send_email():
#     if request.method == 'GET':
#         # Health check route message
#         return jsonify({'message': 'Email API is ready to send emails.'}), 200
    
#     elif request.method == 'POST':
#         data = request.get_json()
#         html_content = data.get('html_content')
        
#         if not html_content:
#             return jsonify({'error': 'No HTML content provided'}), 400
        
#         receiver_emails = get_recipients_from_db()
        
#         if receiver_emails:
#             response = send_test_email(html_content, receiver_emails)
#             return jsonify({'message': response}), 200
#         else:
#             return jsonify({'error': 'No recipients found in the database'}), 400

# # Health check or welcome route
# @app.route('/')
# def welcome():
#     return jsonify({'message': 'Flask Email API is up and running!'}), 200

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS for handling cross-origin requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Unified function to send an email
def send_email_to_single_recipient(html_content):
    sender_email = "no-reply@acumenintelligence.com"
    receiver_email = "senujidimansa@gmail.com"  # Hardcoded recipient
    subject = "EDM Test Email"
    
    # SMTP settings
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "no-reply@acumenintelligence.com"
    smtp_password = "xexa kqse gcxs jbcm"

    # Construct the email
    msg = MIMEMultipart("alternative")
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject

    html_part = MIMEText(html_content, "html")
    msg.attach(html_part)

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        return "Email sent successfully!"
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return f"Failed to send email: {str(e)}"

# API endpoint to send the email
@app.route('/send-email', methods=['GET', 'POST'])
def send_email():
    if request.method == 'GET':
        # Health check route message
        return jsonify({'message': 'Email API is ready to send emails.'}), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        html_content = data.get('html_content')
        
        if not html_content:
            return jsonify({'error': 'No HTML content provided'}), 400
        
        # Send the email to the single recipient
        response = send_email_to_single_recipient(html_content)
        return jsonify({'message': response}), 200

# Health check or welcome route
@app.route('/')
def welcome():
    return jsonify({'message': 'Flask Email API is up and running!'}), 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_test_email(html_file_path):
    # Email details
    sender_email = "senujidimansa@gmail.com"
    receiver_email = "senujidimansa@gmail.com"
    subject = "EDM Test Email"
    
    # Set up the server
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "senujidimansa@gmail.com"
    smtp_password = "zvap rrau tjmq kmhv"

    # Read HTML content from file
    with open(html_file_path, 'r') as file:
        html_content = file.read()

    # Create the email
    msg = MIMEMultipart("alternative")
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject

    # Attach the HTML content to the email
    html_part = MIMEText(html_content, "html")
    msg.attach(html_part)

    try:
        # Connect to the server and send the email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()

        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Specify the path to the HTML file
if __name__ == "__main__":
    html_file_path = 'E:\email-builder\Frontend\src\email_template (10).html'  
    send_test_email(html_file_path)

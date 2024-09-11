import subprocess
import time

def run_react_app():
    print("Starting React app (npm start)...")
    # Start the React app from the Frontend directory
    subprocess.Popen(["npm", "start"], cwd="E:/email-builder/Frontend", shell=True)

def run_flask_app():
    print("Starting Flask backend (send_emails.py)...")
    # Start the send_emails.py script from the Frontend/src directory
    subprocess.Popen(["python", "send_emails.py"], cwd="E:/email-builder/Frontend/src")

if __name__ == "__main__":
    # Start React and Flask apps in parallel
    run_react_app()
    time.sleep(5)  # Give React some time to start
    run_flask_app()

    print("Both React and Flask apps are running...")

    # Keep the main script alive to keep the subprocesses running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down...")
from flask import Flask, request, jsonify, send_from_directory, url_for, render_template_string
import os
import sqlite3

app = Flask(__name__)

# Folder where uploaded images will be stored
UPLOAD_FOLDER = 'uploaded_images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Connect to SQLite database
def connect_db():
    conn = sqlite3.connect('image_store.db')
    return conn

# Route to display the upload form
@app.route('/')
def upload_form():
    return render_template_string('''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload Image</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                text-align: center;
                padding: 50px;
            }
            .container {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
                display: inline-block;
            }
            input[type="file"] {
                margin: 10px 0;
            }
            button {
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Upload an Image</h1>
            <form action="/upload" method="POST" enctype="multipart/form-data">
                <input type="file" name="image" accept="image/*" required><br>
                <button type="submit">Upload</button>
            </form>
        </div>
    </body>
    </html>
    ''')

# Route to upload images
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No selected image"}), 400

    # Save the image to the file system
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
    image.save(image_path)

    # Store the image path in the database
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO images (image_path) VALUES (?)", (image_path,))
    conn.commit()
    conn.close()

    # Get the URL for the uploaded image
    image_url = url_for('serve_image', filename=image.filename, _external=True)
    
    return jsonify({"url": image_url}), 201

# Route to serve images from the upload folder
@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Route to retrieve all image URLs from the database
@app.route('/images', methods=['GET'])
def get_image_urls():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT image_path FROM images")
    rows = cursor.fetchall()
    conn.close()

    # Convert file paths to URLs
    image_urls = [url_for('serve_image', filename=os.path.basename(row[0]), _external=True) for row in rows]
    
    return jsonify(image_urls), 200

if __name__ == '__main__':
    app.run(debug=True)

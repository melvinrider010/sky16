"""
Sky16 Cafe Clone Server (Python)
Serves the React SPA on port 3000 and the API on port 3001
Uses Python standard library (no external dependencies needed)
"""

import http.server
import socketserver
import urllib.parse
import json
import os
import threading
import sys

FRONTEND_PORT = int(os.environ.get('PORT', 3000))
API_PORT = int(os.environ.get('API_PORT', 3001))
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'images.json')
UPLOADS_DIR = os.path.join(BASE_DIR, 'uploads')

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'data'), exist_ok=True)

def load_images():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return []

def save_images(images):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(images, f, indent=2)

class CloneHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # API: /api/ping
        if path == '/api/ping':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "online", "message": "Sky16 API is running"}).encode('utf-8'))
            return

        # API: /api/images?section=...
        if path == '/api/images':
            qs = urllib.parse.parse_qs(parsed.query)
            section = qs.get('section', ['slider'])[0]
            images = load_images()
            filtered = [img for img in images if img.get('section') == section]
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(filtered).encode('utf-8'))
            return

        # Static file or SPA fallback
        clean_path = urllib.parse.unquote(path).lstrip('/')
        full_file_path = os.path.join(BASE_DIR, clean_path)

        if not os.path.exists(full_file_path) or os.path.isdir(full_file_path):
            if path in ['/admin', '/admin/']:
                admin_path = os.path.join(BASE_DIR, 'admin.html')
                if os.path.exists(admin_path):
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/html; charset=utf-8')
                    self.end_headers()
                    with open(admin_path, 'rb') as f:
                        self.wfile.write(f.read())
                    return

            index_path = os.path.join(BASE_DIR, 'index.html')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            with open(index_path, 'rb') as f:
                self.wfile.write(f.read())
            return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/login':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(body)
                if data.get('password') == ADMIN_PASSWORD:
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                else:
                    self.send_response(401)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Invalid password"}).encode('utf-8'))
            except Exception:
                self.send_response(400)
                self.end_headers()
            return

        self.send_response(404)
        self.end_headers()

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path.startswith('/api/images/'):
            img_id = path.split('/')[-1]
            images = load_images()
            images = [img for img in images if str(img.get('id')) != str(img_id)]
            save_images(images)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "deleted": img_id}).encode('utf-8'))
            return
        self.send_response(404)
        self.end_headers()

def run_server(port, name):
    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    with ReusableTCPServer(("", port), CloneHandler) as httpd:
        print(f"[{name}] Running at http://localhost:{port}/")
        httpd.serve_forever()

if __name__ == '__main__':
    t1 = threading.Thread(target=run_server, args=(FRONTEND_PORT, "Sky16 Frontend & SPA"), daemon=True)
    t2 = threading.Thread(target=run_server, args=(API_PORT, "Sky16 Backend API"), daemon=True)
    t1.start()
    t2.start()
    print("Sky16 Clone is live! Press Ctrl+C to stop.")
    t1.join()

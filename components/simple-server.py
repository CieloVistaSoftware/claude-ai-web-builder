#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Simple HTTP Server for WB Event Log Component
Works on Windows, Mac, and Linux
Run: python simple-server.py
Then open: http://localhost:8083
"""

import http.server
import socketserver
import os

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.js'):
            return 'application/javascript', None
        if path.endswith('.css'):
            return 'text/css', None
        if path.endswith('.json'):
            return 'application/json', None
        if path.endswith('.ico'):
            return 'image/x-icon', None
        return super().guess_type(path)

    def log_message(self, format, *args):
        status = args[1] if len(args) > 1 else '?'
        path = args[0] if len(args) > 0 else '?'
        
        if status == 200 or status == 304:
            print(f"[OK] GET {path} -> {status}")
        else:
            print(f"[FAIL] GET {path} -> {status}")

if __name__ == '__main__':
    import sys
    # Force UTF-8 output on Windows
    if sys.platform == 'win32':
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("="*50)
    print("  WB Event Log Server")
    print("="*50)
    print(f"  URL: http://localhost:{PORT}")
    print("  Files: Current directory")
    print("  Press Ctrl+C to stop")
    print("="*50)
    print()
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped.")

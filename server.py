import http.server
import socket
import sys

class CleanHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def handle_one_request(self):
        try:
            super().handle_one_request()
        except (ConnectionResetError, BrokenPipeError):
            # Suppress errors when the browser prematurely closes the connection
            pass

class CleanThreadingHTTPServer(http.server.ThreadingHTTPServer):
    # Support dual-stack (IPv6 and IPv4) when binding to all interfaces
    address_family = socket.AF_INET6

    def server_bind(self):
        # Allow reusing address
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        # Enable dual-stack behavior on platforms that support it
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except (AttributeError, socket.error):
            pass
        super().server_bind()

    def handle_error(self, request, client_address):
        # Suppress tracebacks for broken pipes or connection resets (client disconnected)
        exc_type, exc_value, _ = sys.exc_info()
        if exc_type and issubclass(exc_type, (BrokenPipeError, ConnectionResetError, ConnectionAbortedError)):
            return
        super().handle_error(request, client_address)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
    # Bind to '' (which maps to :: when address_family is AF_INET6)
    server_address = ('', port)
    
    CleanHTTPRequestHandler.protocol_version = "HTTP/1.1"
    
    print(f"Starting server on port {port}...")
    try:
        with CleanThreadingHTTPServer(server_address, CleanHTTPRequestHandler) as httpd:
            print(f"Serving HTTP on :: port {port} (http://localhost:{port}/) ...")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)

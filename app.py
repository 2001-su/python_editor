from flask import Flask, request, render_template, jsonify
import subprocess
import tempfile
import os

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run', methods=['POST'])
def run_code():
    code = request.json['code']
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py", mode='w') as temp:
            temp.write(code)
            temp.flush()

            result = subprocess.run(
                ['python3', temp.name],
                capture_output=True,
                text=True,
                timeout=5
            )
        return jsonify({
            'output': result.stdout,
            'error': result.stderr
        })
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))  # Render assigns the port
    app.run(debug=True, host="0.0.0.0", port=port)
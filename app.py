from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def root():
    return send_from_directory('static', 'index.html')

DATA_FILE = 'data.json'

# 确保data.json存在
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump({
            "productName": "",
            "persona": [],
            "painPoints": [],
            "usageLocations": [],
            "developProducts": []
        }, f, indent=2)

def load_data():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route('/compare.html')
def serve_compare():
    return send_from_directory('static', 'compare.html')

@app.route('/develop.html')
def serve_develop():
    data = load_data()
        # 整合数据到developProducts
    integrated_data = {
        'location': [],
        'persona': [],
        'notMet': [],
        'requirement': []
    }
    for i in data['comparisonProducts']:
        integrated_data['location'].append(i['location'])
        integrated_data['persona'].append(i['persona'])
        integrated_data['notMet'].append(i['notMet'])
        if 'requirements' in i and i['requirements']:
            integrated_data['requirement'].append(i['requirements'])
    data['developProducts'] = integrated_data
    save_data(data)
    return send_from_directory('static', 'develop.html')

@app.route('/solution.html')
def serve_solution():
    return send_from_directory('static', 'solution.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(load_data())

@app.route('/api/data', methods=['PUT'])
def update_data():
    new_data = request.json
    save_data(new_data)
    return jsonify({"status": "success"})

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/api/debug')
def debug_mesage():
    print('test develop')
    return jsonify({"status": "success"})

if __name__ == '__main__':
    # 确保static目录存在
    os.makedirs('static', exist_ok=True)
    app.run(debug=True, port=8000)
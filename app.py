from itertools import count
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from apiFunction import getDesignTaskTags
import json
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

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
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route('/compare.html')
def serve_compare():
    return send_from_directory('static', 'compare.html')

@app.route('/compareFinal.html')
def serve_compare_final():
    return send_from_directory('static', 'compareFinal.html')

@app.route('/explore.html')
def serve_explore():
    # 显式指定优先使用路由而非静态文件
    return send_from_directory('static', 'explore.html')


@app.route('/explore-3.html')
def serve_explore_3():
    return send_from_directory('static', 'explore-3.html')

@app.route('/evaluation.html')
def serve_evaluation():
    return send_from_directory('static', 'evaluation.html')

@app.route('/develop.html')
def serve_develop():
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

@app.route('/api/gotodevelop')
def goto_develop():
    # data = load_data()
    # integrated_data = {
    #     'location': [],
    #     'persona': [],
    #     'notMet': [],
    #     'requirement': []
    # }
    # for i in data['comparisonProducts']:
    #     integrated_data['location'].append(i['location'])
    #     integrated_data['persona'].append(i['persona'])
    #     integrated_data['notMet'].append(i['notMet'])
    #     if 'requirements' in i and i['requirements']:
    #         integrated_data['requirement'].append(i['requirements'])
    # data['developProducts'] = integrated_data
    # save_data(data)
    return jsonify({"status": "success"})

@app.route('/api/fromtasktotag')
def from_task_to_tag():
    data = load_data()
    productName = data['productName']
    designTask = data['userInput']
    tags = getDesignTaskTags(productName, designTask)
    tagsJson = json.loads(tags)
    data['who'] = tagsJson['who']
    data['why'] = tagsJson['why']
    data['where'] = tagsJson['where']
    data['when'] = tagsJson['when']
    save_data(data)
    return jsonify({"status": "success"})

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/api/debug')
def debug_mesage():
    print('test develop')
    return jsonify({"status": "success"})

# 添加图片上传端点
@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    # 检查是否有文件部分
    if 'image' not in request.files:
        return jsonify({"status": "error", "message": "No image part"}), 400
    file = request.files['image']
    # 如果用户没有选择文件
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400
    # 检查文件类型是否允许
    if file and '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS:
        # 安全处理文件名
        filename = secure_filename(file.filename)
        # 保存文件路径
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # 更新data.json中的userImage字段
        data = load_data()
        # 确保userImage数组存在
        if 'userImage' not in data:
            data['userImage'] = []
        # 添加新图片信息
        data['userImage'].append({
            'filename': filename,
            'path': filepath,
            'upload_time': datetime.datetime.now().isoformat()
        })
        save_data(data)
        
        return jsonify({
            "status": "success",
            "filename": filename,
            "message": "Image uploaded successfully"
        })
    
    return jsonify({"status": "error", "message": "File type not allowed"}), 400

if __name__ == '__main__':
    # 确保static目录存在
    # print(from_task_to_tag())
    os.makedirs('static', exist_ok=True)
    app.run(debug=True, port=8000)
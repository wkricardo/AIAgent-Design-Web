// ... existing code ...
// 文字输入保存功能

document.addEventListener('DOMContentLoaded', () => {

    const designTaskInput = document.getElementById('design-task');

    designTaskInput.addEventListener('input', function() {
        // 保存到本地存储

        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                data['userInput'] = this.value;
                return fetch('/api/data', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            })
    });

    // 图像拖拽上传功能
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');

    // 阻止默认拖放行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // 高亮拖放区域
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    // 处理文件上传
    dropArea.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFiles, false);

    dropArea.addEventListener('click', () => fileInput.click());

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const files = e.target.files;
        [...files].forEach(previewFile);
    }

    function previewFile(file) {
        if (!file.type.match('image.*')) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            // 显示预览
            const preview = document.createElement('div');
            preview.className = 'image-preview';
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            dropArea.appendChild(preview);

            // 上传到后端
            const formData = new FormData();
            formData.append('image', file);
            fetch('/api/upload-image', {
                method: 'POST',
                body: formData
            });
        }
        reader.readAsDataURL(file);
    };

    setupEventListeners();

    function setupEventListeners() {
    // 继续按钮点击事件
        const continueBtn = document.getElementById('continue-btn');
        continueBtn.addEventListener('click', function() {
            // 可以添加页面跳转或表单提交逻辑
                    // 继续按钮点击事件
            const loadingAlert = document.getElementById('loadingAlert');
            loadingAlert.style.display = 'block';
            fetch('/api/fromtasktotag')
                .then(response => response.json())
                .then(data => {
                    loadingAlert.style.display = 'none';
                    if (data['status'] == 'success') {
                        window.location.href = 'explore.html';
                    } else {
                        alert('请先填写设计任务');
                    }
                });
        });
    }
});
// ... existing code ...
// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 生成时间线图表
    initEvaluationSections();
    setupEventListeners();

    // // 侧边栏项点击事件
    // const sidebarItems = document.querySelectorAll('.sidebar-item');
    // sidebarItems.forEach(item => {
    //     item.addEventListener('click', function() {
    //         // 移除所有active类
    //         sidebarItems.forEach(i => i.classList.remove('active'));
    //         // 给当前点击项添加active类
    //         this.classList.add('active');
    //     });
    // });

    // 下一步按钮点击事件
    const nextBtn = document.getElementById('continue-btn');
    nextBtn.addEventListener('click', function() {
        alert('准备进入下一轮迭代...');
        window.location.href = 'evaluation.html';
        // 这里可以添加实际的下一步逻辑
    });
});

// 初始化评估区域内容
function initEvaluationSections() {
    // Who 部分内容
    if ("who" == "who") {
        const evaluationContainer = document.getElementById('evaluation-container');
        const whoSection = document.getElementById('where-section');
        // <span class="tag-badge">P</span>

        const evaluationTag1 = document.createElement('div');
        evaluationTag1.className = 'evaluation-tag child-type';
        evaluationTag1.textContent = 'Major metropolitan areas';

        const evaluationTag2 = document.createElement('div');
        evaluationTag2.className = 'evaluation-tag child-type';
        evaluationTag2.textContent = 'Family of three';

        const evaluationTag3 = document.createElement('div');
        evaluationTag3.className = 'evaluation-tag child-type';
        evaluationTag3.textContent = 'with kids (4-10 yrs old)';

        // 清空 whoSection 内容
        whoSection.innerHTML = '';
        whoSection.appendChild(evaluationTag1);
        whoSection.appendChild(evaluationTag2);
        whoSection.appendChild(evaluationTag3);

        const whoDetailSection = document.getElementById('where-detail-section');
        
        // 定义第一个 detail-child-type 元素
        const mchild1 = document.createElement('div');
        mchild1.className = 'evaluation-tag mchild-type';
        mchild1.textContent = 'D型机身设计';
        const schild1 = document.createElement('div');
        schild1.className = 'evaluation-tag schild-type';
        schild1.textContent = 'Quiet Mode';

        // 将所有元素添加到 whoDetailSection
        whoDetailSection.appendChild(mchild1);
        whoDetailSection.appendChild(schild1);


        // 定义第二个 detail-child-type 元素

        const child1 = document.createElement('div');
        child1.className = 'evaluation-tag child-type';
        child1.textContent = 'APP可区分房间设置';
        const mchild2 = document.createElement('div');
        mchild2.className = 'evaluation-tag mchild-type';
        mchild2.textContent = '圆型机身设计';

        whoDetailSection.appendChild(child1);
        whoDetailSection.appendChild(mchild2);


        const schild2 = document.createElement('div');
        schild2.className = 'evaluation-tag schild-type';
        schild2.textContent = 'Quiet Mode';

        whoDetailSection.appendChild(schild2);



        drawConnectionBetweenTags(evaluationContainer, evaluationTag1, mchild2);
        drawConnectionBetweenTags(evaluationContainer, evaluationTag2, mchild2);

    }

    // Where 部分内容
    const whereSection = document.getElementById('who-section');
    whereSection.innerHTML = '';
    
    const livingRoomDiv = document.createElement('div');
    livingRoomDiv.className = 'evaluation-tag child-type';
    livingRoomDiv.textContent = 'Living room';
    
    const bedroomDiv = document.createElement('div');
    bedroomDiv.className = 'evaluation-tag child-type';
    bedroomDiv.textContent = 'Bedroom';
    
    const livingRoomBedroomDiv = document.createElement('div');
    livingRoomBedroomDiv.className = 'evaluation-tag child-type';
    livingRoomBedroomDiv.textContent = 'Living room + Bedroom';
    
    whereSection.appendChild(livingRoomDiv);
    whereSection.appendChild(bedroomDiv);
    whereSection.appendChild(livingRoomBedroomDiv);

    // Why和What部分可根据需要添加类似内容
}

// 设置事件监听器
function setupEventListeners() {
    // 继续按钮点击事件
    const continueBtn = document.getElementById('continue-btn');
    continueBtn.addEventListener('click', function() {
        // 可以添加页面跳转或表单提交逻辑
                // 继续按钮点击事件
        window.location.href = 'develop.html';
    });
}

function drawConnectionBetweenTags(bigParent, sourceTag, targetTag) {
    // 获取父容器作为SVG绘制区域
    const container = bigParent;
    const containerRect = container.getBoundingClientRect();
    const sourceRect = sourceTag.getBoundingClientRect();
    const targetRect = targetTag.getBoundingClientRect();

    // 创建或获取SVG容器
    let svg = container.querySelector('.connection-svg');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('connection-svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        
        container.style.position = 'relative';
        container.appendChild(svg);
    }

    // 计算边缘连接点（右边缘和左边缘）
    const sourceX = sourceRect.right - containerRect.left;  // 源标签右边缘
    const sourceY = sourceRect.top - containerRect.top + sourceRect.height / 4 * 3;  // 源标签垂直中心
    const targetX = targetRect.left - containerRect.left;  // 目标标签左边缘
    const targetY = targetRect.top - containerRect.top + targetRect.height / 4;  // 目标标签垂直中心

    // 添加源端圆形标记
    const sourceCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sourceCircle.setAttribute('cx', sourceX);
    sourceCircle.setAttribute('cy', sourceY);
    sourceCircle.setAttribute('r', '6');  // 圆形半径
    sourceCircle.setAttribute('fill', '#fff');  // 白色填充
    sourceCircle.setAttribute('stroke', '#999');  // 灰色边框
    sourceCircle.setAttribute('stroke-width', '2');  // 边框宽度
    svg.appendChild(sourceCircle);

    // 添加目标端圆形标记
    const targetCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    targetCircle.setAttribute('cx', targetX);
    targetCircle.setAttribute('cy', targetY);
    targetCircle.setAttribute('r', '6');
    targetCircle.setAttribute('fill', '#fff');
    targetCircle.setAttribute('stroke', '#999');
    targetCircle.setAttribute('stroke-width', '2');

    // 计算曲线控制点（保持曲线平滑）
    const dx = Math.abs(targetX - sourceX) * 0.5;
    const pathData = `M ${sourceX} ${sourceY} C ${sourceX + dx} ${sourceY}, ${targetX - dx} ${targetY}, ${targetX} ${targetY}`;

    // 创建路径
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#999');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-dasharray', '5,3');
    svg.appendChild(path);
    svg.style.zIndex = '99999'; // 添加
}


// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化各部分内容
    initEvaluationSections();
    setupEventListeners();
});

// 初始化评估区域内容
function initEvaluationSections() {
    // Who 部分内容
    if ("who" == "who") {
        const evaluationContainer = document.getElementById('evaluation-container');
        const whoSection = document.getElementById('who-section');
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

        const whoDetailSection = document.getElementById('who-detail-section');
        
        // 定义第一个 detail-child-type 元素
        const detailChild1 = document.createElement('div');
        detailChild1.className = 'evaluation-tag detail-child-type';
        const mchild1 = document.createElement('div');
        mchild1.className = 'evaluation-tag mchild-type';
        mchild1.textContent = 'D型机身设计';
        const schild1 = document.createElement('div');
        schild1.className = 'evaluation-tag schild-type';
        schild1.textContent = 'Quiet Mode';
        detailChild1.appendChild(mchild1);
        detailChild1.appendChild(schild1);

        // 定义第二个 detail-child-type 元素
        const detailChild2 = document.createElement('div');
        detailChild2.className = 'evaluation-tag detail-child-type';
        const child1 = document.createElement('div');
        child1.className = 'evaluation-tag child-type';
        child1.textContent = 'APP可区分房间设置';
        const mchild2 = document.createElement('div');
        mchild2.className = 'evaluation-tag mchild-type';
        mchild2.textContent = '圆型机身设计';
        detailChild2.appendChild(child1);
        detailChild2.appendChild(mchild2);

        // 定义第三个 detail-child-type 元素
        const detailChild3 = document.createElement('div');
        detailChild3.className = 'evaluation-tag detail-child-type';
        const schild2 = document.createElement('div');
        schild2.className = 'evaluation-tag schild-type';
        schild2.textContent = 'Quiet Mode';
        detailChild3.appendChild(schild2);

        // 将所有元素添加到 whoDetailSection
        whoDetailSection.appendChild(detailChild1);
        whoDetailSection.appendChild(detailChild2);
        whoDetailSection.appendChild(detailChild3);

        drawConnectionBetweenTags(evaluationContainer, evaluationTag1, detailChild1);
        drawConnectionBetweenTags(evaluationContainer, evaluationTag2, detailChild2);
        drawConnectionBetweenTags(evaluationContainer, evaluationTag3, detailChild3);

        const whoDesignSection = document.getElementById('who-design-section');
        
        // 创建第一个 design-container
        const designContainer1 = document.createElement('div');
        designContainer1.className = 'design-container';
        
        const designSection1 = document.createElement('div');
        designSection1.className = 'design-section';
        
        const blockTitle1 = document.createElement('div');
        blockTitle1.className = 'evaluation-tag block-title';
        
        const designConfused = document.createElement('div');
        designConfused.className = 'evaluation-tag design-confused';
        designConfused.textContent = '矛盾方案';
        
        const suggestionP1 = document.createElement('p');
        suggestionP1.textContent = '建议替换方案为：';
        
        const solutionContent1 = document.createElement('div');
        solutionContent1.className = 'solution-content';
        
        const designChild1 = document.createElement('div');
        designChild1.className = 'evaluation-tag design-child-type';
        
        const li1 = document.createElement('li');
        li1.textContent = '针对D型机身设计与圆型机身设计的矛盾，建议采用可转换式设计';
        
        const li2 = document.createElement('li');
        li2.textContent = '针对不同房间噪音需求，建议增加房间模式记忆功能';
        
        // 组装第一个 design-container 的元素
        blockTitle1.appendChild(designConfused);
        blockTitle1.appendChild(suggestionP1);
        designChild1.appendChild(li1);
        designChild1.appendChild(li2);
        solutionContent1.appendChild(designChild1);
        designSection1.appendChild(blockTitle1);
        designSection1.appendChild(solutionContent1);
        designContainer1.appendChild(designSection1);
        
        // 创建第二个 design-container
        const designContainer2 = document.createElement('div');
        designContainer2.className = 'design-container';
        
        const designSection2 = document.createElement('div');
        designSection2.className = 'design-section';
        
        const blockTitle2 = document.createElement('div');
        blockTitle2.className = 'evaluation-tag block-title';
        
        const designSimilar = document.createElement('div');
        designSimilar.className = 'evaluation-tag design-similar';
        designSimilar.textContent = '相似方案';
        
        const suggestionP2 = document.createElement('p');
        suggestionP2.textContent = '建议替换方案为：';
        
        const solutionContent2 = document.createElement('div');
        solutionContent2.className = 'solution-content';
        
        const designChild2 = document.createElement('div');
        designChild2.className = 'evaluation-tag design-child-type';
        
        const li3 = document.createElement('li');
        li3.textContent = '将APP房间设置与Quiet Mode融合，实现分区静音控制';
        
        const li4 = document.createElement('li');
        li4.textContent = '结合不同用户群体需求，设计可调节的机身面板';
        
        // 组装第二个 design-container 的元素
        blockTitle2.appendChild(designSimilar);
        blockTitle2.appendChild(suggestionP2);
        designChild2.appendChild(li3);
        designChild2.appendChild(li4);
        solutionContent2.appendChild(designChild2);
        designSection2.appendChild(blockTitle2);
        designSection2.appendChild(solutionContent2);
        designContainer2.appendChild(designSection2);
        
        // 将两个 design-container 添加到 whoDesignSection
        whoDesignSection.innerHTML = '';
        whoDesignSection.appendChild(designContainer1);
        whoDesignSection.appendChild(designContainer2);

        drawConnectionBetweenTags(evaluationContainer, schild1, designContainer2);
        drawConnectionBetweenTags(evaluationContainer, schild2, designContainer2);
        drawConnectionBetweenTags(evaluationContainer, mchild1, designContainer1);
        drawConnectionBetweenTags(evaluationContainer, mchild2, designContainer1);
    }

    // Where 部分内容
    const whereSection = document.getElementById('where-section');
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
        alert('Evaluation completed!');
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
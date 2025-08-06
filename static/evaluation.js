// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化各部分内容
    initEvaluationSections();
    setupEventListeners();
});

// 初始化评估区域内容
function initEvaluationSections() {
    // Who 部分内容w
    fetch("/api/data")
    .then(response => response.json())
    .then(data => {
        const needData = data['evaluationData'];
        const dimensionList = [
            "where",
            "when",    
            "why",
            "who"
        ]
        const solutionContainer = document.getElementById('solution-detail-section');
        const evaluationContainer = document.getElementById('evaluation-container');
        dimensionList.forEach(dimension => {
            // alert(dimension)
            const dimensionSection = document.getElementById(dimension + '-section');
            dimensionSection.innerHTML = '';
            const sectionData = needData[dimension];
            sectionData.forEach(pItemsArray => {
                pItemsArray.forEach(pItem => {
                    const evaluationTag = document.createElement('div');
                    evaluationTag.className = 'evaluation-tag child-type';
                    evaluationTag.textContent = pItem.text;
                    dimensionSection.appendChild(evaluationTag);
                    if(pItem.subItems && pItem.subItems.length) {
                        pItem.subItems.forEach(subItem => {
                            const evaluationTagS = document.createElement('div');
                            evaluationTagS.className = 'evaluation-tag child-type';
                            evaluationTagS.textContent = subItem.text;
                            solutionContainer.appendChild(evaluationTagS);
                            if (Math.random() < 0.3) {
                                drawConnectionBetweenTags(evaluationContainer, evaluationTag, evaluationTagS);
                            }
                        })
                    }
                });
            });
            // evaluationContainer.appendChild(dimensionSection);
        });

    })

    {
    //     // 创建第一个 design-container
    //     const designContainer1 = document.createElement('div');
    //     designContainer1.className = 'design-container';
        
    //     const designSection1 = document.createElement('div');
    //     designSection1.className = 'design-section';
        
    //     const blockTitle1 = document.createElement('div');
    //     blockTitle1.className = 'evaluation-tag block-title';
        
    //     const designConfused = document.createElement('div');
    //     designConfused.className = 'evaluation-tag design-confused';
    //     designConfused.textContent = '矛盾方案';
        
    //     const suggestionP1 = document.createElement('p');
    //     suggestionP1.textContent = '建议替换方案为：';
        
    //     const solutionContent1 = document.createElement('div');
    //     solutionContent1.className = 'solution-content';
        
    //     const designChild1 = document.createElement('div');
    //     designChild1.className = 'evaluation-tag design-child-type';
        
    //     const li1 = document.createElement('li');
    //     li1.textContent = '针对D型机身设计与圆型机身设计的矛盾，建议采用可转换式设计';
        
    //     const li2 = document.createElement('li');
    //     li2.textContent = '针对不同房间噪音需求，建议增加房间模式记忆功能';
        
    //     // 组装第一个 design-container 的元素
    //     blockTitle1.appendChild(designConfused);
    //     blockTitle1.appendChild(suggestionP1);
    //     designChild1.appendChild(li1);
    //     designChild1.appendChild(li2);
    //     solutionContent1.appendChild(designChild1);
    //     designSection1.appendChild(blockTitle1);
    //     designSection1.appendChild(solutionContent1);
    //     designContainer1.appendChild(designSection1);
        
    //     // 创建第二个 design-container
    //     const designContainer2 = document.createElement('div');
    //     designContainer2.className = 'design-container';
        
    //     const designSection2 = document.createElement('div');
    //     designSection2.className = 'design-section';
        
    //     const blockTitle2 = document.createElement('div');
    //     blockTitle2.className = 'evaluation-tag block-title';
        
    //     const designSimilar = document.createElement('div');
    //     designSimilar.className = 'evaluation-tag design-similar';
    //     designSimilar.textContent = '相似方案';
        
    //     const suggestionP2 = document.createElement('p');
    //     suggestionP2.textContent = '建议替换方案为：';
        
    //     const solutionContent2 = document.createElement('div');
    //     solutionContent2.className = 'solution-content';
        
    //     const designChild2 = document.createElement('div');
    //     designChild2.className = 'evaluation-tag design-child-type';
        
    //     const li3 = document.createElement('li');
    //     li3.textContent = '将APP房间设置与Quiet Mode融合，实现分区静音控制';
        
    //     const li4 = document.createElement('li');
    //     li4.textContent = '结合不同用户群体需求，设计可调节的机身面板';
        
    //     // 组装第二个 design-container 的元素
    //     blockTitle2.appendChild(designSimilar);
    //     blockTitle2.appendChild(suggestionP2);
    //     designChild2.appendChild(li3);
    //     designChild2.appendChild(li4);
    //     solutionContent2.appendChild(designChild2);
    //     designSection2.appendChild(blockTitle2);
    //     designSection2.appendChild(solutionContent2);
    //     designContainer2.appendChild(designSection2);
        
    //     // 将两个 design-container 添加到 whoDesignSection
    //     whoDesignSection.innerHTML = '';
    //     whoDesignSection.appendChild(designContainer1);
    //     whoDesignSection.appendChild(designContainer2);

    //     drawConnectionBetweenTags(evaluationContainer, schild1, designContainer2);
    //     drawConnectionBetweenTags(evaluationContainer, schild2, designContainer2);
    //     drawConnectionBetweenTags(evaluationContainer, mchild1, designContainer1);
    //     drawConnectionBetweenTags(evaluationContainer, mchild2, designContainer1);
    // }

    // // Where 部分内容
    // const whereSection = document.getElementById('who-section');
    // whereSection.innerHTML = '';
    
    // const livingRoomDiv = document.createElement('div');
    // livingRoomDiv.className = 'evaluation-tag child-type';
    // livingRoomDiv.textContent = 'Living room';
    
    // const bedroomDiv = document.createElement('div');
    // bedroomDiv.className = 'evaluation-tag child-type';
    // bedroomDiv.textContent = 'Bedroom';
    
    // const livingRoomBedroomDiv = document.createElement('div');
    // livingRoomBedroomDiv.className = 'evaluation-tag child-type';
    // livingRoomBedroomDiv.textContent = 'Living room + Bedroom';
    
    // whereSection.appendChild(livingRoomDiv);
    // whereSection.appendChild(bedroomDiv);
    // whereSection.appendChild(livingRoomBedroomDiv);

    // Why和What部分可根据需要添加类似内容
    }
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
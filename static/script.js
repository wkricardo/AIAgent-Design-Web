document.addEventListener('DOMContentLoaded', () => {
    // 页面导航功能
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            window.location.href = 'develop.html';
        });
    }

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }

    // 修改页面初始化逻辑
    if (window.location.pathname.includes('compare.html')) {
        renderComparisonPage();
    } else if (window.location.pathname.includes('develop.html')) {
        initDevelopPage();
    } else if (window.location.pathname.includes('solution.html')) {
        renderSolutionPage();
                // 调用函数绘制图表
        drawIterationChart();
    }
    else {
        initMainPage();
    }

    function initMainPage() {
        const productNameInput = document.getElementById('product-name');
        const personaContainer = document.getElementById('persona-container');
        const painPointsContainer = document.getElementById('painPoints-container');
        const usageLocationsContainer = document.getElementById('usageLocations-container');
        const addButtons = document.querySelectorAll('.add-btn');
        const continueBtn = document.getElementById('continue-btn');

        // 加载数据
        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                productNameInput.value = data.productName || '';
                renderTags(personaContainer, data.persona || [], 'persona');
                renderTags(painPointsContainer, data.painPoints || [], 'painPoints');
                renderTags(usageLocationsContainer, data.usageLocations || [], 'usageLocations');
            });

        // 渲染标签
        function renderTags(container, tags, section) {
            container.innerHTML = '';
            tags.forEach(tagText => {
                const tagElement = document.createElement('div');
                tagElement.className = 'tag';
                tagElement.textContent = tagText;
                
                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-tag';
                removeBtn.textContent = '×';
                removeBtn.addEventListener('click', () => {
                    removeTag(section, tagText);
                });
                
                tagElement.appendChild(removeBtn);
                container.appendChild(tagElement);

                // 双击编辑标签
                tagElement.addEventListener('dblclick', () => {
                    const newText = prompt('Edit tag:', tagText);
                    if (newText && newText.trim() && newText !== tagText) {
                        editTag(section, tagText, newText.trim());
                    }
                });
            });
        }

        // 添加标签
        addButtons.forEach(button => {
            button.addEventListener('click', () => {
                const section = button.dataset.section;
                const newTag = prompt('Enter new tag:');
                if (newTag && newTag.trim()) {
                    addTag(section, newTag.trim());
                }
            });
        });

        // 保存数据到后端
        function saveData() {
            const data = {
                productName: productNameInput.value,
                persona: getTagsFromContainer(personaContainer),
                painPoints: getTagsFromContainer(painPointsContainer),
                usageLocations: getTagsFromContainer(usageLocationsContainer)
            };

            fetch('/api/data', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }

        // 从容器获取标签
        function getTagsFromContainer(container) {
            return Array.from(container.querySelectorAll('.tag'))
                .map(tagElement => tagElement.firstChild.textContent.trim());
        }

        // 添加标签
        function addTag(section, tagText) {
            fetch('/api/data')
                .then(response => response.json())
                .then(data => {
                    data[section].push(tagText);
                    return fetch('/api/data', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                })
                .then(() => {
                    // 重新加载数据
                    fetch('/api/data')
                        .then(response => response.json())
                        .then(data => {
                            renderTags(document.getElementById(`${section}-container`), data[section], section);
                        });
                });
        }

        // 删除标签
        function removeTag(section, tagText) {
            fetch('/api/data')
                .then(response => response.json())
                .then(data => {
                    data[section] = data[section].filter(tag => tag !== tagText);
                    return fetch('/api/data', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                })
                .then(() => {
                    // 重新加载数据
                    fetch('/api/data')
                        .then(response => response.json())
                        .then(data => {
                            renderTags(document.getElementById(`${section}-container`), data[section], section);
                        });
                });
        }

        // 编辑标签
        function editTag(section, oldText, newText) {
            fetch('/api/data')
                .then(response => response.json())
                .then(data => {
                    const index = data[section].indexOf(oldText);
                    if (index !== -1) {
                        data[section][index] = newText;
                        return fetch('/api/data', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
                    }
                })
                .then(() => {
                    // 重新加载数据
                    fetch('/api/data')
                        .then(response => response.json())
                        .then(data => {
                            renderTags(document.getElementById(`${section}-container`), data[section], section);
                        });
                });
        }

        // 产品名称变化时保存
        productNameInput.addEventListener('change', saveData);

        // 继续按钮点击事件
        continueBtn.addEventListener('click', () => {
            window.location.href = 'compare.html';
        });
    }

    // 渲染产品对比页面
    function renderComparisonPage() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        // 加载产品数据
        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                const products = data.comparisonProducts || [];
                productsGrid.innerHTML = '';

                products.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `<h3>${product.name}</h3><img src="static/${product.image}" class="product-image" alt="${product.name} image">`;

                    // 定义需要展示的特性区域
                    const sections = [
                        { title: 'Persona', data: product.persona, type: 'persona' },
                        { title: 'Location', data: product.location, type: 'location' },
                        { title: 'Requirements', data: product.requirements, type: 'requirements' }
                    ];

                    sections.forEach(section => {
                        if (!section.data || !section.data.length) return;

                        // 创建特性区域容器（带独立方框样式）
                        const sectionEl = document.createElement('div');
                        sectionEl.className = `product-feature-section ${section.type}-section`;
                        sectionEl.innerHTML = `<h4>${section.title}</h4>`;

                        // 创建P类型主选项容器
                        const pContainer = document.createElement('div');
                        pContainer.className = 'p-container';

                        // 处理P和S的归属关系
                        section.data.forEach(item => {
                            // P类型主选项
                            if (item.type === 'P') {
                                const pTag = document.createElement('div');
                                pTag.className = 'selectable-tag p-type';
                                pTag.innerHTML = `
                                    <span class="ptag-content">${item.text}</span>
                                    <span class="tag-badge">P</span>
                                `;
                                pTag.addEventListener('click', () => pTag.classList.toggle('selected'));

                                // S类型子选项容器
                                const sContainer = document.createElement('div');
                                sContainer.className = 's-container';

                                // 查找并添加归属当前P的S选项
                                if (item.subItems && item.subItems.length) {
                                    item.subItems.forEach(subItem => {
                                    if (subItem.type === 'S') {
                                        const sTag = document.createElement('div');
                                        sTag.className = 'selectable-tag s-type';
                                        sTag.innerHTML = `
                                            <span class="stag-content">${subItem.text}</span>
                                            <span class="tag-badge">S</span>
                                        `;
                                        sTag.addEventListener('click', () => sTag.classList.toggle('selected'));
                                        sContainer.appendChild(sTag);

                                        // 添加没有满足情况
                                        if (subItem.unmet && subItem.unmet.length) {
                                            const unmetContainer = document.createElement('div');
                                            unmetContainer.className = 'unmet-requirements';
                                            unmetContainer.innerHTML = '<div class="unmet-label">Not meeting: </div>';
                                            subItem.unmet.forEach(unmet => {
                                                const unmetTag = document.createElement('span');
                                                unmetTag.className = 'unmet-tag';
                                                unmetTag.textContent = unmet;
                                                unmetContainer.appendChild(unmetTag);
                                            });
                                            sContainer.appendChild(unmetContainer);
                                        }
                            }
                        });
                                }

                                pTag.appendChild(sContainer);
                                pContainer.appendChild(pTag);
                            }
                        });

                        sectionEl.appendChild(pContainer);
                        card.appendChild(sectionEl);
                    });

                    productsGrid.appendChild(card);
                });
            });
        }

        // Next按钮事件
        document.getElementById('next-btn')?.addEventListener('click', () => {
            window.location.href = 'develop.html';
        });
    });

    // 渲染标签
    function renderTags(container, tags, section) {
        container.innerHTML = '';
        tags.forEach(tagText => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.textContent = tagText;
            
            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove-tag';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => {
                removeTag(section, tagText);
            });
            
            tagElement.appendChild(removeBtn);
            container.appendChild(tagElement);

            // 双击编辑标签
            tagElement.addEventListener('dblclick', () => {
                const newText = prompt('Edit tag:', tagText);
                if (newText && newText.trim() && newText !== tagText) {
                    editTag(section, tagText, newText.trim());
                }
            });
        });
    }

    // 添加标签
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;
            const newTag = prompt('Enter new tag:');
            if (newTag && newTag.trim()) {
                addTag(section, newTag.trim());
            }
        });
    });

    // 保存数据到后端
    function saveData() {
        const data = {
            productName: productNameInput.value,
            persona: getTagsFromContainer(personaContainer),
            painPoints: getTagsFromContainer(painPointsContainer),
            usageLocations: getTagsFromContainer(usageLocationsContainer)
        };

        fetch('/api/data', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    // 从容器获取标签
    function getTagsFromContainer(container) {
        return Array.from(container.querySelectorAll('.tag'))
            .map(tagElement => tagElement.firstChild.textContent.trim());
    }

    // 添加标签
    function addTag(section, tagText) {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                data[section].push(tagText);
                return fetch('/api/data', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            })
            .then(() => {
                // 重新加载数据
                fetch('/api/data')
                    .then(response => response.json())
                    .then(data => {
                        renderTags(document.getElementById(`${section}-container`), data[section], section);
                    });
            });
    }

    // 删除标签
    function removeTag(section, tagText) {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                data[section] = data[section].filter(tag => tag !== tagText);
                return fetch('/api/data', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            })
            .then(() => {
                // 重新加载数据
                fetch('/api/data')
                    .then(response => response.json())
                    .then(data => {
                        renderTags(document.getElementById(`${section}-container`), data[section], section);
                    });
            });
    }

    // 编辑标签
    function editTag(section, oldText, newText) {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                const index = data[section].indexOf(oldText);
                if (index !== -1) {
                    data[section][index] = newText;
                    return fetch('/api/data', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                }
            })
            .then(() => {
                // 重新加载数据
                fetch('/api/data')
                    .then(response => response.json())
                    .then(data => {
                        renderTags(document.getElementById(`${section}-container`), data[section], section);
                    });
            });
    }

    // 产品名称变化时保存
    productNameInput.addEventListener('change', saveData);

    // 继续按钮点击事件
continueBtn.addEventListener('click', () => {
    window.location.href = 'compare.html';
});


// 渲染Develop页面数据
function renderDevelopPage() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            // 获取developProducts数组，默认空数组
            const mdevelopProducts = data.developProducts || [];
            // 遍历所有卡片区域
            document.querySelectorAll('.card').forEach(card => {
                const cardHeader = card.querySelector('.card-header');
                const container = card.querySelector('.develop-tag-container');
                const cardName = cardHeader.dataset.section;
                // // 检查必要DOM元素是否存在
                if (!cardHeader || !container) return;
                // 获取data-section属性值作为数据键名
                const sectionKey = cardHeader.dataset.section;
                if (!sectionKey) return; 

                const sectionData = mdevelopProducts[cardName];
                // 创建P类型主选项容器
                const pContainer = document.createElement('div');
                pContainer.className = 'develop-p-container';
                // alert(data.developProducts.location)
                // 遍历sectionData中的每个P类型数组
                sectionData.forEach(pItemsArray => {
                    // 遍历数组中的每个P类型项
                    pItemsArray.forEach(pItem => {
                        if (pItem.type === 'P') {
                            // 创建P类型项容器
                            const pTag = document.createElement('div');
                            pTag.className = 'develop-tag p-type';
                            pTag.innerHTML = `
                                <span class="ptag-content">${pItem.text}</span>
                                <span class="tag-badge">P</span>
                            `;
                            
                            // 创建S类型子项容器
                            const sContainer = document.createElement('div');
                            sContainer.className = 's-container';
                            
                            // 处理S类型子项
                            if (pItem.subItems && pItem.subItems.length) {
                                pItem.subItems.forEach(subItem => {
                                    if (subItem.type === 'S') {
                                        const sTag = document.createElement('div');
                                        sTag.className = 'develop-tag s-type';
                                        sTag.innerHTML = `
                                            <span class="stag-content">${subItem.text}</span>
                                            <span class="tag-badge">S</span>
                                        `;
                                        sContainer.appendChild(sTag);
                                    }
                                });
                            }

                            const newpTag = document.createElement('div');
                            newpTag.className = 'develop-tag p-type';
                            newpTag.innerHTML = `
                                <span class="ptag-content">${'New Problem'}</span>
                                <span class="tag-badge">P</span>
                            `;
                            const newPTagList = document.createElement('div');
                            newPTagList.className = 'develop-newptaglist';
                            for (let i = 0; i < 3; i++) {
                                const newPTag = document.createElement('div');
                                newPTag.className = 'develop-newptag';
                                newPTag.innerHTML = `
                                <div class="select-checkbox"></div>
                                <div class="option-text-container">
                                    <span class="main-text">${'角落结构不一'}</span>
                                    <span class="sub-text">${'固定延展长度或角度无法通用'}</span>
                                </div>
                                `;
                                newPTagList.appendChild(newPTag);
                            }
                            newpTag.appendChild(newPTagList);
                            
                            // 将S容器添加到P项，P项添加到卡片容器
                            pTag.appendChild(sContainer);
                            pContainer.appendChild(pTag);
                            pContainer.appendChild(newpTag);
                            container.appendChild(pContainer);

                            const checkboxes = newpTag.querySelectorAll('.select-checkbox');
                            checkboxes.forEach(checkbox => {
                                checkbox.addEventListener('click', function() {
                                    this.classList.toggle('checked');
                                    // 可选：更新数据模型中的选中状态
                                    pItem.selected = this.classList.contains('checked');
                                    saveDataToServer();
                                });
                            });
                        }
                    });
                });
            });
            
            // 重新绑定事件监听器
            bindDevelopPageEvents();
        });
        document.getElementById('generate-btn')?.addEventListener('click', () => {
            window.location.href = 'solution.html';
        });
}

// 绑定Develop页面事件
function bindDevelopPageEvents() {
    // 为所有添加按钮添加事件监听
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', function() {
            const cardHeader = this.closest('.card-header');
            const section = cardHeader ? cardHeader.dataset.section : 'persona';
            const pItem = this.closest('.p-type');
            const sContainer = this.closest('.s-container');

            // 判断是添加P类型还是S类型
            if (this.closest('.card-header')) {
                addPTypeItem(section);
            } else if (sContainer) {
                addSTypeItem(section, pItem.querySelector('.ptag-content').textContent);
            }
        });
    });

    // 为所有删除按钮添加事件监听
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const sType = this.closest('.s-type');
            const pType = this.closest('.p-type');
            const card = this.closest('.card');
            const section = card.querySelector('.card-header').dataset.section;

            if (sType) {
                const pItemText = sType.closest('.p-type').querySelector('.ptag-content').textContent;
                const sItemText = sType.querySelector('.stag-content').textContent;
                removeSTypeItem(section, pItemText, sItemText);
            } else if (pType) {
                const pItemText = pType.querySelector('.ptag-content').textContent;
                removePTypeItem(section, pItemText);
            }
        });
    });
}

// 修改初始化Develop页面函数
function initDevelopPage() {
    renderDevelopPage();
}

// 添加P类型项
function addPTypeItem(section) {
    const newText = prompt(`Enter new ${section} P type item:`);
    if (!newText || !newText.trim()) return;

    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            // 确保section数组存在
            if (!data[section]) data[section] = [];

            // 添加新的P类型项
            data[section].push({
                text: newText.trim(),
                type: 'P',
                subItems: []
            });

            return saveDataToServer(data);
        })
        .then(() => refreshDevelopPage());
}

// 添加S类型项
function addSTypeItem(section, parentText) {
    const newText = prompt(`Enter new ${section} S type item:`);
    if (!newText || !newText.trim()) return;

    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            // 找到对应的P类型项
            const pItem = data[section].find(item => item.text === parentText && item.type === 'P');
            if (pItem) {
                // 确保subItems数组存在
                if (!pItem.subItems) pItem.subItems = [];
                // 添加新的S类型项
                pItem.subItems.push({
                    text: newText.trim(),
                    type: 'S',
                    unmet: []
                });
            }

            return saveDataToServer(data);
        })
        .then(() => refreshDevelopPage());
}

// 删除P类型项
function removePTypeItem(section, itemText) {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            data[section] = data[section].filter(item => !(item.text === itemText && item.type === 'P'));
            return saveDataToServer(data);
        })
        .then(() => refreshDevelopPage());
}

// 删除S类型项
function removeSTypeItem(section, parentText, itemText) {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            const pItem = data[section].find(item => item.text === parentText && item.type === 'P');
            if (pItem && pItem.subItems) {
                pItem.subItems = pItem.subItems.filter(subItem => !(subItem.text === itemText && subItem.type === 'S'));
            }
            return saveDataToServer(data);
        })
        .then(() => refreshDevelopPage());
}

// 保存数据到服务器
function saveDataToServer(data) {
    return fetch('/api/data', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

// 刷新Develop页面
function refreshDevelopPage() {
    window.location.reload();
}

function renderSolutionPage() {
    // 填充方案描述
    const solutionDescription = document.getElementById('solution-description');
    solutionDescription.innerHTML = `
        <p>这是一款面向一线/新一线城市三口之家设计的智能扫地机器人，支持卧室与客厅分区清扫，具备高角落覆盖率与安静运行能力。</p>
        <p>产品采用D型机身设计与伸缩侧刷结构，以增强边角能力，改善床脚与墙角的清扫效果，同时通过自动切换吸力与路径适应不同房间地面与家具布局。</p>
        <p>系统内置Quiet Mode与自适应息间调度，孩子在休息时段以低噪音运行，减少干扰。针对杂乱玩具等常见家庭障碍物，产品搭配障碍识别与路径回补策略，提升清洁完整度与稳定性。</p>
    `;

    // 填充评估指标
    const assessmentMetrics = document.getElementById('assessment-metrics');
    assessmentMetrics.innerHTML = `
        <div class="metric-item">
            <h4>Persona</h4>
            <div class="metric-status">发展幅度小，建议重点发散</div>
        </div>
        <div class="metric-item">
            <h4>Location</h4>
            <div class="metric-status">还处于发展阶段，建议继续发展</div>
        </div>
        <div class="metric-item">
            <h4>Requirements</h4>
            <div class="metric-status">保持迭代，建议观察是否收敛</div>
        </div>
    `;

    // // 绘制迭代评估图表
    // const canvas = document.getElementById('iteration-chart');
    // const ctx = canvas.getContext('2d');
    // drawIterationChart();

    // 绑定Next按钮事件
    document.getElementById('next-btn').addEventListener('click', () => {
        window.location.href = 'next-page.html';
    });
}

function drawIterationChart() {
    // 清除现有图表
    d3.select("#iteration-chart").selectAll("*").remove();

    // 图表数据
    const data = [
        [
            { x: 1.2, y: 4 }, 
            { x: 1.5, y: 3 }, 
            { x: 2.5, y: 2 }, 
            { x: 3, y: 1 }, 
            { x: 4, y: 0 }
        ],
        [
            { x: 1.3, y: 4 }, 
            { x: 2.1, y: 3 }, 
            { x: 3.3, y: 2 }, 
            { x: 5, y: 1 }, 
            { x: 6, y: 0 }
        ],
        [
            { x: 2.3, y: 4 }, 
            { x: 3.1, y: 3 }, 
            { x: 4.3, y: 2 }, 
            { x: 6, y: 1 }, 
            { x: 7, y: 0 }
        ],
        [
            { x: 2.3, y: 4 }, 
            { x: 3.1, y: 3 }, 
            { x: 4.3, y: 2 }, 
            { x: 7, y: 1 }, 
            { x: 8, y: 0 }
        ],
        [
            { x: 2.3, y: 4 }, 
            { x: 4.1, y: 3 }, 
            { x: 5.3, y: 2 }, 
            { x: 9, y: 1 }, 
            { x: 12, y: 0 }
        ],
    ];

    // 图表尺寸和边距
    const margin = { top: 40, right: 30, bottom: 60, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const curvecolorList = ["#347fc4", "#3c83c4", "#4487c4", "#4c8bc4", "#548fc4", "#5c93c4", "#6497c4", "#6b9ac4"];
    const areacolorList = ["#a5c8e4", "#accce6", "#b3d0e8", "#bad4ea", "#c1d8ec", "#c8dcef", "#cfdcf2", "#d6e6f2"];
    const pointcolorList = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f"];
    // 创建SVG容器
    const svg = d3.select("#iteration-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 创建X轴比例尺
    const xScale = d3.scaleLinear()
        .domain([-0.3, d3.max(data, d => d3.max(d, p => p.x)) + 1])
        .range([0, width]);

    // 创建Y轴比例尺
    const yScale = d3.scaleLinear()
        .domain([-0.3, 4.3])
        .range([height, 0]);
    const tickValues = [];
    data.forEach(xy => {
        tickValues.push(xy[xy.length - 1].x);
    });
    // 添加X轴 - 不显示刻度尺
    const xAxisGroup = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickValues(tickValues).tickFormat((d, i) => {
            const labels = ["S", "S(t+1)", "S(t+2)", "S(t+3)", "S(t+4)", "S(t+5)", "S(t+6)", "S(t+7)", "S(t+8)"];
            return labels[i] || "";
        }).tickSize(0));  // 设置刻度线长度为0，隐藏X轴刻度尺

    // 增大X轴标签字体大小
    xAxisGroup.selectAll(".tick text")
        .style("font-size", "24px");

    // 隐藏X轴轴线（上边框）
    xAxisGroup.selectAll(".domain")
        .style("display", "none");
    
    // 添加Y轴 - P1最小(底部)，P5最大(顶部)，并显示网格线
    const yAxisGroup = svg.append("g")
        .call(d3.axisLeft(yScale).tickValues([0, 1, 2, 3, 4])
            .tickFormat((d, i) => {
                const labels = ["P1", "P2", "P3", "P4", "P5"];  // 调整为正序
                return labels[i] || "r";
            })
            .tickSize(-width));  // 添加Y轴网格线
    // 隐藏X轴轴线（上边框）
    yAxisGroup.selectAll(".domain")
        .style("display", "none");
    // 修改Y轴网格线为虚线
    yAxisGroup.selectAll(".tick line")
        .style("stroke-dasharray", "5,5")
        .style("stroke-opacity", 0.7);
        
    yAxisGroup.selectAll(".tick line")
    .filter((d, i) => d === 4.3) // 筛选顶部的P5网格线
    .style("display", "none");

    yAxisGroup.selectAll(".tick text")
        .style("font-size", "24px");
    
    data.forEach((xy, index) => {
        // alert(xy)
        // 添加当前迭代曲线区域（以Y轴为底）
        svg.append("path")
        .datum(xy)  
        .attr("fill", areacolorList[index])
        .attr("opacity", 0.5)
        .attr("d", d3.area()
            .y(d => yScale(d.y))
            .x0(0)  // 从Y轴开始填充
            .x1(d => xScale(d.x))  // 到曲线的X值结束
            .curve(d3.curveMonotoneX));

        // 添加当前迭代曲线
        svg.append("path")
            .datum(xy)
            .attr("fill", "none")
            .attr("stroke", curvecolorList[index])
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y))
                .curve(d3.curveMonotoneX));
                
        if (index === 0) {
            svg.selectAll("circle.current")
                .data(xy)
                .enter()
                .append("circle")
                .attr("class", "current")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 6)
                .attr("fill", pointcolorList[index])
                .style("stroke", "white") // 加白色边框，增强可见性
                .style("stroke-width", 1.5);
        }
        else {
            svg.selectAll(`circle.cs${index}`)
                .data(xy)
                .enter()
                .append("circle")
                .attr("class", `cs${index}`)
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 6)
                .attr("fill", pointcolorList[index])
                .style("stroke", "white") // 加白色边框，增强可见性
                .style("stroke-width", 1.5);
        }

        if (index === data.length - 2) {
        // 添加标签
            svg.append("text")
                .attr("x", xScale(1))
                .attr("y", yScale(4) - 15)
                .attr("text-anchor", "middle")
                .attr("class", "label")
                .text("当前迭代");
        }
        else if (index === data.length - 1) {   
            svg.append("text")
                .attr("x", xScale(2))
                .attr("y", yScale(4) - 15)
                .attr("text-anchor", "middle")
                .attr("class", "label")
                .text("下一轮迭代建议");
        };
    });

}




document.addEventListener('DOMContentLoaded', () => {
    // 页面导航功能
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            window.location.href = 'static/develop.html';
        });
    }

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }

    // 根据页面路径初始化不同功能
    if (window.location.pathname.includes('compare.html')) {
        renderComparisonPage();
    } else {
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
            window.location.href = 'static/compare.html';
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
            alert('Proceeding to next step...');
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
    window.location.href = '/static/compare.html';
});
document.addEventListener('DOMContentLoaded', function() {
    // 初始化各部分内容
    renderDevelopPage();

    document.getElementById('continue-btn')?.addEventListener('click', () => {
        window.location.href = 'evaluation.html';
    })
});

// 渲染Develop页面数据
function renderDevelopPage() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            // 获取developProducts数组，默认空数组
            const mdevelopProducts = data.evaluationData || [];
            // alert(mdevelopProducts['who'])
            // 遍历所有卡片区域
            document.querySelectorAll('.card').forEach((card, i) => {
                const cardHeader = card.querySelector('.card-header');
                const container = card.querySelector('.tag-container');
                const cardName = cardHeader.dataset.section;
                // // 检查必要DOM元素是否存在
                if (!cardHeader || !container) return;
                // 获取data-section属性值作为数据键名
                // alert(cardName)
                const sectionData = mdevelopProducts[cardName];
                // 创建P类型主选项容器
                const pContainer = document.createElement('div');
                pContainer.className = 'develop-p-container';
                sectionData.forEach((pItemsArray, index) => {
                    // 遍历数组中的每个P类型项
                    pItemsArray.forEach((pItem, pIndex) => {
                        const pTag = document.createElement('div');
                        if (pItem.type === 'P') {
                            // 创建P类型项容器
                            pTag.className = 'develop-tag explore-p-type ';
                            const ptitlepTag = document.createElement('div');
                            ptitlepTag.className = 'ptitlep-tag';
                            ptitlepTag.innerHTML = `
                                <span class="ptag-content">${pItem.text}</span>
                                <span class="ptype tag-badge">P</span>
                            `;
                            pTag.appendChild(ptitlepTag);
                        }
                        else if (pItem.type === 'M') {
                            pTag.className = 'develop-tag umet-type';
                            pTag.innerHTML = `
                                <span class="ptag-content">${pItem.text}</span>
                                <span class="tag-badge">P</span>
                            `;
                        }

                        // 创建S类型子项容器
                        const sContainer = document.createElement('div');
                        sContainer.className = 'explore-s-container';


                        for (let i = 0; i < 3; i++) {                           // 处理S类型子项
                            if (pItem.subItems && pItem.subItems.length) {
                                pItem.subItems.forEach(subItem => {
                                    if (subItem.type === 'S') {
                                        const sTag = document.createElement('div');
                                        sTag.className = 'develop-tag s-type';
                                        if (Math.random() < 0.3) {
                                            sTag.innerHTML = `
                                                <div class="pnsselect-checkbox"></div>
                                                <span class="stag-content">${subItem.text}</span>
                                                <span class="tag-badge">AI</span>
                                            `;
                                        }
                                        else {
                                            sTag.innerHTML = `
                                                <div class="pnsselect-checkbox"></div>
                                                <span class="stag-content">${subItem.text}</span>
                                            `;
                                        }

                                        sContainer.appendChild(sTag);
                                    }
                                });
                            }
                        }


                        const addButton = document.createElement('div');
                        addButton.innerHTML = `
                            <button class="plus-btn">+</button>
                        `;

                        sContainer.appendChild(addButton);


                        if (pItem.priority === 1) {
                            pTag.appendChild(sContainer);
                            // newpTag.querySelector('.develop-tag.onlyp-type.close-btn').style.display = 'none';
                            pContainer.appendChild(pTag);
                            container.appendChild(pContainer);
                        }
                        else {
                            pTag.appendChild(sContainer);
                            pContainer.appendChild(pTag);
                            container.appendChild(pContainer); 
                        }

                        const checkboxes = pTag.querySelectorAll('.pnsselect-checkbox');
                        checkboxes.forEach(checkbox => {
                            checkbox.addEventListener('click', function() {
                                this.classList.toggle('checked');
                            });
                        });

                        const deleteStags = sContainer.querySelectorAll('.develop-tag.umet-type.close-btn');
                        if (deleteStags) {
                            deleteStags.forEach(deleteStag => {
                                deleteStag.addEventListener('click', () => {
                                    deleteStag.parentElement.remove();
                                    data.developProducts[cardName][index][pIndex]["subItems"].splice(deleteStag.parentElement.index, 1);
                                    saveDataToServer(data);
                                })
                            })
                        }

                    });
                });
            });
            

        });



}
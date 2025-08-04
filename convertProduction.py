
import json
from openai import OpenAI
from apikey import API_KEY

client = OpenAI(api_key=API_KEY, base_url="https://api.deepseek.com")

def convert_product(product):
    """将原始产品数据转换为解决方案中心格式"""
    prompt = f"""
    请将以下扫地机器人产品数据转换为解决方案中心格式：
    {json.dumps(product, indent=2)}

    转换要求：
    1. 创建"solutions"数组，每个解决方案包含：
    - problem: 20字内明确痛点
    - solution: 30字内产品解决方案
    - scenarios: 3-5个中文场景标签
    - evidence: 引用的原始数据证据
    2. features改为简洁中文描述
    3. pros聚焦用户收益，用解决xxx问题句式
    4. 添加best_for字段(3-5个目标用户标签)
    5. 保留原始id和product_name

    输出纯JSON格式，不要额外文本。
    """
    
    response = client.chat.completions.create(
        model="deepseek-reasoner",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.1
    )
    return json.loads(response.choices[0].message.content)

# 批量转换示例
original_data = json.load(open("Robotvacuumcleaner.json"))
converted_products = [convert_product(p) for p in original_data["products"]]

# 保存结果
with open("converted_products.json", "w", encoding="utf-8") as f:
    json.dump({"products": converted_products}, f, indent=2, ensure_ascii=False)
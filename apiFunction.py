from httpx import get
from apikey import API_KEY
from openai import OpenAI
from itertools import count
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import requests
import os

def getDesignTaskTags(productName, designTask):
    system_prompt = """
    你需要解析用户提供的产品名称和自然语言版 Design Task 描述，从中提取 Who（目标对象 / 人群）、Why（需求 / 问题）、Where（场景位置）、When（时间场景） 四个维度的关键标签，整理为以下 JSON 格式（标签需精准对应维度，保留原文核心信息）：
    {  
      "who": [/* Who维度的标签（如人群、用户特征等） */],  
      "why": [/* Why维度的标签（如痛点、需求、动机等） */],  
      "where": [/* Where维度的标签（如空间、场景位置等） */],  
      "when": [/* When维度的标签（如时间、时段、频率等） */]  
    }  
    """

    userContent = f"""
    产品名称：{productName}
    Design Task：{designTask}
    """

    client = OpenAI(api_key=API_KEY, base_url="https://api.deepseek.com")

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": userContent},
        ],
        response_format={
            'type': 'json_object'
        },
        stream=False
    )

    return response.choices[0].message.content

class RobotSolutionMatcher:
    def __init__(self):
        """初始化匹配器，需要DeepSeek API密钥"""
        self.api_key = API_KEY
        self.api_url = "https://api.deepseek.com/v1/chat/completions"
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

        with open('test.json', 'r') as f:
            outputSimple = json.load(f)
        self.outputSimple = outputSimple
        
        # 产品解决方案数据预处理
        self.product_solutions = self._preprocess_products()
        # 用户需求数据
        self.user_demand = self._get_user_demand()

    def _preprocess_products(self):
        """预处理产品数据，提取解决方案信息"""
        with open('converted_products.json', 'r') as f:
            Mproducts = json.load(f)
        products = Mproducts['products']
        
        # 转换为API需要的格式
        solutions = []
        for product in products:
            for sol in product["solutions"]:
                solutions.append({
                    "product": product["product_name"],
                    "problem": sol["problem"],
                    "solution": sol["solution"],
                    "scenarios": sol["scenarios"]
                })
        return solutions

    def _get_user_demand(self):
        """返回用户需求数据"""
        with open('data.json', 'r') as f:
            data = json.load(f)
        dem = {
            "when": data['when'],
            "where": data['where'],
            "who": data['who'],
            "why": data['why']
        }
        return dem

    def build_prompt(self):
        """构建API调用的Prompt"""
        prompt = f"""任务：根据用户需求（分when/where/who/why）匹配扫地机器人产品的解决方案（solution），并说明匹配原因。

        用户原始需求：
        {json.dumps(self.user_demand, ensure_ascii=False, indent=2)}

        产品解决方案库（每个solution包含产品名称、解决的问题、解决方案内容、适用场景）：
        {json.dumps({"solutions": self.product_solutions}, ensure_ascii=False, indent=2)}

        要求：
        1. 分别解析用户需求的when/where/who/why四个维度，每个维度下的子需求单独匹配解决方案；
        2. 匹配逻辑：解决方案的“scenarios”或“problem”与用户需求语义相关（如“低噪音”匹配“Quiet模式”，“多地面”匹配“混合地板清洁”）；
        3. 返回格式：必须是JSON格式，包含“用户原始需求”和“results”，匹配结果按when/where/who/why分组，每组包含subDemands、solutions（产品+解决方案内容）、matching_reason，所有j son名称都用英文便于索引，而且每个子需求的匹配结果都单独列成一个块,格式参考:{self.outputSimple};
        4. 同一子需求可匹配多个solution，原因需具体说明关联点；
        5. 不要包含任何JSON以外的内容，确保可以被json.loads正确解析。
        """
        return prompt

    def call_api(self):
        """调用DeepSeek API获取匹配结果"""
        prompt = self.build_prompt()
        
        payload = {
            "model": "deepseek-chat",  # 使用合适的模型名称
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "max_tokens": 2000,
            "response_format": {"type": "json_object"}
        }
        
        try:
            response = requests.post(
                self.api_url,
                headers=self.headers,
                data=json.dumps(payload, ensure_ascii=False)
            )
            response.raise_for_status()  # 抛出HTTP错误
            return response.json()
        except Exception as e:
            print(f"API调用失败: {str(e)}")
            return None

    def process_result(self, api_response):
        """处理API返回结果"""
        if not api_response or "choices" not in api_response:
            return None
            
        try:
            # 解析返回的JSON内容
            result = json.loads(api_response["choices"][0]["message"]["content"])
            return result
        except json.JSONDecodeError as e:
            print(f"结果解析失败: {str(e)}")
            return None

    def run(self):
        """执行完整匹配流程"""
        print("开始需求匹配...")
        api_response = self.call_api()
        if not api_response:
            return None
            
        result = self.process_result(api_response)
        if result:
            print("匹配完成，结果如下:")
            print(json.dumps(result, ensure_ascii=False, indent=2))
        return result

def convert_results_to_evaluation(results):
    """
    将results转换为evaluationData格式，默认priority为1
    
    参数:
        results: 包含when, where, who, why的原始结果字典
    返回:
        转换后的evaluationData字典
    """
    evaluation_data = {}
    
    # 处理每个维度(when, where, who, why)
    for dimension in results:
        evaluation_data[dimension] = []
        
        # 处理每个子需求
        for item in results[dimension]:
            sub_demand = item["subDemands"]
            solutions = item["solutions"]
            
            # 创建问题列表：将子需求作为主问题
            questions = [sub_demand]
            
            # 从解决方案中提取子项
            sub_items = []
            for sol in solutions:
                # 子项格式：产品名 + 解决方案
                sub_item_text = f"{sol['solution']}"
                sub_items.append({
                    "text": sub_item_text,
                    "reason": sol['matching_reason'],
                    "type": "S"  # S表示解决方案
                })
            
            # 构建评估项
            eval_item = {
                "priority": 1,  # 默认优先级为1
                "question": questions,
                "selected": True,  # 默认为已选择
                "subItems": sub_items,
                "text": sub_demand,  # 文本使用子需求
                "type": "P"  # P表示问题
            }
            
            # 添加到对应维度的列表中
            evaluation_data[dimension].append([eval_item])
    
    return evaluation_data

def getProblemSolution():
    """
    获取问题解决方案
    """
    matcher = RobotSolutionMatcher()
    mreturn = matcher.run()
    results = mreturn['results']
    evaluation_data = convert_results_to_evaluation(results)
    return evaluation_data

if __name__ == '__main__':
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

    data = load_data()
    re = getDesignTaskTags(data['productName'], data['userInput'])
    resultJson = json.loads(re)

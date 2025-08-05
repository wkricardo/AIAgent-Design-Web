from httpx import get
from apikey import API_KEY
from openai import OpenAI
from itertools import count
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
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

#!/usr/bin/env python3
import requests
import sys
import os

api_key = os.getenv('GEMINI_API_KEY', '').strip()

if not api_key:
    api_key = input("Enter your Gemini API key: ").strip()

if not api_key:
    print("Error: No API key")
    sys.exit(1)

print("\n🤖 Gemini CLI\n")

while True:
    user_input = input("You: ").strip()
    
    if user_input.lower() in ['exit', 'quit']:
        print("Goodbye!")
        break
    
    if not user_input:
        continue
    
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {"contents": [{"parts": [{"text": user_input}]}]}
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            data = response.json()
            text = data['candidates'][0]['content']['parts'][0]['text']
            print(f"\nGemini: {text}\n")
        else:
            print(f"\nError: {response.status_code}\n")
    except Exception as e:
        print(f"\nError: {e}\n")

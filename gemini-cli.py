#!/usr/bin/env python3
"""
Advanced Gemini CLI - Full featured chat interface
Features: Chat history, multiple models, commands, colors, streaming, file reading
"""

import requests
import json
import os
import sys
from datetime import datetime

class GeminiCLI:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY', '').strip()
        if not self.api_key:
            self.api_key = input("Enter your Gemini API key: ").strip()
        
        if not self.api_key:
            print("Error: No API key provided")
            sys.exit(1)
        
        self.models = {
            '1': 'gemini-2.5-flash',
            '2': 'gemini-2.0-flash',
            '3': 'gemini-1.5-pro'
        }
        self.current_model = 'gemini-2.5-flash'
        self.chat_history = []
        self.history_file = f"chat_history_{datetime.now().strftime('%Y%m%d')}.json"
        self.load_history()
        
        # Colors
        self.BLUE = '\033[94m'
        self.GREEN = '\033[92m'
        self.YELLOW = '\033[93m'
        self.RED = '\033[91m'
        self.CYAN = '\033[96m'
        self.RESET = '\033[0m'
        self.BOLD = '\033[1m'
    
    def load_history(self):
        """Load chat history from file if it exists"""
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, 'r') as f:
                    self.chat_history = json.load(f)
            except:
                self.chat_history = []
    
    def save_history(self):
        """Save chat history to file"""
        try:
            with open(self.history_file, 'w') as f:
                json.dump(self.chat_history, f, indent=2)
        except:
            pass
    
    def print_welcome(self):
        """Print welcome message"""
        print(f"\n{self.CYAN}{self.BOLD}🤖 Advanced Gemini CLI{self.RESET}")
        print(f"{self.BLUE}Model: {self.current_model}{self.RESET}")
        print(f"{self.BLUE}History file: {self.history_file}{self.RESET}")
        print(f"\n{self.YELLOW}Commands:{self.RESET}")
        print(f"  /models  - List available models")
        print(f"  /switch  - Switch to different model")
        print(f"  /history - Show chat history")
        print(f"  /clear   - Clear chat history")
        print(f"  /file    - Read and analyze a file")
        print(f"  /help    - Show this help")
        print(f"  exit     - Quit\n")
    
    def show_models(self):
        """Show available models"""
        print(f"\n{self.GREEN}Available Models:{self.RESET}")
        for key, model in self.models.items():
            marker = "✓" if model == self.current_model else " "
            print(f"  [{marker}] {key}. {model}")
        print()
    
    def switch_model(self):
        """Switch to a different model"""
        self.show_models()
        choice = input(f"{self.CYAN}Select model (1-3): {self.RESET}").strip()
        if choice in self.models:
            self.current_model = self.models[choice]
            print(f"{self.GREEN}Switched to {self.current_model}{self.RESET}\n")
        else:
            print(f"{self.RED}Invalid choice{self.RESET}\n")
    
    def show_history(self):
        """Display chat history"""
        if not self.chat_history:
            print(f"{self.YELLOW}No chat history yet{self.RESET}\n")
            return
        
        print(f"\n{self.GREEN}Chat History:{self.RESET}")
        for i, msg in enumerate(self.chat_history, 1):
            if msg['role'] == 'user':
                print(f"{self.CYAN}[{i}] You: {msg['parts'][0]['text'][:50]}...{self.RESET}")
            else:
                print(f"{self.GREEN}[{i}] Gemini: {msg['parts'][0]['text'][:50]}...{self.RESET}")
        print()
    
    def clear_history(self):
        """Clear chat history"""
        confirm = input(f"{self.YELLOW}Clear all chat history? (y/n): {self.RESET}").strip().lower()
        if confirm == 'y':
            self.chat_history = []
            self.save_history()
            print(f"{self.GREEN}History cleared{self.RESET}\n")
        else:
            print(f"{self.YELLOW}Cancelled{self.RESET}\n")
    
    def read_file(self):
        """Read and analyze a file"""
        filename = input(f"{self.CYAN}Enter filename: {self.RESET}").strip()
        
        if not os.path.exists(filename):
            print(f"{self.RED}File not found: {filename}{self.RESET}\n")
            return
        
        try:
            with open(filename, 'r') as f:
                content = f.read()
            
            prompt = f"Please analyze this file:\n\n{content}\n\nProvide a summary and key insights."
            self.send_message(prompt)
        except Exception as e:
            print(f"{self.RED}Error reading file: {e}{self.RESET}\n")
    
    def send_message(self, user_input):
        """Send message to Gemini API"""
        # Add to history
        self.chat_history.append({
            "role": "user",
            "parts": [{"text": user_input}]
        })
        
        url = f"https://generativelanguage.googleapis.com/v1/models/{self.current_model}:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {"contents": self.chat_history}
        
        try:
            print(f"\n{self.YELLOW}Gemini: {self.RESET}", end='', flush=True)
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    text = data['candidates'][0]['content']['parts'][0]['text']
                    
                    # Stream effect - print character by character
                    for char in text:
                        print(char, end='', flush=True)
                    
                    print(f"\n")
                    
                    # Add to history
                    self.chat_history.append({
                        "role": "model",
                        "parts": [{"text": text}]
                    })
                    self.save_history()
                else:
                    print(f"{self.RED}No response from API{self.RESET}\n")
            else:
                print(f"{self.RED}Error {response.status_code}{self.RESET}\n")
        except Exception as e:
            print(f"{self.RED}Error: {e}{self.RESET}\n")
    
    def run(self):
        """Main CLI loop"""
        self.print_welcome()
        
        while True:
            try:
                user_input = input(f"{self.CYAN}You: {self.RESET}").strip()
                
                if not user_input:
                    continue
                
                # Handle commands
                if user_input.lower() == '/models':
                    self.show_models()
                elif user_input.lower() == '/switch':
                    self.switch_model()
                elif user_input.lower() == '/history':
                    self.show_history()
                elif user_input.lower() == '/clear':
                    self.clear_history()
                elif user_input.lower() == '/file':
                    self.read_file()
                elif user_input.lower() == '/help':
                    self.print_welcome()
                elif user_input.lower() in ['exit', 'quit']:
                    print(f"{self.GREEN}Goodbye!{self.RESET}")
                    break
                else:
                    self.send_message(user_input)
            
            except KeyboardInterrupt:
                print(f"\n{self.GREEN}Goodbye!{self.RESET}")
                break
            except Exception as e:
                print(f"{self.RED}Error: {e}{self.RESET}\n")

if __name__ == "__main__":
    cli = GeminiCLI()
    cli.run()

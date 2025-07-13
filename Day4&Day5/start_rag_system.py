#!/usr/bin/env python3
"""
Quick Start Script for ITI RAG System
This script helps you start the RAG system with proper setup.
"""

import os
import sys
import subprocess
import time

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_config_file():
    """Check if config.env exists and has required variables"""
    if not os.path.exists('config.env'):
        print("❌ Error: config.env file not found")
        print("Please create config.env with your OpenAI API key:")
        print("OPENAI_API_KEY=your_api_key_here")
        print("OPENAI_MODEL=gpt-4o-mini")
        return False
    
    with open('config.env', 'r') as f:
        content = f.read()
        if 'OPENAI_API_KEY' not in content:
            print("❌ Error: OPENAI_API_KEY not found in config.env")
            return False
    
    print("✅ Configuration file found")
    return True

def check_data_file():
    """Check if data.txt exists"""
    if not os.path.exists('data.txt'):
        print("❌ Error: data.txt file not found")
        return False
    print("✅ Data file found")
    return True

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True, capture_output=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def run_migrations():
    """Run Django migrations"""
    print("🗄️ Running database migrations...")
    try:
        subprocess.run([sys.executable, 'manage.py', 'makemigrations'], 
                      check=True, capture_output=True)
        subprocess.run([sys.executable, 'manage.py', 'migrate'], 
                      check=True, capture_output=True)
        print("✅ Database migrations completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running migrations: {e}")
        return False

def start_server():
    """Start the Django development server"""
    print("🚀 Starting Django development server...")
    print("📱 Open your browser and go to: http://127.0.0.1:8000/")
    print("⏹️ Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        subprocess.run([sys.executable, 'manage.py', 'runserver'])
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Goodbye!")

def main():
    """Main function to run the setup and start the server"""
    print("🤖 ITI RAG System - Quick Start")
    print("=" * 40)
    
    # Check prerequisites
    if not check_python_version():
        return
    
    if not check_config_file():
        return
    
    if not check_data_file():
        return
    
    # Install dependencies
    if not install_dependencies():
        return
    
    # Run migrations
    if not run_migrations():
        return
    
    # Start server
    start_server()

if __name__ == "__main__":
    main() 
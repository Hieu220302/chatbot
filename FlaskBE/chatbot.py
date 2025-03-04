import os
import pandas as pd
import json
import re
from difflib import get_close_matches
from flask import Flask, request, jsonify

# Constants
JSON_FILE_PATH = "qa_data.json"
EXCEL_FILE_PATH = "Cleaned_Data.xlsx"
EXCEL_SHEET_NAME = "Sheet1"

# Load or initialize QA data
def load_qa_data():
    if not os.path.exists(JSON_FILE_PATH):
        df = pd.read_excel(EXCEL_FILE_PATH, sheet_name=EXCEL_SHEET_NAME)
        qa_dict = {q.strip(): a.strip() for q, a in zip(df["question"], df["answer"])}
        with open(JSON_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(qa_dict, f, ensure_ascii=False, indent=4)
    else:
        with open(JSON_FILE_PATH, "r", encoding="utf-8") as f:
            qa_dict = json.load(f)
    return qa_dict

qa_dict = load_qa_data()

# Utility functions
def extract_keywords(sentence):
    return re.findall(r'\b\w{3,}\b', sentence.lower())

def suggest_questions(user_question, questions, threshold=0.4):
    keywords = extract_keywords(user_question)
    suggestions = [q for q in questions if any(k in q.lower() for k in keywords)]
    return get_close_matches(user_question, suggestions, n=5, cutoff=threshold)

def find_best_match(user_question, questions, threshold=0.6):
    matches = get_close_matches(user_question, questions, n=1, cutoff=threshold)
    return matches[0] if matches else None

# Flask app
app = Flask(__name__)

@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    user_question = data.get("question", "").strip()

    if not user_question:
        return jsonify({"error": "Vui lòng cung cấp câu hỏi."}), 400

    best_match = find_best_match(user_question, qa_dict.keys())
    
    if best_match:
        answer = qa_dict[best_match]
    else:
        suggested_questions = suggest_questions(user_question, qa_dict.keys())
        if suggested_questions:
            answer = "Xin lỗi, tôi không tìm thấy câu trả lời.\nBạn có thể thử hỏi:\n- " + "\n- ".join(suggested_questions)
        else:
            answer = "Xin lỗi, tôi không tìm thấy câu trả lời phù hợp."

    return jsonify({"question": user_question, "answer": answer})

# CLI-based chatbot
def main_menu():
    while True:
        print("\nChatbot: Chào bạn! Hãy chọn một tùy chọn:")
        print("1. Nhập câu hỏi.")
        print("2. Training lại chatbot.")
        print("3. Thoát.")

        choice = input("Sự lựa chọn của bạn: ").strip()

        if choice == "1":
            handle_user_questions()
        elif choice == "2":
            retrain_chatbot()
        elif choice == "3":
            print("Chatbot: Tạm biệt! 👋")
            break
        else:
            print("Chatbot: Vui lòng chọn 1, 2 hoặc 3.")

def handle_user_questions():
    while True:
        user_input = input("\nBạn: ").strip()
        
        if user_input.lower() in ["thoát", "thoat"]:
            print("Chatbot: Thoát chế độ hỏi đáp, quay lại menu chính.\n")
            break

        if not user_input:
            print("Chatbot: Bạn chưa nhập gì cả!")
            continue

        best_match = find_best_match(user_input, qa_dict.keys())
        if best_match:
            print("Chatbot:", qa_dict[best_match])
        else:
            suggestions = suggest_questions(user_input, qa_dict.keys())
            if suggestions:
                print("Chatbot: Xin lỗi, tôi không tìm thấy câu trả lời. Bạn có thể thử hỏi:\n-", "\n- ".join(suggestions))
            else:
                print("Chatbot: Xin lỗi, tôi không tìm thấy câu trả lời phù hợp.")

def retrain_chatbot():
    global qa_dict
    try:
        df = pd.read_excel(EXCEL_FILE_PATH, sheet_name=EXCEL_SHEET_NAME)
        qa_dict = {q.strip(): a.strip() for q, a in zip(df["question"], df["answer"])}
        
        with open(JSON_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(qa_dict, f, ensure_ascii=False, indent=4)
        
        print("Chatbot: Training lại thành công!")
    except Exception as e:
        print(f"Lỗi khi training lại chatbot: {e}")

if __name__ == "__main__":
    main_menu()

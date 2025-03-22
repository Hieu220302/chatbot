import re
from difflib import get_close_matches
from model.data_handler import (
    load_qa_data,
    save_unanswered_question,
    get_unanswered_questions,
    update_unanswered_question,
    update_multiple_unanswered_questions,
    delete_unanswered_by_ids,
)
from flask import jsonify

# 🧠 Load dữ liệu Q&A từ file
qa_dict = load_qa_data()

def extract_keywords(sentence):
    # Tách các từ có độ dài >= 3 ký tự để làm từ khóa
    return re.findall(r'\b\w{3,}\b', sentence.lower())

def suggest_questions(user_question, questions, threshold=0.2):
    # Gợi ý các câu hỏi gần giống dựa trên từ khóa
    keywords = extract_keywords(user_question)
    suggestions = [q for q in questions if any(k in q.lower() for k in keywords)]
    return get_close_matches(user_question, suggestions, n=5, cutoff=threshold)

def find_best_match(user_question, questions, threshold=0.7):
    # Tìm câu hỏi phù hợp nhất theo ngưỡng tương đồng
    matches = get_close_matches(user_question, questions, n=1, cutoff=threshold)
    return matches[0] if matches else None

def get_answer(user_question):
    best_match = find_best_match(user_question, qa_dict.keys())
    suggested_questions = suggest_questions(user_question, qa_dict.keys())

    if best_match:
        return {
            "answer": qa_dict[best_match],
            "suggested_questions": []
        }
    else:
        save_unanswered_question(user_question)
        return {
            "answer": "Xin lỗi, tôi không tìm thấy câu trả lời.",
            "suggested_questions": suggested_questions
        }

# ---------- Các hàm thao tác với câu hỏi chưa trả lời ------------

def get_all_unanswered():
    return get_unanswered_questions()

def update_unanswered_by_id(question_id, question=None, answer=None, status=None):
    return update_unanswered_question(
        id=question_id,
        question=question,
        answer=answer,
        status=status
    )

def update_unanswered_batch(updates: list):
    return update_multiple_unanswered_questions(updates)

def delete_unanswered_by_ids_controller(ids: list):
    success, message = delete_unanswered_by_ids(ids)

    if not success:
        return jsonify({"error": message}), 404

    return jsonify({"message": message}), 200

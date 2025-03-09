import re
from difflib import get_close_matches
from model.data_handler import load_qa_data, save_unanswered_question

qa_dict = load_qa_data()

def extract_keywords(sentence):
    return re.findall(r'\b\w{3,}\b', sentence.lower())

def suggest_questions(user_question, questions, threshold=0.2):
    keywords = extract_keywords(user_question)
    suggestions = [q for q in questions if any(k in q.lower() for k in keywords)]
    return get_close_matches(user_question, suggestions, n=5, cutoff=threshold)

def find_best_match(user_question, questions, threshold=0.7):
    matches = get_close_matches(user_question, questions, n=1, cutoff=threshold)
    return matches[0] if matches else None

def get_answer(user_question):
    best_match = find_best_match(user_question, qa_dict.keys())
    suggested_questions = suggest_questions(user_question, qa_dict.keys())

    if best_match:
        return {
            "answer": qa_dict[best_match],
            "suggested_questions": [],
        }
    else:
        save_unanswered_question(user_question)  # Lưu câu hỏi vào Excel
        return {
            "answer": "Xin lỗi, tôi không tìm thấy câu trả lời.",
            "suggested_questions": suggested_questions
        }
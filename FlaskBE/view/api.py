from flask import Flask, request, jsonify
from controller.chatbot_logic import get_answer

app = Flask(__name__)

@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    user_question = data.get("question", "").strip()

    if not user_question:
        return jsonify({"error": "Vui lòng cung cấp câu hỏi."}), 400

    response = get_answer(user_question)
    return jsonify({
        "question": user_question,
        "answer": response["answer"],
        "suggested_questions": response["suggested_questions"] 
    })

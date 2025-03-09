from flask import Flask, request, jsonify
from flask_cors import CORS
from controller.chatbot_logic import get_answer

app = Flask(__name__)
CORS(app)  # Cho phép tất cả origin (cẩn thận khi dùng ở production)

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

if __name__ == "__main__":
    app.run(debug=True)

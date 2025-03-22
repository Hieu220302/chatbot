from flask import Flask, request, jsonify
from flask_cors import CORS
from controller.chatbot_logic import (
    get_answer,
    get_unanswered_questions,
    update_unanswered_question,
    update_multiple_unanswered_questions,
    delete_unanswered_by_ids_controller
)
from controller.auth_controller import login  

app = Flask(__name__)
CORS(app)

# 🧠 Chatbot route
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

# 🔐 Login route
@app.route("/login", methods=["POST"])
def login_route():
    return login()

# 📥 Lấy danh sách câu hỏi chưa được trả lời, có thể lọc theo trạng thái
@app.route("/unanswered", methods=["GET"])
def get_unanswered_filtered():
    status = request.args.get("status")
    data = get_unanswered_questions()
    if status:
        data = [item for item in data if item["status"] == status]
    return jsonify(data)

# ✏️ Cập nhật một câu hỏi chưa được trả lời
@app.route("/unanswered/<int:id>", methods=["PUT"])
def update_unanswered(id):
    data = request.get_json()
    result = update_unanswered_question(
        id,
        question=data.get("question"),
        answer=data.get("answer"),
        status=data.get("status")
    )
    if "not found" in result:
        return jsonify({"error": result}), 404
    return jsonify({"message": result})

# ✏️ Cập nhật nhiều câu hỏi chưa được trả lời
@app.route("/unanswered/batch", methods=["POST"])
def update_unanswered_batch():
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({"error": "Invalid data format, expected a list."}), 400

    result = update_multiple_unanswered_questions(data)

    if result.get("success"):
        return jsonify({
            "message": "Cập nhật thành công.",
            "updated": result.get("updated", 0),
            "added_to_training": result.get("added_to_training", 0)
        }), 200
    else:
        return jsonify({"error": result.get("message", "Unknown error.")}), 500


@app.route('/delete-unanswered', methods=['POST'])
def delete_unanswered_route():
    data = request.get_json()
    ids = data.get("ids")
    if not isinstance(ids, list):
        return jsonify({"error": "Invalid data format, expected {'ids': [1,2,...]}"}), 400

    return delete_unanswered_by_ids_controller(ids)


if __name__ == "__main__":
    app.run(debug=True)

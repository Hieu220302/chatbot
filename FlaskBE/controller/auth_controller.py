from flask import request, jsonify
from model.account_handle import find_account_by_email_and_password

def login():
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email và mật khẩu không được để trống."}), 400

    account = find_account_by_email_and_password(email, password)

    if not account:
        return jsonify({"error": "Email hoặc mật khẩu không đúng."}), 401

    return jsonify({
        "message": "Đăng nhập thành công.",
        "user": {
            "id": account["ID"],
            "email": account["email"],
            "name": account["name"]
        }
    })

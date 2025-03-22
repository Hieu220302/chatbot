import os
import json
import pandas as pd

# Định nghĩa đường dẫn
BASE_DIR = os.path.dirname(os.path.abspath(__file__))        # models/
PROJECT_ROOT = os.path.dirname(BASE_DIR)                     # FlaskBE/
DATA_DIR = os.path.join(PROJECT_ROOT, "data")                # FlaskBE/data/

# Các đường dẫn file dữ liệu
JSON_FILE_PATH = os.path.join(DATA_DIR, "qa_data.json")
EXCEL_FILE_PATH = os.path.join(DATA_DIR, "Cleaned_Data.xlsx")
UNANSWERED_FILE = os.path.join(DATA_DIR, "unanswered_questions.xlsx")
EXCEL_SHEET_NAME = "Sheet1"

# ============================== Q&A DATA ==============================

def load_qa_data():
    if not os.path.exists(JSON_FILE_PATH):
        df = pd.read_excel(EXCEL_FILE_PATH, sheet_name=EXCEL_SHEET_NAME)
        qa_dict = {str(q).strip(): str(a).strip() for q, a in zip(df["question"], df["answer"])}
        with open(JSON_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(qa_dict, f, ensure_ascii=False, indent=4)
    else:
        with open(JSON_FILE_PATH, "r", encoding="utf-8") as f:
            qa_dict = json.load(f)
    return qa_dict

def retrain_qa_data():
    try:
        df = pd.read_excel(EXCEL_FILE_PATH, sheet_name=EXCEL_SHEET_NAME)
        qa_dict = {str(q).strip(): str(a).strip() for q, a in zip(df["question"], df["answer"])}
        with open(JSON_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(qa_dict, f, ensure_ascii=False, indent=4)
        return qa_dict
    except Exception as e:
        return str(e)

# ======================== UNANSWERED QUESTIONS ========================
def clean_answer(value):
    if pd.isna(value):
        return ""
    if isinstance(value, float) and value.is_integer():
        return str(int(value))  # 2222.0 -> "2222"
    return str(value)

def save_unanswered_question(question):
    if os.path.exists(UNANSWERED_FILE):
        df = pd.read_excel(UNANSWERED_FILE)
    else:
        df = pd.DataFrame(columns=["id", "question", "answer", "status"])

    # Ép kiểu str để tránh lỗi dtype
    df["question"] = df["question"].astype(str)
    df["answer"] = df["answer"].apply(clean_answer)
    df["status"] = df["status"].astype(str)

    if not df.empty:
        new_id = df["id"].max() + 1
    else:
        new_id = 1
    question = str(question).strip()
    new_entry = pd.DataFrame([[new_id, question, "", "unanswered"]],
                             columns=["id", "question", "answer", "status"])
    df = pd.concat([df, new_entry], ignore_index=True)
    df.to_excel(UNANSWERED_FILE, index=False)

def get_unanswered_questions():
    if not os.path.exists(UNANSWERED_FILE):
        return []
    df = pd.read_excel(UNANSWERED_FILE)

    # Ép kiểu để đảm bảo không lỗi
    df["question"] = df["question"].astype(str)
    df["answer"] = df["answer"].apply(clean_answer)
    df["status"] = df["status"].astype(str)

    return df.to_dict(orient="records")

def update_unanswered_question(id, question=None, answer=None, status=None):
    if not os.path.exists(UNANSWERED_FILE):
        return f"File {UNANSWERED_FILE} not found."

    df = pd.read_excel(UNANSWERED_FILE)

    df["question"] = df["question"].astype(str)
    df["answer"] = df["answer"].apply(clean_answer)
    df["status"] = df["status"].astype(str)

    if id not in df["id"].values:
        return f"Question with id {id} not found."

    idx = df.index[df["id"] == id][0]
    if question is not None:
        df.at[idx, "question"] = str(question)
    if answer is not None:
        df.at[idx, "answer"] = str(answer)
    if status is not None:
        df.at[idx, "status"] = str(status)

    df.to_excel(UNANSWERED_FILE, index=False)
    return "Update successful."

def update_multiple_unanswered_questions(entries):
    if not os.path.exists(UNANSWERED_FILE):
        return {"success": False, "message": f"File {UNANSWERED_FILE} not found."}

    df = pd.read_excel(UNANSWERED_FILE)

    df["question"] = df["question"].astype(str)
    df["answer"] = df["answer"].apply(clean_answer)
    df["status"] = df["status"].astype(str)

    updated_count = 0
    added_to_training = 0

    for entry in entries:
        entry_id = entry.get("id")
        if entry_id not in df["id"].values:
            continue

        idx = df.index[df["id"] == entry_id][0]
        if "question" in entry:
            df.at[idx, "question"] = str(entry["question"])
        if "answer" in entry:
            df.at[idx, "answer"] = str(entry["answer"])
        if "status" in entry:
            df.at[idx, "status"] = str(entry["status"])

        updated_count += 1

        # Thêm vào dữ liệu training nếu status là 'updated'
        if entry.get("status") == "updated":
            new_question = str(entry.get("question")).strip()
            new_answer = str(entry.get("answer")).strip()

            if os.path.exists(EXCEL_FILE_PATH):
                training_df = pd.read_excel(EXCEL_FILE_PATH, sheet_name=EXCEL_SHEET_NAME)
            else:
                training_df = pd.DataFrame(columns=["question", "answer"])

            # Kiểm tra câu hỏi đã tồn tại chưa
            if new_question not in training_df["question"].astype(str).values:
                training_df = pd.concat([
                    training_df,
                    pd.DataFrame([[new_question, new_answer]], columns=["question", "answer"])
                ], ignore_index=True)
                training_df.to_excel(EXCEL_FILE_PATH, index=False)
                added_to_training += 1

    df.to_excel(UNANSWERED_FILE, index=False)

    # Chỉ retrain nếu có dữ liệu mới
    if added_to_training > 0:
        retrain_qa_data()

    return {
        "success": True,
        "updated": updated_count,
        "added_to_training": added_to_training
    }


def delete_unanswered_by_ids(ids):
    if not os.path.exists(UNANSWERED_FILE):
        return False, "File not found."

    df = pd.read_excel(UNANSWERED_FILE)
    df = df[~df["id"].isin(ids)]
    df.to_excel(UNANSWERED_FILE, index=False)
    return True, "Xoá thành công."

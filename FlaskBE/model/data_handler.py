import os
import json
import pandas as pd

JSON_FILE_PATH = "qa_data.json"
EXCEL_FILE_PATH = "Cleaned_Data.xlsx"
EXCEL_SHEET_NAME = "Sheet1"
UNANSWERED_FILE = "unanswered_questions.xlsx"

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

def retrain_qa_data():
    try:
        df = pd.read_excel(EXCEL_FILE_PATH, sheet_name=EXCEL_SHEET_NAME)
        qa_dict = {q.strip(): a.strip() for q, a in zip(df["question"], df["answer"])}
        with open(JSON_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(qa_dict, f, ensure_ascii=False, indent=4)
        return qa_dict
    except Exception as e:
        return str(e)
    
def save_unanswered_question(question):
    if os.path.exists(UNANSWERED_FILE):
        df = pd.read_excel(UNANSWERED_FILE)
    else:
        df = pd.DataFrame(columns=["ID", "Question", "Answer"])  
    new_id = len(df) + 1  # ID tự tăng
    new_entry = pd.DataFrame([[new_id, question, ""]], columns=["ID", "Question", "Answer"])  
    
    df = pd.concat([df, new_entry], ignore_index=True)
    df.to_excel(UNANSWERED_FILE, index=False)
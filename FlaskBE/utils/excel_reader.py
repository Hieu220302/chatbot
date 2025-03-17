import pandas as pd

def load_accounts_from_excel(path: str):
    try:
        df = pd.read_excel(path)
        accounts = df.to_dict(orient="records")
        return accounts
    except Exception as e:
        print("Lỗi đọc file Excel:", e)
        return []

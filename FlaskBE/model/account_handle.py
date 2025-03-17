from utils.excel_reader import load_accounts_from_excel

ACCOUNTS = load_accounts_from_excel("data/account.xlsx")

def find_account_by_email_and_password(email: str, password: str):
    for acc in ACCOUNTS:
        if acc["email"] == email and str(acc["password"]) == password:
            return acc
    return None

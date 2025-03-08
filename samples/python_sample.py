# CodeVid Demo - Python Animation Example

class BankAccount:
    """A simple class to represent a bank account"""
    
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
    
    def deposit(self, amount):
        """Add money to the account balance"""
        if amount > 0:
            self.balance += amount
            return f"Deposited ${amount}. New balance: ${self.balance}"
        return "Deposit amount must be positive"
    
    def withdraw(self, amount):
        """Withdraw money from the account balance"""
        if amount > 0:
            if amount <= self.balance:
                self.balance -= amount
                return f"Withdrew ${amount}. New balance: ${self.balance}"
            return "Insufficient funds"
        return "Withdrawal amount must be positive"
    
    def __str__(self):
        return f"{self.owner}'s account. Balance: ${self.balance}"


# Create some accounts
alice_account = BankAccount("Alice", 1000)
bob_account = BankAccount("Bob", 500)

# Perform some transactions
print(alice_account)
print(bob_account)

print(alice_account.deposit(250))
print(bob_account.withdraw(100))

# Try an invalid transaction
print(bob_account.withdraw(1000))

# Transfer money between accounts


def transfer(from_account, to_account, amount):
    """Transfer money between two accounts"""
    withdrawal = from_account.withdraw(amount)
    if "New balance" in withdrawal:
        to_account.deposit(amount)
        return (f"Transferred ${amount} from {from_account.owner} "
                f"to {to_account.owner}")
    return f"Transfer failed: {withdrawal}"


print(transfer(alice_account, bob_account, 300))
print(alice_account)
print(bob_account)

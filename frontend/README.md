# Vaulty Cash — Bank Management System

A React conversion of the Vaulty Cash banking web app.

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx        # Global state: customers, transactions, current user
├── components/
│   ├── Toast.jsx             # Toast notification component
│   └── TransactionList.jsx   # Reusable transaction list/item components
├── pages/
│   ├── WelcomePage.jsx       # Landing / welcome screen
│   ├── RegisterPage.jsx      # Account registration screen
│   ├── LoginPage.jsx         # Login screen
│   ├── DashboardPage.jsx     # Dashboard shell (topbar + sidenav + panel router)
│   ├── HomePanel.jsx         # Dashboard home: balance card, quick actions, recent tx
│   ├── TransferPanel.jsx     # Bank transfer panel
│   ├── DepositPanel.jsx      # Deposit cash panel
│   ├── WithdrawPanel.jsx     # Withdraw cash panel
│   ├── StatementPanel.jsx    # Full account statement panel
│   ├── ProfilePanel.jsx      # Profile view and edit panel
│   └── SecurityPanel.jsx     # Change password & PIN panel
├── App.jsx                   # Root app + screen router
├── main.jsx                  # React entry point
└── index.css                 # All global styles & design tokens
```

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

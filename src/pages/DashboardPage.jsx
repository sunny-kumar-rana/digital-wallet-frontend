import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DashboardPage() {
  const [balance, setBalance] = useState(0);
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const navigate = useNavigate();

  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const loadDashboard = async () => {
      try {
        const [balanceResponse, transactionsResponse] = await Promise.all([
          api.get("/balance"),
          api.get("/transactions"),
        ]);

        setBalance(balanceResponse.data.balance);
        setTransactions(transactionsResponse.data);
      } catch (error) {
        alert(
          error.response?.data?.error ||
          "Failed to load dashboard",
        );
      }
    };

    loadDashboard();
  }, [navigate, token]);

  const fetchBalance = async () => {
    try {
      const response = await api.get("/balance");

      setBalance(response.data.balance);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to fetch balance");
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");

      setTransactions(response.data);
    } catch (error) {
      alert(
        error.response?.data?.error || "Failed to fetch transactions",
      );
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/deposit", {
        amount: Number(depositAmount),
      });

      alert(response.data.message);

      await fetchBalance();
      await fetchTransactions();

      setDepositAmount("");
    } catch (error) {
      alert(error.response?.data?.error || "Deposit failed");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/withdraw", {
        amount: Number(withdrawAmount),
      });

      alert(response.data.message);

      await fetchBalance();
      await fetchTransactions();

      setWithdrawAmount("");
    } catch (error) {
      alert(error.response?.data?.error || "Withdrawal failed");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/transfer",
        {
          receiverId: Number(receiverId),
          amount: Number(amount),
        },
        {
          headers: {
            "Idempotency-Key": crypto.randomUUID(),
          },
        },
      );

      alert(response.data.message);

      await fetchBalance();
      await fetchTransactions();

      setReceiverId("");
      setAmount("");
    } catch (error) {
      alert(error.response?.data?.error || "Transfer failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            Welcome, {name}
          </h1>

          <button
            onClick={handleLogout}
            className="bg-violet-500 text-white px-5 py-2 rounded-lg hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700"
          >
            Logout
          </button>
        </div>

        {/* Balance */}

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Wallet Balance
          </h2>

          <p className="text-5xl font-bold">
            ₹ {balance}
          </p>
        </div>

        {/* Deposit */}

        <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Deposit Money
          </h2>

          <form
            onSubmit={handleDeposit}
            className="flex flex-col gap-4"
          >
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="border p-3 rounded-lg outline-none"
              required
            />

            <button
              type="submit"
              className="bg-violet-500 text-white p-3 rounded-lg hover:bg-violet-600"
            >
              Deposit
            </button>
          </form>
        </div>

        {/* Withdraw */}

        <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Withdraw Money
          </h2>

          <form
            onSubmit={handleWithdraw}
            className="flex flex-col gap-4"
          >
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="border p-3 rounded-lg outline-none"
              required
            />

            <button
              type="submit"
              className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
            >
              Withdraw
            </button>
          </form>
        </div>

        {/* Transfer */}

        <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Transfer Money
          </h2>

          <form
            onSubmit={handleTransfer}
            className="flex flex-col gap-4"
          >
            <input
              type="number"
              min="1"
              placeholder="Receiver User ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="border p-3 rounded-lg outline-none"
              required
            />

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-3 rounded-lg outline-none"
              required
            />

            <button
              type="submit"
              className="bg-violet-500 text-white p-3 rounded-lg hover:bg-violet-600"
            >
              Transfer
            </button>
          </form>
        </div>

        {/* Transaction History */}

        <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-6">
            Transaction History
          </h2>

          <div className="flex flex-col gap-4">
            {transactions.length === 0 ? (
              <p className="text-gray-500">
                No transactions yet.
              </p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="border rounded-xl p-4"
                >
                  <p>
                    <span className="font-semibold">
                      Transaction ID:
                    </span>{" "}
                    {tx.id}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Sender:
                    </span>{" "}
                    {tx.senderId}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Receiver:
                    </span>{" "}
                    {tx.receiverId}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Amount:
                    </span>{" "}
                    ₹ {tx.amount}
                  </p>

                  <p className="mt-2">
                    <span className="font-semibold">
                      Type:
                    </span>

                    <span
                      className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${tx.transactionType === "DEPOSIT"
                        ? "bg-green-500"
                        : tx.transactionType === "WITHDRAW"
                          ? "bg-red-500"
                          : "bg-blue-500"
                        }`}
                    >
                      {tx.transactionType}
                    </span>
                  </p>

                  <p className="mt-2">
                    <span className="font-semibold">
                      Status:
                    </span>{" "}
                    {tx.status}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {tx.createdAt}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
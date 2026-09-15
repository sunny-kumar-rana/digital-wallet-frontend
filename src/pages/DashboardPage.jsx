import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function DashboardPage() {
  const [balance, setBalance] = useState(0);
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [operation, setOperation] = useState("");

  const navigate = useNavigate();

  const name = localStorage.getItem("name");

  const fetchBalance = async () => {
    try {
      const response = await api.get("/balance");
      setBalance(response.data.balance);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to fetch balance",
      );
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to fetch transactions",
      );
    }
  };

  const refreshDashboard = async () => {
    await Promise.all([fetchBalance(), fetchTransactions()]);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      try {
        const [balanceResponse, transactionsResponse] = await Promise.all([
          api.get("/balance"),
          api.get("/transactions"),
        ]);

        setBalance(balanceResponse.data.balance);
        setTransactions(transactionsResponse.data);
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!depositAmount || Number(depositAmount) <= 0) {
      toast.error("Enter a valid deposit amount");
      return;
    }

    try {
      setOperation("deposit");

      const response = await api.post("/deposit", {
        amount: Number(depositAmount),
      });

      toast.success(response.data.message);

      await refreshDashboard();
      setDepositAmount("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Deposit failed");
    } finally {
      setOperation("");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast.error("Enter a valid withdrawal amount");
      return;
    }

    try {
      setOperation("withdraw");

      const response = await api.post("/withdraw", {
        amount: Number(withdrawAmount),
      });

      toast.success(response.data.message);

      await refreshDashboard();
      setWithdrawAmount("");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Withdrawal failed",
      );
    } finally {
      setOperation("");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!receiverId || Number(receiverId) <= 0) {
      toast.error("Enter a valid receiver ID");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid transfer amount");
      return;
    }

    try {
      setOperation("transfer");

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

      toast.success(response.data.message);

      await refreshDashboard();

      setReceiverId("");
      setAmount("");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Transfer failed",
      );
    } finally {
      setOperation("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    toast.success("Logged out successfully");

    navigate("/");
  };

  const isOperating = operation !== "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold">Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Welcome, {name}
          </h1>

          <button
            onClick={handleLogout}
            disabled={isOperating}
            className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Wallet Balance
          </h2>

          <p className="text-4xl sm:text-5xl font-bold">
            ₹ {Number(balance).toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Deposit Money
          </h2>

          <form onSubmit={handleDeposit} className="flex flex-col gap-4">
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="border p-3 rounded-lg outline-none"
              disabled={isOperating}
              required
            />

            <button
              type="submit"
              disabled={isOperating}
              className="bg-violet-500 text-white p-3 rounded-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {operation === "deposit" ? "Depositing..." : "Deposit"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Withdraw Money
          </h2>

          <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="border p-3 rounded-lg outline-none"
              disabled={isOperating}
              required
            />

            <button
              type="submit"
              disabled={isOperating}
              className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {operation === "withdraw" ? "Withdrawing..." : "Withdraw"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Transfer Money
          </h2>

          <form onSubmit={handleTransfer} className="flex flex-col gap-4">
            <input
              type="number"
              min="1"
              placeholder="Receiver User ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="border p-3 rounded-lg outline-none"
              disabled={isOperating}
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
              disabled={isOperating}
              required
            />

            <button
              type="submit"
              disabled={isOperating}
              className="bg-violet-500 text-white p-3 rounded-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {operation === "transfer" ? "Transferring..." : "Transfer"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            Transaction History
          </h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500">
              No transactions yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="border rounded-xl p-4 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
                    <p className="font-semibold">
                      Transaction #{tx.id}
                    </p>

                    <span
                      className={`w-fit px-3 py-1 rounded-full text-white text-sm ${tx.transactionType === "DEPOSIT"
                        ? "bg-green-500"
                        : tx.transactionType === "WITHDRAW"
                          ? "bg-red-500"
                          : "bg-blue-500"
                        }`}
                    >
                      {tx.transactionType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <p>
                      <span className="font-semibold">Sender:</span>{" "}
                      {tx.senderId}
                    </p>

                    <p>
                      <span className="font-semibold">Receiver:</span>{" "}
                      {tx.receiverId}
                    </p>

                    <p>
                      <span className="font-semibold">Amount:</span>{" "}
                      ₹ {tx.amount}
                    </p>

                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {tx.status}
                    </p>
                  </div>

                  {tx.createdAt && (
                    <p className="text-xs text-gray-500 mt-3">
                      {tx.createdAt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
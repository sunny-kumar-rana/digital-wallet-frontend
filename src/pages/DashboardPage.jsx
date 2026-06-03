import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [balance, setBalance] = useState(0);
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await api.get(`/balance?userId=${userId}`);

      setBalance(response.data.balance);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/transfer", {
        senderId: Number(userId),
        receiverId: Number(receiverId),
        amount: Number(amount),
      });

      alert(response.data.message);

      fetchBalance();
      fetchTransactions();

      setReceiverId("");
      setAmount("");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get(`/transactions?userId=${userId}`);

      setTransactions(response.data);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        `/deposit?userId=${userId}&amount=${depositAmount}`,
      );

      alert(response.data.message);

      fetchBalance();
      fetchTransactions();

      setDepositAmount("");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        `/withdraw?userId=${userId}&amount=${withdrawAmount}`,
      );

      alert(response.data.message);

      fetchBalance();
      fetchTransactions();

      setWithdrawAmount("");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome, {name}</h1>
        <button
          onClick={() => {
            localStorage.clear();

            navigate("/");
          }}
          className="bg-black text-white px-5 py-2 rounded-lg mb-8 bg-violet-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700"
        >
          Logout
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Wallet Balance</h2>

          <p className="text-5xl font-bold">₹ {balance}</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">Deposit Money</h2>

          <form onSubmit={handleDeposit} className="flex flex-col gap-4">
            <input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="border p-3 rounded-lg outline-none"
            />

            <button
              type="submit"
              className="bg-black text-white p-3 rounded-lg bg-violet-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700"
            >
              Deposit
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">Withdraw Money</h2>

          <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
            <input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="border p-3 rounded-lg outline-none"
            />

            <button
              type="submit"
              className="bg-red-600 text-white p-3 rounded-lg"
            >
              Withdraw
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">Transfer Money</h2>

          <form onSubmit={handleTransfer} className="flex flex-col gap-4">
            <input
              type="number"
              placeholder="Receiver User ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="border p-3 rounded-lg outline-none"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-3 rounded-lg outline-none"
            />

            <button
              type="submit"
              className="bg-black text-white p-3 rounded-lg bg-violet-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700"
            >
              Transfer
            </button>
          </form>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>

          <div className="flex flex-col gap-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="border rounded-xl p-4">
                <p>
                  <span className="font-semibold">Transaction ID:</span> {tx.id}
                </p>

                <p>
                  <span className="font-semibold">Sender:</span> {tx.senderId}
                </p>

                <p>
                  <span className="font-semibold">Receiver:</span>{" "}
                  {tx.receiverId}
                </p>

                <p>
                  <span className="font-semibold">Amount:</span> ₹ {tx.amount}
                </p>

                <p>
                  <span className="font-semibold">Status:</span>

                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-white text-sm
                    ${
                      tx.transactionType === "DEPOSIT"
                        ? "bg-green-500"
                        : tx.transactionType === "WITHDRAW"
                          ? "bg-red-500"
                          : "bg-blue-500"
                    }`}
                  >
                    {tx.transactionType}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Status:</span>

                  {tx.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

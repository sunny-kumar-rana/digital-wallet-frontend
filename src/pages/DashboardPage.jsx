import { useEffect, useState } from "react";
import api from "../services/api";

function DashboardPage() {
  const [balance, setBalance] = useState(0);

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await api.get(`/balance?userId=${userId}`);

      setBalance(response.data.balance);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome, {name}</h1>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Wallet Balance</h2>

          <p className="text-5xl font-bold">₹ {balance}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

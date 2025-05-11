'use client';
import axios from "axios";
import { useEffect, useState } from "react";

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/wallet");

      setWallet(response.data.wallet);
      setTransactions(response.data.transactions || []); // optional
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!rechargeAmount || isNaN(rechargeAmount)) return;

    try {
      setIsRecharging(true);
      await axios.post("/api/wallet/recharge", { amount: Number(rechargeAmount) });
      setRechargeAmount("");
      fetchWalletData();
    } catch (error) {
      console.error("Recharge failed:", error);
    } finally {
      setIsRecharging(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <div className="w-full mx-auto">
      <div className="bg-[url('/bg-home-2.jpg')] bg-cover bg-fixed min-h-screen w-full pt-28 px-4">
        <h1 className="text-3xl font-semibold mx-auto px-6 py-4 w-fit mb-6 text-center bg-black/30 backdrop-blur-sm rounded-md shadow-lg drop-shadow-md">
          My Wallet
        </h1>

        <div className="max-w-2xl mx-auto bg-white/90 shadow-md rounded p-6 border border-gray-200">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading wallet details...</p>
          ) : (
            <>
              <p className="text-gray-800 text-xl mb-2">
                Current Balance:{" "}
                <span className={`font-bold ${wallet === 0 ? 'text-red-600' : 'text-green-700'}`}>
                  ₹{wallet?.toFixed(2)}
                </span>
              </p>

              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="border border-gray-300 px-4 py-2 rounded w-1/2"
                />
                <button
                  onClick={handleRecharge}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={isRecharging || !rechargeAmount}
                >
                  {isRecharging ? "Recharging..." : "Recharge"}
                </button>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Recent Transactions</h2>
                {transactions.length === 0 ? (
                  <p className="text-sm text-gray-500">No transactions found.</p>
                ) : (
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {transactions.map((txn, idx) => (
                      <li key={idx} className="flex justify-between text-sm border-b pb-1">
                        <span>{txn.type === 'recharge' ? 'Recharge' : 'Booking'}</span>
                        <span className="font-medium">₹{txn.amount}</span>
                        <span className="text-gray-500">{formatDate(txn.date)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Date formatting helper
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

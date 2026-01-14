import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getGigById } from "../../services/gig.service";
import {
  getBidsForGig,
  placeBid,
  updateBidStatus,
} from "../../services/bid.service";

import StatusBadge from "../../components/gigs/StatusBadge";

export default function GigDetails() {
  const { id } = useParams();

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const gigData = await getGigById(id);
        const bidData = await getBidsForGig(id);

        setGig(gigData);
        setBids(bidData || []);
      } catch (err) {
        setError("Failed to load gig details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // 🔥 BACKEND IS THE SOURCE OF TRUTH
  const isOwner = gig?.isOwner === true;

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await placeBid(id, { amount });
      setAmount("");

      const refreshed = await getBidsForGig(id);
      setBids(refreshed);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    }
  };

  const handleBidAction = async (bidId, status) => {
    try {
      await updateBidStatus(bidId, status);

      const refreshed = await getBidsForGig(id);
      setBids(refreshed);

      // refresh gig (status may change to CLOSED)
      const updatedGig = await getGigById(id);
      setGig(updatedGig);
    } catch (err) {
      alert("Action failed");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  if (!gig) return <p className="p-10 text-red-500">Gig not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* ================= GIG INFO ================= */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h1 className="text-3xl font-bold">{gig.title}</h1>
        <p className="text-gray-600 mt-2">{gig.description}</p>

        <div className="flex gap-4 mt-4 items-center">
          <StatusBadge status={gig.status} />
          <span className="font-semibold">₹{gig.budget}</span>
        </div>
      </div>

      {/* ================= PLACE BID ================= */}
      {!isOwner && gig.status === "OPEN" && (
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Place a Bid</h2>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <form onSubmit={handleBidSubmit} className="flex gap-4">
            <input
              type="number"
              required
              className="border px-4 py-2 rounded w-40"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* ================= BIDS ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Bids ({bids.length})
        </h2>

        {bids.length === 0 ? (
          <p className="text-sm text-gray-400">No bids yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Freelancer</th>
                <th className="py-2 text-left">Amount</th>
                <th className="py-2 text-left">Status</th>
                {isOwner && <th className="py-2 text-left">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {bids.map((bid) => (
                <tr key={bid._id} className="border-b">
                  <td className="py-2">
                    {bid.freelancerId?.name || "User"}
                  </td>
                  <td className="py-2">₹{bid.price}</td>
                  <td className="py-2">
                    <StatusBadge status={bid.status} />
                  </td>

                  {isOwner && bid.status === "PENDING" && (
                    <td className="py-2 flex gap-2">
                      <button
                        onClick={() =>
                          handleBidAction(bid._id, "ACCEPTED")
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          handleBidAction(bid._id, "REJECTED")
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
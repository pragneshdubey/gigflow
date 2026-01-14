import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyGigs } from "../../services/gig.service";
import { getMyBids } from "../../services/bid.service";
import { logout } from "../../services/auth.service";

import GigTable from "../../components/gigs/GigTable";
import BidTable from "../../components/gigs/BidTable";

export default function Dashboard() {
  const [gigs, setGigs] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [myGigs, myBids] = await Promise.all([
          getMyGigs(),
          getMyBids(),
        ]);

        setGigs(myGigs || []);
        setBids(myBids || []);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== Top Bar ===== */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">GigFlow</span>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/gigs")}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
            >
              Browse Gigs
            </button>

            <button
              onClick={() => navigate("/gigs/create")}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Gig
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <p className="text-gray-500">
            Manage your freelance activity and track your gigs.
          </p>
        </div>

        {/* My Posted Gigs */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">My Posted Gigs</h2>

          {gigs.length ? (
            <GigTable gigs={gigs} />
          ) : (
            <p className="text-sm text-gray-400">No gigs posted yet.</p>
          )}
        </div>

        {/* My Bids */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Bids</h2>
            <span className="text-sm text-gray-500">
              Total: {bids.length}
            </span>
          </div>

          {bids.length ? (
            <BidTable bids={bids} />
          ) : (
            <p className="text-sm text-gray-400">No bids yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

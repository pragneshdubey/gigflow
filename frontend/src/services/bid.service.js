import api from "../api/axios";

// Place bid
export const createBid = async (data) => {
  const res = await api.post("/bids", data);
  return res.data;
};

// My bids (Dashboard)
export const getMyBids = async () => {
  const res = await api.get("/bids/my");
  return res.data;
};

// Bids on a gig (GigDetails)
export const getBidsForGig = async (gigId) => {
  const res = await api.get(`/bids/gig/${gigId}`);
  return res.data;
};


// PLACE A BID (Freelancer)
// =======================

// PLACE BID
export const placeBid = async (gigId, data) => {
  const res = await api.post(`/bids/${gigId}`, data);
  return res.data;
};


// accept / reject bid
export const updateBidStatus = async (bidId, status) => {
  const res = await api.patch(
    `/bids/${bidId}/status`,
    { status },
    { withCredentials: true }
  );
  return res.data;
};

import api from "../api/axios";

// =======================
// GET ALL GIGS
// =======================
export const getAllGigs = async (search = "") => {
  const res = await api.get(`/gigs?search=${search}`);
  return res.data;
};


// =======================
// GET SINGLE GIG
// =======================
export const getGigById = async (gigId) => {
  const res = await api.get(`/gigs/${gigId}`);  
  return res.data;
};

// =======================
// CREATE GIG
// =======================
export const createGig = async (gigData) => {
  const res = await api.post("/gigs", gigData);
  return res.data;
};

// =======================
// UPDATE GIG
// =======================
export const updateGig = async (gigId, data) => {
  const res = await api.put(`/gigs/${gigId}`, data);
  return res.data;
};

// =======================
// DELETE GIG
// =======================
export const deleteGig = async (gigId) => {
  const res = await api.delete(`/gigs/${gigId}`);
  return res.data;
};

// =======================
// GET MY GIGS
// =======================
export const getMyGigs = async () => {
  const res = await api.get("/gigs/my");
  return res.data;
};

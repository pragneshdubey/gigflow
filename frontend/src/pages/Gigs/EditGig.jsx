import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGigById, updateGig } from "../../services/gig.service";

export default function EditGig() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  useEffect(() => {
    getGigById(id).then((gig) =>
      setForm({
        title: gig.title,
        description: gig.description,
        budget: gig.budget,
      })
    );
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateGig(id, form);
    navigate(`/gigs/${id}`);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Gig</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border">
        <input
          className="w-full border px-3 py-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="w-full border px-3 py-2 rounded"
          rows={5}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update Gig
        </button>
      </form>
    </div>
  );
}

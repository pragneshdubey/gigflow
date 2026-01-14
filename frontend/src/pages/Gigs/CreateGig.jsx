import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGig } from "../../services/gig.service";

export default function CreateGig() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createGig({
        title,
        description,
        budget: Number(budget),
      });

      navigate("/", { replace: true }); // ✅ dashboard
    } catch (err) {
      alert("Failed to create gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Post a New Gig</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl border"
      >
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Gig title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Gig description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Gig"}
        </button>
      </form>
    </div>
  );
}

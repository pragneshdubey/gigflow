import { Link } from "react-router-dom";

export default function GigCard({ gig }) {
  return (
    <div className="bg-white rounded-lg border p-5 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800">
        {gig.title}
      </h3>

      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
        {gig.description}
      </p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-blue-600 font-semibold">
          ₹{gig.budget}
        </span>

        <Link
          to={`/gigs/${gig._id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View →
        </Link>
      </div>
    </div>
  );
}

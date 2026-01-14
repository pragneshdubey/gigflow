import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function GigTable({ gigs }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2">Gig Title</th>
          <th className="py-2">Budget</th>
          <th className="py-2">Status</th>
          <th className="py-2 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {gigs.map((gig) => (
          <tr key={gig._id} className="border-b">
            <td className="py-2">{gig.title}</td>
            <td className="py-2">₹{gig.budget}</td>
            <td className="py-2">
              <StatusBadge status={gig.status} />
            </td>
            <td className="py-2 text-right">
              <Link
                to={`/gigs/${gig._id}`}
                className="text-blue-600 hover:underline"
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

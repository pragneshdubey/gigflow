import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function BidTable({ bids }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2">Gig Title</th>
          <th className="py-2">Bid Amount</th>
          <th className="py-2">Status</th>
          <th className="py-2 text-right">Action</th>
        </tr>
      </thead>

      <tbody>
        {bids.map((bid) => (
          <tr key={bid._id} className="border-b">
            <td className="py-2">{bid.gigId?.title}</td>
            <td className="py-2">₹{bid.price}</td>
            <td className="py-2">
              <StatusBadge status={bid.status} />
            </td>
            <td className="py-2 text-right">
              <Link
                to={`/gigs/${bid.gigId?._id}`}
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

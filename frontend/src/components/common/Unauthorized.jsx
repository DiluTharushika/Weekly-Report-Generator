import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Unauthorized</h2>
        <p className="text-gray-600 mb-4">You don’t have access to this page.</p>
        <Link className="text-blue-600" to="/">
          Go Home
        </Link>
      </div>
    </div>
  );
}
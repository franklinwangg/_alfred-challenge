import { useState } from "react";

export default function SearchForm({ onSearch }) {
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(location);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Enter location (e.g., UCSC)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 rounded w-64 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>
    </form>
  );
}

import { useState } from "react";
import SearchForm from "./components/SearchForm";
import CafeList from "./components/CafeList";

export default function App() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (location) => {
    setLoading(true);

    try {
      // Call your serverless function (backend) that fetches from Google Places API
      const res = await fetch(`/api/places?location=${encodeURIComponent(location)}`);
      const data = await res.json();

      setCafes(data.results || []);
    } catch (err) {
      console.error("Error fetching cafes:", err);
      setCafes([]);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Study Spot Finder</h1>
      <SearchForm onSearch={handleSearch} />
      {loading ? <p>Loading...</p> : <CafeList cafes={cafes} />}
    </div>
  );
}

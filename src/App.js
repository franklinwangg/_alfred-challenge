import { useState } from "react";
import SearchForm from "./components/SearchForm";
import CafeList from "./components/CafeList";

export default function App() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (location) => {
    setLoading(true);

    try {

      const now = new Date();
      console.log("Local time:", now.toString()); // e.g., "Fri Aug 22 2025 21:15:30 GMT-0700 (Pacific Daylight Time)"

      // var request = {
      //   placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      //   fields: ['name', 'rating', 'opening_hours']
      // };

      // service = new google.maps.places.PlacesService(map);
      // service.getDetails(request, callback);

      // function callback(place, status) {
      //   if (status == google.maps.places.PlacesServiceStatus.OK) {
      //     createMarker(place);
      //   }
      // }


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

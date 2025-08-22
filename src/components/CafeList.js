export default function CafeList({ cafes }) {
  if (!cafes || cafes.length === 0) return <p>No cafes found.</p>;

  return (
    <ul>
      {cafes.map((cafe) => {
        console.log("cafe:", cafe); // log here
        return (
          <li key={cafe.place_id} className="mb-2 p-2 border rounded">
            <strong>{cafe.name}</strong>
            <p>{cafe.vicinity}</p>
            {cafe.rating && <p>⭐ {cafe.rating}</p>}
            <p>
              Closing Time: {formatTimeToAMPM(cafe.closing_time)}
            </p>

          </li>
        );
      })}
    </ul>

  );
}

function formatTimeToAMPM(timeStr) {
  if (!timeStr) return "Unknown"; // handle missing time
  const [hourStr, minuteStr] = timeStr.split(":");
  let hours = parseInt(hourStr, 10);
  const minutes = minuteStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12; // 12 AM or 12 PM
  return `${hours}:${minutes} ${ampm}`;
}


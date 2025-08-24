export default function CafeCard({ cafe }) {
  const closingSoon = isClosingSoon(cafe);

  return (
    <li
      className={`p-4 border rounded ${
        closingSoon ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    >
      <strong className="text-lg">{cafe.name}</strong>
      <p>{cafe.vicinity}</p>
      {cafe.rating && <p>⭐ {cafe.rating}</p>}
      <p>Closing Time: {formatTimeToAMPM(cafe.closing_time)}</p>
    </li>
  );
}

function isClosingSoon(cafe) {
  if (!cafe.closing_time) return false;
  const [hourStr, minuteStr] = cafe.closing_time.split(":").map(Number);
  const now = new Date();
  const closingDate = new Date();
  closingDate.setHours(hourStr, minuteStr, 0, 0);
  const diffMinutes = (closingDate - now) / 60000;
  return diffMinutes > 0 && diffMinutes <= 30;
}

function formatTimeToAMPM(timeStr) {
  if (!timeStr) return "Unknown";
  const [hourStr, minuteStr] = timeStr.split(":");
  let hours = parseInt(hourStr, 10);
  const minutes = minuteStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

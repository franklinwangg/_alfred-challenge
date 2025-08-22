export default function CafeList({ cafes }) {
  if (!cafes || cafes.length === 0) return <p>No cafes found.</p>;

  return (
    <ul>
      {cafes.map((cafe) => (
        <li key={cafe.place_id} className="mb-2 p-2 border rounded">
          <strong>{cafe.name}</strong>
          <p>{cafe.vicinity}</p>
          {cafe.rating && <p>⭐ {cafe.rating}</p>}
        </li>
      ))}
    </ul>
  );
}

export default async function handler(req, res) {
  try {
    // 1) get the location from the request
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const { location, radius = 2000 } = req.query;
    if (!location) {
        
        return res.status(400).json({ error: "Missing location parameter" });
    }


    // 2) convert the location into coordinates
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
    );
    const geoData = await geoRes.json();

    if (geoData.status !== "OK") {
      return res.status(500).json({ error: "Geocoding failed", details: geoData });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    // 3) get all the nearby cafes that are open
    console.log(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=cafe&opennow=true&key=${apiKey}`);
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=cafe&opennow=true&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google API error:", data);
      return res.status(500).json({ error: "Google Places API error", details: data });
    }

    // 4) Return useful fields
    const results = data.results.map((place) => ({
      place_id: place.place_id,
      name: place.name,
      vicinity: place.vicinity,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      location: place.geometry?.location,
    }));

    res.status(200).json({ results });
  } catch (err) {
    console.error("Error in API function:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
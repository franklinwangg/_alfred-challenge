export default async function handler(req, res) {
  console.log("places api started 1");

  try {
    // 1) get the location from the request
    console.log("places api started 2");

    const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
    const { location, radius = 2000 } = req.query;
    if (!location) {
      return res.status(400).json({ error: "Missing location parameter" });
    }

    // 2) convert the location into coordinates
    console.log("places api started 3");

    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${apiKey}`
    );
    const geoData = await geoRes.json();

    if (geoData.status !== "OK") {
      return res
        .status(500)
        .json({ error: "Geocoding failed", details: geoData });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    // 2) Nearby Search for open cafes
    console.log("places api started 4");

    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=cafe&opennow=true&key=${apiKey}`;
    // const nearbyRes = await fetch(nearbyUrl);
    // const nearbyData = await nearbyRes.json();
    const nearbyRes = await fetch(nearbyUrl);
    const nearbyData = await nearbyRes.json();

    if (!nearbyData.results || nearbyData.results.length === 0) {
      return res.status(200).json({ results: [] });
    }

    if (nearbyData.status != "OK") {
      return res
        .status(500)
        .json({ error: "Google Places API error", details: nearbyData });
    }

    // 4) return the places that are open, plus their closing times
    // 3) For each cafe, fetch details to get closing time
    console.log("places api started 5");

    const cafesWithClosingTimes = await Promise.all(
      nearbyData.results.map(async (place) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,opening_hours,formatted_address,rating,user_ratings_total&key=${apiKey}`;
        const detailsRes = await fetch(detailsUrl);
        const detailsData = await detailsRes.json();

        let closingTime = null;
        if (detailsData.result.opening_hours?.periods) {
          const today = new Date().getDay();
          const todayPeriod = detailsData.result.opening_hours.periods.find(
            (p) => p.open.day === today
          );
          if (todayPeriod?.close) {
            closingTime = `${todayPeriod.close.time.slice(
              0,
              2
            )}:${todayPeriod.close.time.slice(2)}`;
          }
        }

        return {
          place_id: place.place_id,
          name: place.name,
          vicinity: place.vicinity,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          location: place.geometry?.location,
          closing_time: closingTime,
        };
      })
    );

    console.log("places api started 6");

    res.status(200).json({ results: cafesWithClosingTimes });
  } catch (err) {
    console.error("Error in API function:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default async function handler(req, res) {
  const haiphong_locations = [
    { name: 'Hồ Tây', lat: 20.8217, lon: 106.6881 },
    { name: 'Lạch Tray', lat: 20.8450, lon: 106.6800 },
    { name: 'Đồ Sơn', lat: 20.7934, lon: 106.7567 },
    { name: 'Cát Bà', lat: 20.7275, lon: 106.9667 },
    { name: 'Kiến An', lat: 20.8667, lon: 106.7000 },
    { name: 'Hải An', lat: 20.9000, lon: 106.7333 },
    { name: 'Thủy Nguyên', lat: 20.9500, lon: 106.6500 },
    { name: 'Vân Đồn', lat: 21.0167, lon: 107.3833 },
  ];

  const API_KEY = 'd4a2a324-3dff-4e51-8931-a6e95d3c93a7';

  try {
    const results = [];

    for (const location of haiphong_locations) {
      try {
        const response = await fetch(
          `https://api.waqi.info/feed/geo:${location.lat};${location.lon}/?token=${API_KEY}`
        );
        const data = await response.json();

        if (data.status === 'ok') {
          results.push({
            location: location.name,
            aqi: data.data.aqi,
            pm25: data.data.iaqi?.pm25?.v || 'N/A',
            pm10: data.data.iaqi?.pm10?.v || 'N/A',
            o3: data.data.iaqi?.o3?.v || 'N/A',
            no2: data.data.iaqi?.no2?.v || 'N/A',
            so2: data.data.iaqi?.so2?.v || 'N/A',
            co: data.data.iaqi?.co?.v || 'N/A',
            timestamp: data.data.time?.iso || new Date().toISOString()
          });
        }
      } catch (error) {
        console.log(`Không lấy được ${location.name}`);
      }
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy dữ liệu' });
  }
}
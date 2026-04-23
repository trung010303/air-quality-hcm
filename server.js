const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const mockData = [
  { location: 'Hồ Tây', aqi: 85, pm25: 45, pm10: 78, o3: 25, no2: 35, so2: 8, co: 0.5, timestamp: new Date().toISOString() },
  { location: 'Lạch Tray', aqi: 92, pm25: 52, pm10: 88, o3: 28, no2: 40, so2: 10, co: 0.6, timestamp: new Date().toISOString() },
  { location: 'Đồ Sơn', aqi: 78, pm25: 38, pm10: 68, o3: 22, no2: 32, so2: 7, co: 0.4, timestamp: new Date().toISOString() },
  { location: 'Cát Bà', aqi: 65, pm25: 28, pm10: 55, o3: 18, no2: 25, so2: 5, co: 0.3, timestamp: new Date().toISOString() },
  { location: 'Kiến An', aqi: 88, pm25: 48, pm10: 82, o3: 26, no2: 38, so2: 9, co: 0.55, timestamp: new Date().toISOString() },
  { location: 'Hải An', aqi: 95, pm25: 55, pm10: 92, o3: 30, no2: 42, so2: 11, co: 0.65, timestamp: new Date().toISOString() },
  { location: 'Thủy Nguyên', aqi: 72, pm25: 32, pm10: 62, o3: 20, no2: 28, so2: 6, co: 0.35, timestamp: new Date().toISOString() },
  { location: 'Vân Đồn', aqi: 105, pm25: 62, pm10: 102, o3: 35, no2: 48, so2: 13, co: 0.75, timestamp: new Date().toISOString() },
];

app.get('/api/air-quality', (req, res) => {
  res.json(mockData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌍 Server đang chạy trên http://localhost:${PORT}`);
});
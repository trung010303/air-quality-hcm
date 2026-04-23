let allData = [];

async function fetchAirQuality() {
  const loading = document.getElementById('loading');
  const content = document.getElementById('content');
  
  loading.style.display = 'block';
  content.style.display = 'none';

  try {
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

    const API_KEY = 'd4a2a324-3dff-4e51-8931-a6e95d3c93a7'; // Thay bằng API key của bạn

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
        console.log(`Không lấy được dữ liệu ${location.name}`);
      }
    }

    allData = results.sort((a, b) => a.aqi - b.aqi);
    displayData(allData);
    updateStats(allData);

    loading.style.display = 'none';
    content.style.display = 'block';
  } catch (error) {
    console.error('Lỗi:', error);
    loading.innerHTML = '<p style="color: white;">Lỗi khi tải dữ liệu!</p>';
  }
}

function displayData(data) {
  const grid = document.getElementById('airQualityGrid');
  grid.innerHTML = '';
  data.forEach(item => {
    const card = createCard(item);
    grid.appendChild(card);
  });
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'air-quality-card';
  
  const statusClass = getStatusClass(item.aqi);
  const statusText = getStatusText(item.aqi);

  card.innerHTML = `
    <div class="card-header">
      <h2>${item.location}</h2>
      <div class="aqi-badge ${statusClass}">${item.aqi}</div>
    </div>
    <div class="status-text" style="color: ${getStatusColor(item.aqi)};">${statusText}</div>
    <div class="card-body">
      <div class="pollutant">
        <span class="pollutant-name">PM2.5</span>
        <span class="pollutant-value">${item.pm25 !== 'N/A' ? item.pm25 + ' μg/m³' : 'N/A'}</span>
      </div>
      <div class="pollutant">
        <span class="pollutant-name">PM10</span>
        <span class="pollutant-value">${item.pm10 !== 'N/A' ? item.pm10 + ' μg/m³' : 'N/A'}</span>
      </div>
      <div class="pollutant">
        <span class="pollutant-name">O₃</span>
        <span class="pollutant-value">${item.o3 !== 'N/A' ? item.o3 + ' ppb' : 'N/A'}</span>
      </div>
      <div class="pollutant">
        <span class="pollutant-name">NO₂</span>
        <span class="pollutant-value">${item.no2 !== 'N/A' ? item.no2 + ' ppb' : 'N/A'}</span>
      </div>
      <div class="pollutant">
        <span class="pollutant-name">SO₂</span>
        <span class="pollutant-value">${item.so2 !== 'N/A' ? item.so2 + ' ppb' : 'N/A'}</span>
      </div>
      <div class="pollutant">
        <span class="pollutant-name">CO</span>
        <span class="pollutant-value">${item.co !== 'N/A' ? item.co + ' ppm' : 'N/A'}</span>
      </div>
    </div>
    <div class="update-time">Cập nhật: ${new Date(item.timestamp).toLocaleString('vi-VN')}</div>
    <button class="details-btn" onclick="showDetails('${item.location}', ${item.aqi})">Chi tiết</button>
  `;
  return card;
}

function getStatusClass(aqi) {
  if (aqi <= 50) return 'status-good';
  if (aqi <= 100) return 'status-moderate';
  if (aqi <= 150) return 'status-unhealthy';
  if (aqi <= 200) return 'status-very-unhealthy';
  return 'status-hazardous';
}

function getStatusText(aqi) {
  if (aqi <= 50) return 'Tốt';
  if (aqi <= 100) return 'Khá';
  if (aqi <= 150) return 'Trung bình';
  if (aqi <= 200) return 'Xấu';
  return 'Rất xấu';
}

function getStatusColor(aqi) {
  if (aqi <= 50) return '#4CAF50';
  if (aqi <= 100) return '#FFC107';
  if (aqi <= 150) return '#FF9800';
  if (aqi <= 200) return '#F44336';
  return '#9C27B0';
}

function updateStats(data) {
  document.getElementById('totalLocations').textContent = data.length;
  const avgAQI = Math.round(data.reduce((sum, item) => sum + item.aqi, 0) / data.length);
  document.getElementById('averageAQI').textContent = avgAQI;
  
  const worst = data.reduce((max, item) => item.aqi > max.aqi ? item : max);
  document.getElementById('worstLocation').textContent = `${worst.location} (${worst.aqi})`;
  
  const best = data.reduce((min, item) => item.aqi < min.aqi ? item : min);
  document.getElementById('bestLocation').textContent = `${best.location} (${best.aqi})`;
}

document.getElementById('searchInput').addEventListener('keyup', (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allData.filter(item => item.location.toLowerCase().includes(keyword));
  displayData(filtered);
});

document.getElementById('sortSelect').addEventListener('change', (e) => {
  const option = e.target.value;
  let sorted = [...allData];
  if (option === 'aqi-asc') {
    sorted.sort((a, b) => a.aqi - b.aqi);
  } else if (option === 'aqi-desc') {
    sorted.sort((a, b) => b.aqi - a.aqi);
  } else if (option === 'name') {
    sorted.sort((a, b) => a.location.localeCompare(b.location));
  }
  displayData(sorted);
});

function showDetails(location, aqi) {
  const modal = document.getElementById('detailModal');
  const modalBody = document.getElementById('modalBody');
  
  let advice = '';
  if (aqi <= 50) advice = '✅ Chất lượng không khí tốt. Bạn có thể hoạt động ngoài trời bình thường.';
  else if (aqi <= 100) advice = '⚠️ Chất lượng không khí khá. Những người nhạy cảm nên hạn chế hoạt động ngoài trời.';
  else if (aqi <= 150) advice = '⚠️ Chất lượng không khí trung bình. Nên hạn chế hoạt động ngoài trời kéo dài.';
  else if (aqi <= 200) advice = '🚫 Chất lượng không khí xấu. Hạn chế hoạt động ngoài trời.';
  else advice = '🚫 Chất lượng không khí rất xấu. Tránh hoạt động ngoài trời.';

  modalBody.innerHTML = `
    <h2>${location}</h2>
    <div style="text-align: center; margin: 20px 0;">
      <div style="font-size: 48px; color: ${getStatusColor(aqi)};">${aqi}</div>
      <p style="color: #666; margin-top: 10px;">${getStatusText(aqi)}</p>
    </div>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="line-height: 1.6;">${advice}</p>
    </div>
    <h3 style="margin-top: 20px;">Lời khuyên:</h3>
    <ul style="line-height: 1.8; color: #666;">
      <li>Đeo khẩu trang N95 khi ra ngoài</li>
      <li>Hạn chế hoạt động thể chất ngoài trời</li>
      <li>Đóng cửa sổ, bật máy lọc không khí</li>
      <li>Tăng cường uống nước</li>
      <li>Kiểm tra sức khỏe định kỳ</li>
    </ul>
  `;
  modal.style.display = 'block';
}

function closeModal() {
  document.getElementById('detailModal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('detailModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

window.addEventListener('load', fetchAirQuality);
setInterval(fetchAirQuality, 5 * 60 * 1000);
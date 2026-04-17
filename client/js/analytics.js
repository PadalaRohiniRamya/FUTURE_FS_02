// Analytics - Canvas-based charts
function drawDonutChart(canvasId, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 85;
  const innerRadius = 55;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let startAngle = -Math.PI / 2;

  data.forEach((item, i) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    startAngle += sliceAngle;
  });

  // Center text
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 28px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total, cx, cy - 8);
  ctx.font = '12px Inter';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Total', cx, cy + 14);
}

function drawBarChart(canvasId, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const padding = 40;
  const barWidth = 50;
  const gap = 20;
  const chartHeight = canvas.height - padding * 2;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const startX = (canvas.width - (data.length * (barWidth + gap) - gap)) / 2;

  data.forEach((item, i) => {
    const barHeight = (item.value / maxVal) * chartHeight;
    const x = startX + i * (barWidth + gap);
    const y = canvas.height - padding - barHeight;

    // Bar with rounded top
    const r = 6;
    ctx.beginPath();
    ctx.moveTo(x, y + barHeight);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.lineTo(x + barWidth - r, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
    ctx.lineTo(x + barWidth, y + barHeight);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();

    // Value label
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(item.value, x + barWidth / 2, y - 10);

    // Category label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter';
    ctx.fillText(item.label, x + barWidth / 2, canvas.height - 15);
  });
}

function renderLegend(containerId, data, colors) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = data.map((item, i) =>
    `<div class="legend-item">
      <span class="legend-dot" style="background:${colors[i]}"></span>
      ${item.label}: ${item.value}
    </div>`
  ).join('');
}

function renderCharts(stats) {
  const statusData = [
    { label: 'New', value: stats.new || 0 },
    { label: 'Contacted', value: stats.contacted || 0 },
    { label: 'Converted', value: stats.converted || 0 }
  ];
  const statusColors = ['#22d3ee', '#f59e0b', '#10b981'];
  drawDonutChart('statusChart', statusData, statusColors);
  renderLegend('statusLegend', statusData, statusColors);

  const sourceMap = {};
  (stats.sourceStats || []).forEach(s => { sourceMap[s._id] = s.count; });
  const sourceData = [
    { label: 'Website', value: sourceMap.website || 0 },
    { label: 'Referral', value: sourceMap.referral || 0 },
    { label: 'Social', value: sourceMap.social || 0 },
    { label: 'Other', value: sourceMap.other || 0 }
  ];
  const sourceColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];
  drawBarChart('sourceChart', sourceData, sourceColors);
  renderLegend('sourceLegend', sourceData, sourceColors);
}

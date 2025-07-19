const circle = document.querySelector('circle.progress');
const speedEl = document.getElementById('speed');
const maxSpeedEl = document.getElementById('max-speed');

const radius = 45;
const fullCircumference = 2 * Math.PI * radius;
const visibleRatio = 0.75; 
const visibleLength = fullCircumference * visibleRatio;

circle.style.strokeDasharray = `${fullCircumference}`;
circle.style.strokeDashoffset = `${fullCircumference}`;

let maxSpeed = 0;

function updateGauge(value) {
  const ratio = Math.min(Math.max(value / 999, 0), 1);
  const offset = fullCircumference - visibleLength * ratio;
  circle.style.strokeDashoffset = offset;

  const displaySpeed = Math.floor(value);
  speedEl.textContent = displaySpeed;

  if (displaySpeed > maxSpeed) {
    maxSpeed = displaySpeed;
    maxSpeedEl.textContent = `MAX ${maxSpeed} km`;
  }
}

// GPS取得（実機用）
if ("geolocation" in navigator) {
  navigator.geolocation.watchPosition(
    (position) => {
      const speed = position.coords.speed;
      const kmh = speed ? speed * 3.6 : 0;
      updateGauge(kmh);
    },
    (error) => {
      console.error("位置情報取得エラー:", error);
    },
    { enableHighAccuracy: true }
  );
}

// Service Worker登録
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("serviceWorker.js");
}

// テストアニメーション（必要なときだけON）
let value = 0;
let direction = 1;

function animate() {
  updateGauge(value);
  value += direction * 5;

  if (value >= 999 || value <= 0) {
    direction *= -1;
  }

  requestAnimationFrame(animate);
}

// animate(); // ← テストしたい時はこのコメントを外す
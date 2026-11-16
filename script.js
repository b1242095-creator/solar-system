"use strict";

// 天文數據採 NASA 行星資料表。動畫週期另外設定，方便同時觀察內外行星。
const planets = [
  { id: "mercury", name: "水星", type: "類地行星", size: 12, year: 88, distance: 57.9, seconds: 9, angle: 217,
    description: "最靠近太陽，也是八大行星中最小的一顆。表面布滿撞擊坑，晝夜溫差很大。" },
  { id: "venus", name: "金星", type: "類地行星", size: 17, year: 224.7, distance: 108.2, seconds: 14, angle: 305,
    description: "濃密的二氧化碳大氣造成強烈的溫室效應，使金星成為太陽系表面最熱的行星。" },
  { id: "earth", name: "地球", type: "類地行星", size: 21, year: 365.2, distance: 149.6, seconds: 20, angle: 136,
    description: "地球是我們的家園。海洋覆蓋了大部分地表，也是目前唯一已知孕育生命的行星。" },
  { id: "mars", name: "火星", type: "類地行星", size: 15, year: 687, distance: 228, seconds: 27, angle: 18,
    description: "地表的氧化鐵使火星呈現紅色。它有兩顆小衛星，地表還有巨大的奧林帕斯山。" },
  { id: "jupiter", name: "木星", type: "氣體巨行星", size: 38, year: 4331, distance: 778.5, seconds: 43, angle: 245,
    description: "太陽系最大的行星。雲層上的大紅斑是一場長期存在的巨大風暴。" },
  { id: "saturn", name: "土星", type: "氣體巨行星", size: 31, year: 10747, distance: 1432, seconds: 61, angle: 331,
    description: "土星以明亮寬廣的行星環聞名。環帶由大量冰粒和岩石碎屑構成。" },
  { id: "uranus", name: "天王星", type: "冰巨行星", size: 24, year: 30589, distance: 2867, seconds: 83, angle: 65,
    description: "大氣中的甲烷讓天王星呈現藍綠色。它的自轉軸幾乎躺在公轉軌道面上。" },
  { id: "neptune", name: "海王星", type: "冰巨行星", size: 23, year: 59800, distance: 4515, seconds: 108, angle: 163,
    description: "八大行星中離太陽最遠的一顆。低溫的大氣裡仍有速度驚人的強風。" },
];

const system = document.querySelector("#system");
const list = document.querySelector("#planet-list");
const stars = document.querySelector("#stars");
const speedInput = document.querySelector("#speed");
const speedOutput = document.querySelector("#speed-value");
const toggleButton = document.querySelector("#toggle");
const status = document.querySelector("#status");
const portrait = document.querySelector("#portrait");
const portraitBody = document.querySelector("#portrait-body");
const info = {
  name: document.querySelector("#planet-name"),
  type: document.querySelector("#planet-type"),
  description: document.querySelector("#planet-description"),
  period: document.querySelector("#planet-period"),
  distance: document.querySelector("#planet-distance"),
};
const number = new Intl.NumberFormat("zh-TW");
const initialPlanet = "earth";
let selectedId;
let running = true;
let speed = 1;
let elapsed = 0;
let previousTime = null;
let frameId = null;

function makeRing() {
  const ring = document.createElement("span");
  ring.className = "ring";
  return ring;
}

// 軌道和行星位置共用同一個半徑，確保版面縮放後仍在圓周上。
const bodies = planets.map((planet, index) => {
  const radius = 13 + index * (36 / (planets.length - 1));
  const orbit = document.createElement("div");
  orbit.className = "orbit";
  orbit.style.setProperty("--diameter", `${radius * 2}%`);
  orbit.setAttribute("aria-hidden", "true");
  system.prepend(orbit);

  const button = document.createElement("button");
  button.type = "button";
  button.className = `planet ${planet.id}`;
  button.style.setProperty("--desktop-size", `${planet.size}px`);
  button.setAttribute("aria-label", planet.name);
  const orb = document.createElement("span");
  orb.className = "orb";
  orb.setAttribute("aria-hidden", "true");
  if (planet.id === "saturn") orb.append(makeRing());

  const label = document.createElement("span");
  label.className = "planet-name";
  label.textContent = planet.name;
  const hint = document.createElement("span");
  hint.className = "planet-hint";
  hint.textContent = `${planet.name} · 查看資料`;
  hint.setAttribute("aria-hidden", "true");
  button.append(orb, label, hint);
  button.addEventListener("click", () => selectPlanet(planet.id));
  system.append(button);

  const option = document.createElement("button");
  option.type = "button";
  option.className = `planet-option ${planet.id}`;
  option.textContent = planet.name;
  option.addEventListener("click", () => selectPlanet(planet.id));
  list.append(option);

  return { planet, radius, orbit, button, option };
});

function selectPlanet(id) {
  if (selectedId === id) return;
  selectedId = id;
  for (const { planet, orbit, button, option } of bodies) {
    const selected = planet.id === id;
    orbit.classList.toggle("is-selected", selected);
    for (const control of [button, option]) {
      control.classList.toggle("is-selected", selected);
      control.setAttribute("aria-pressed", String(selected));
    }
  }

  const planet = planets.find((entry) => entry.id === id);
  portrait.className = `portrait ${id}`;
  portraitBody.replaceChildren();
  if (id === "saturn") portraitBody.append(makeRing());
  info.name.textContent = planet.name;
  info.type.textContent = planet.type;
  info.description.textContent = planet.description;
  info.period.textContent = `${number.format(planet.year)} 地球日`;
  info.distance.textContent = `${number.format(planet.distance * 1_000_000)} 公里`;
}

// 每次載入建立星點，使用不同亮度和動畫延遲營造景深。
const starfield = document.createDocumentFragment();
for (let index = 0; index < 125; index += 1) {
  const star = document.createElement("span");
  const bright = index % 11 === 0;
  star.className = bright ? "star bright" : "star";
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.setProperty("--width", bright ? "2px" : `${0.8 + Math.random() * 0.8}px`);
  star.style.setProperty("--brightness", 0.35 + Math.random() * 0.59);
  star.style.setProperty("--duration", `${2 + Math.random() * 5}s`);
  star.style.setProperty("--delay", `${-Math.random() * 7}s`);
  starfield.append(star);
}
stars.append(starfield);

function drawOrbits() {
  for (const { planet, radius, button } of bodies) {
    const angle = (planet.angle / 360 + elapsed / planet.seconds) * 2 * Math.PI;
    button.style.left = `${50 + radius * Math.cos(angle)}%`;
    button.style.top = `${50 + radius * Math.sin(angle)}%`;
  }
}

// 以畫面更新間隔推進模擬時間，調速時保留行星目前的位置。
function tick(now) {
  if (previousTime !== null) {
    elapsed += Math.min((now - previousTime) / 1000, 0.05) * speed;
  }
  previousTime = now;
  drawOrbits();
  frameId = requestAnimationFrame(tick);
}

function setRunning(next) {
  running = next;
  document.body.classList.toggle("is-paused", !running);
  toggleButton.textContent = running ? "暫停" : "繼續";
  status.textContent = running ? "模擬運行中" : "模擬已暫停";
  if (frameId !== null) cancelAnimationFrame(frameId);
  previousTime = null;
  frameId = running ? requestAnimationFrame(tick) : null;
}

function updateSpeed() {
  speed = speedInput.valueAsNumber;
  const progress = (speed - Number(speedInput.min)) / (Number(speedInput.max) - Number(speedInput.min));
  speedInput.style.setProperty("--progress", `${progress * 100}%`);
  speedInput.setAttribute("aria-valuetext", `${speed.toFixed(1)} 倍`);
  speedOutput.value = `${speed.toFixed(1)}×`;
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function reset() {
  elapsed = 0;
  speedInput.value = "1";
  updateSpeed();
  selectPlanet(initialPlanet);
  drawOrbits();
  setRunning(!reducedMotion.matches);
}

speedInput.addEventListener("input", updateSpeed);
toggleButton.addEventListener("click", () => setRunning(!running));
document.querySelector("#reset").addEventListener("click", reset);
reset();

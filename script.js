// ==== 年月セレクトを生成 ====
const yearSelect = document.getElementById("year-select");
const monthSelect = document.getElementById("month-select");
const resultsDiv = document.getElementById("results");

for (let y = 2025; y <= 2027; y++) {
  let opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y + "年";
  yearSelect.appendChild(opt);
}

for (let m = 1; m <= 12; m++) {
  let opt = document.createElement("option");
  opt.value = m;
  opt.textContent = m + "月";
  monthSelect.appendChild(opt);
}

// ==== ランキング種類 ====
const rankingTypes = [
  { key: "半荘数ランキング", title: "半荘数ランキング" },
  { key: "総スコアランキング", title: "総スコアランキング" },
  { key: "最高スコアランキング", title: "最高スコアランキング" },
  { key: "平均スコアランキング", title: "平均スコアランキング" },
  { key: "平均着順ランキング", title: "平均着順ランキング" }
];

// ==== データ取得 ====
document.getElementById("search-button").addEventListener("click", () => {
  const year = yearSelect.value;
  const month = monthSelect.value;

  resultsDiv.innerHTML = ""; // リセット

  rankingTypes.forEach(rt => {
    fetchRanking(year, month, rt.key, rt.title);
  });
});

function fetchRanking(year, month, type, title) {
  const apiUrl = `https://script.google.com/macros/s/AKfycbyOKV9MCu4xcFP97ZsXPdA0lZ0y6VpH-9Cjq1XZZ_uebKRwvcXek3t_p7kYK6vbEUDJ/exec?year=${year}&month=${month}&type=${type}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      renderTable(title, data);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      renderTable(title, []);
    });
}

// ==== 表示用テーブル生成 ====
function renderTable(title, rows) {
  const container = document.createElement("div");

  const heading = document.createElement("h2");
  heading.textContent = title;
  container.appendChild(heading);

  const table = document.createElement("div");
  table.className = "table";

  // ヘッダー
  ["順位", "名前", "スコア"].forEach(h => {
    const div = document.createElement("div");
    div.className = "header";
    div.textContent = h;
    table.appendChild(div);
  });

  // データ
  rows.forEach((row, index) => {
    const rank = document.createElement("div");
    rank.className = "data";
    rank.textContent = index + 1;
    table.appendChild(rank);

    const name = document.createElement("div");
    name.className = "data";
    name.textContent = row[0] || "";
    table.appendChild(name);

    const score = document.createElement("div");
    score.className = "data";
    score.textContent = row[1] || "";
    table.appendChild(score);
  });

  container.appendChild(table);
  resultsDiv.appendChild(container);
}

async function loadRanking(targetId, year, month, type) {
  const url = `https://script.google.com/macros/s/AKfycbxssT9BzMxWm8pWTF_RwPPccfaQe3sZbDLHoAbT_4VPB1kC4bikLfh8_XTTUrPPetcY/exec?year=${year}&month=${month}&type=${encodeURIComponent(type)}`;
  const res = await fetch(url);
  const data = await res.json();

  const table = document.getElementById(targetId);

  // ラベル切り替え
  let label = "";
  if (type.includes("半荘数")) label = "半荘数";
  else if (type.includes("総スコア")) label = "総スコア";
  else if (type.includes("最高スコア")) label = "最高スコア";
  else if (type.includes("平均スコア")) label = "平均スコア";
  else if (type.includes("平均着順")) label = "平均着順";

  // ヘッダー
  table.innerHTML = `
    <div class="ranking-header">No.</div>
    <div class="ranking-header">名前</div>
    <div class="ranking-header">${label}</div>
  `;

  // データ行（件数は可変）
  data.forEach(row => {
    table.innerHTML += `
      <div class="ranking-data">${row.no}</div>
      <div class="ranking-data ranking-name">${row.name}</div>
      <div class="ranking-data ranking-score">${row.score}</div>
    `;
  });
}

function loadAll(year, month) {
  loadRanking("table-hansou", year, month, "半荘数ランキング");
  loadRanking("table-soscore", year, month, "総スコアランキング");
  loadRanking("table-maxscore", year, month, "最高スコアランキング");
  loadRanking("table-avgscore", year, month, "平均スコアランキング");
  loadRanking("table-avgposition", year, month, "平均着順ランキング");
}

// ボタンイベント
document.getElementById("search-button").addEventListener("click", () => {
  const year = document.getElementById("year-select").value;
  const month = document.getElementById("month-select").value;
  loadAll(year, month);
});

// 初期表示（例：2025年9月）
loadAll(2025, 9);

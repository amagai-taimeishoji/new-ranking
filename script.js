const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const rankingsDiv = document.getElementById('rankings');
const rankingTitle = document.getElementById('rankingTitle');

// 年・月プルダウン作成
for (let y = 2025; y <= 2027; y++) {
  const option = document.createElement('option');
  option.value = y;
  option.textContent = y;
  yearSelect.appendChild(option);
}

for (let m = 1; m <= 12; m++) {
  const option = document.createElement('option');
  option.value = m;
  option.textContent = m;
  monthSelect.appendChild(option);
}

// 初期値をひと月前に設定
const today = new Date();
today.setMonth(today.getMonth() - 1);
yearSelect.value = today.getFullYear();
monthSelect.value = today.getMonth() + 1;

// GAS URL
const GAS_URL = 'https://script.google.com/macros/s/xxxx/exec'; // ←自分のGAS URLに置き換え

// データ取得
async function fetchRanking(year, month) {
  const res = await fetch(`${GAS_URL}?year=${year}&month=${month}`);
  return await res.json();
}

// スコアフォーマット
function formatScore(value, type) {
  if (value === "" || value == null) return "";
  const num = parseFloat(value);
  if (isNaN(num)) return value;

  switch(type){
    case '半荘数': return `${num}半荘`;
    case '総スコア':
    case '最高スコア': return `${num.toFixed(1)}pt`;
    case '平均スコア': return `${num.toFixed(3)}pt`;
    case '平均着順': return `${num.toFixed(3)}位`;
    default: return num;
  }
}

// ランキング描画
function renderRanking(id, data, scoreType) {
  const tbody = document.querySelector(`#${id} tbody`);
  tbody.innerHTML = '';

  // ヘッダー行
  if(data.header && data.header.length === 3){
    const headerTr = document.createElement('tr');
    headerTr.innerHTML = `<th>${data.header[0]}</th><th>${data.header[1]}</th><th>${data.header[2]}</th>`;
    tbody.appendChild(headerTr);
  }

  // データ行
  data.rows.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.順位}位</td><td>${row.名前}</td><td>${formatScore(row.スコア, scoreType)}</td>`;
    tbody.appendChild(tr);
  });
}

// 更新処理
async function updateRankings() {
  loading.style.display = 'block';
  rankingsDiv.style.display = 'none';

  const year = yearSelect.value;
  const month = monthSelect.value;

  // タイトル更新
  rankingTitle.textContent = `${year}年${month}月ランキング`;

  try {
    const data = await fetchRanking(year, month);
    renderRanking('hanjanRanking', data['半荘数ランキング'], '半荘数');
    renderRanking('totalScoreRanking', data['総スコアランキング'], '総スコア');
    renderRanking('highestScoreRanking', data['最高スコアランキング'], '最高スコア');
    renderRanking('averageScoreRanking', data['平均スコアランキング'], '平均スコア');
    renderRanking('averageRankRanking', data['平均着順ランキング'], '平均着順');
  } catch (err) {
    console.error(err);
    loading.textContent = "データ取得に失敗しました…(T‐T)";
    return;
  }

  loading.style.display = 'none';
  rankingsDiv.style.display = 'block';
}

// 検索ボタン
searchBtn.addEventListener('click', updateRankings);

// 初期表示
updateRankings();

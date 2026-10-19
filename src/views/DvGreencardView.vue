<template>
  <div class="dv-sim">
<div class="band"><div class="wrap">
  <div class="eyebrow">Diversity Visa · DV-2027 審核模擬器</div>
  <span class="ai-tag"><b>AI 製作</b><span>內容與程式由 AI 協助產生，資料更新至 2026/10/19・<a href="#ai">詳見說明</a></span></span>
  <h1>美國綠卡抽籤：你過得了幾關？</h1>
  <p>依美國國務院公開的 DV 計畫規則與歷年中籤統計，照實際流程分兩個階段、四個步驟模擬：報名前先確認能不能報、抽中機率多高；中籤後再看排不排得到名額、面談能不能過。</p>
  <ol class="flow" aria-label="審核流程">
    <li class="phase-a"><a href="#s1"><span class="fl-n">報名階段 · 1</span><span class="fl-t">報名資格</span><span class="fl-d">2026/11/1 起 30 天</span></a></li>
    <li class="phase-a"><a href="#s2"><span class="fl-n">報名階段 · 2</span><span class="fl-t">中籤機率</span><span class="fl-d">2026/12/3 前公布</span></a></li>
    <li class="phase-b"><a href="#s3"><span class="fl-n">中籤後 · 3</span><span class="fl-t">排號</span><span class="fl-d">每月簽證公告</span></a></li>
    <li class="phase-b"><a href="#s4i"><span class="fl-n">中籤後 · 4</span><span class="fl-t">面談審查</span><span class="fl-d">2027/9/30 前完成</span></a></li>
  </ol>
</div></div>

<div class="wrap dv-main">

<div class="phase a"><span class="ph-k">PHASE A · 報名階段</span><h2>能不能報、抽中機率多高</h2><p>報名時系統只檢查出生地與報名資料，學歷、財力這些要等中籤後面談才審。</p></div>

<!-- STAGE 1 -->
<section class="stage" id="s1">
  <div class="stage-head"><span class="stage-no">STEP 1</span><h2>報名資格</h2><p>這些是報名當下就會檢查的項目，任何一項不符，報名會被取消資格，後面的機率直接歸零。</p></div>
  <div class="grid">
    <label class="f">你的出生地<select id="birth"></select></label>
    <label class="f">婚姻狀態<select id="marital"><option value="single">未婚</option><option value="married">已婚</option></select></label>
    <label class="f" id="spouseWrap" hidden>配偶出生地 <small>可改用配偶出生國報名</small><select id="spouseBirth"></select></label>

  </div>
  <div class="checks">
    <label class="check"><input type="checkbox" id="parentOpt"><span>我的出生地不是父母任一方的出生地，父母當時也不住在那裡（可改用父母出生國）</span></label>
    <label class="f hidden-inline" id="parentWrap" hidden style="max-width:320px">父母出生地<select id="parentBirth"></select></label>
    <label class="check"><input type="checkbox" id="passport" checked><span>持有有效、未過期護照，並能上傳個人資料頁與簽名頁 JPEG 掃描檔（DV-2027 新規）</span></label>
    <label class="check"><input type="checkbox" id="fee" checked><span>可線上繳交 1 美元報名費（DV-2027 新規）</span></label>
    <label class="check"><input type="checkbox" id="single" checked><span>本年度只送出一筆報名（重複報名會被取消資格）</span></label>
    <label class="check"><input type="checkbox" id="family" checked><span>已列出配偶與所有未滿 21 歲未婚子女（即使他們不一起移民）</span></label>
    <label class="check"><input type="checkbox" id="photo" checked><span>照片為近 6 個月內、符合規格，未戴眼鏡</span></label>
  </div>
  <ul class="results" id="r1"></ul>
  <div class="verdict-line"><span class="stamp" id="stamp1"></span><span id="charge"></span></div>
</section>

<!-- STAGE 2 -->
<section class="stage" id="s2">
  <div class="stage-head"><span class="stage-no">STEP 2</span><h2>中籤機率</h2><p>電腦在各地理區內隨機抽出。以下依歷年官方公布的中籤人數推估，含配偶與子女。</p></div>
  <div class="grid">
    <label class="f">試算年度<select id="year"><option value="2027" selected>DV-2027（今年，2026/11 報名）推估</option><option value="hist">DV-2024～2026 歷年平均</option></select></label>
    <label class="f" id="scenWrap">今年情境 <small>新規則對報名人數的影響還無法確定</small><select id="scen">
      <option value="low">保守：報名人數與往年相同</option><option value="mid" selected>基準：報名人數明顯減少</option><option value="high">樂觀：回到護照規定年代（DV-2022）</option></select></label>
  </div>
  <div id="factors">
    <h3>今年和往年不同的地方</h3>
    <ul class="results">
      <li class="ok"><span class="pill">機率 ↑</span><span>護照掃描檔變成必填。上次有護照規定的 DV-2022，全球合格報名只有 733 萬筆，DV-2024 取消規定後暴增到 2,218 萬筆。台灣人多數有護照，受影響較小，DV-2022 台灣中籤 574 人，是近年的兩倍以上。</span></li>
      <li class="ok"><span class="pill">機率 ↑</span><span>首次收 1 美元報名費，報名期只有 30 天且臨時公告，可能進一步減少報名人數。</span></li>
      <li class="mid"><span class="pill">變數</span><span>名額扣除 NACARA 等配額後約 5.2 萬個，和 DV-2026 相近；國務院這次會抽出多少人還沒公布。</span></li>
      <li class="no"><span class="pill">風險 ↓</span><span>12/3 才公布中籤，處理期只剩約 10 個月，2027/9/30 截止，排號偏後的人較可能來不及。政府也可能上訴改變時程。</span></li>
    </ul>
  </div>
  <div class="figures">
    <div class="fig"><div class="k">每年單筆報名中籤率</div><div class="v" id="pOne">–</div><div class="s" id="pOneN"></div></div>
    <div class="fig"><div class="k">夫妻兩人各自報名</div><div class="v" id="pTwo">–</div><div class="s" id="pTwoS"></div></div>
    <div class="fig"><div class="k">連續報名 <span id="yrsLbl">5</span> 年累積</div><div class="v" id="pYears">–</div><div class="s">假設每年中籤率不變</div></div>
  </div>
  <div class="two">
    <div><h3>會影響中籤率的因素</h3><ul class="results">
      <li class="ok"><span class="pill">影響</span><span>出生地所屬的地理區與國家：同區報名的人越多，機率越低</span></li>
      <li class="ok"><span class="pill">影響</span><span>夫妻雙方各自報名：機率約變兩倍</span></li>
      <li class="ok"><span class="pill">影響</span><span>報名資料是否正確：重複報名或照片不合規會被取消資格</span></li></ul></div>
    <div><h3>不會影響中籤率的因素</h3><ul class="results">
      <li class="mid"><span class="pill">無關</span><span>學歷高低、職業類別、收入、英文能力、年齡、性別</span></li>
      <li class="mid"><span class="pill">無關</span><span>報名時間早晚、付費代辦：同一地理區內每筆合格報名機會相同</span></li></ul>
      <p class="note" style="margin-top:8px">學歷與職業只是中籤後面談的門檻，達標即可，不加分。</p></div>
  </div>
  <div class="two">
    <div>
      <h3 id="dataTitle">台灣歷年登記中籤人數（含眷屬）</h3>
      <div class="bars" id="bars"></div>
      <p class="note" id="dataNote" style="margin-top:8px">來源：美國國務院 DV Selected Entrants 公告。DV-2023 未取得資料。</p>
    </div>
    <div class="checks" style="align-content:start">
      <label class="f" id="entriesWrap">台灣年報名人數假設（含眷屬）：<span id="entriesVal" style="font-family:var(--f-mono)"></span>
        <input type="range" id="entries" min="30000" max="80000" step="1000" value="45000">
        <small>DV-2019～2021 官方統計為 42,700～56,798 人，近年未公布。今年預設 45,000 人</small></label>
      <label class="f">連續報名年數：<span id="yrsVal" style="font-family:var(--f-mono)">5</span>
        <input type="range" id="yrs" min="1" max="10" step="1" value="5"></label>
      <label class="check" id="bothWrap"><input type="checkbox" id="both" checked><span>配偶也符合資格，夫妻各送一筆（彼此列為配偶）</span></label>
    </div>
  </div>
  <div class="row"><button id="draw">模擬抽一次籤</button><button class="ghost" id="draw10k">模擬 10,000 人抽籤</button></div>
  <div class="ticket" id="ticket"><span class="note">按下「模擬抽一次籤」看看結果。中籤後會產生案件編號，自動帶入下一關。</span></div>
</section>

<div class="phase b"><span class="ph-k">PHASE B · 中籤後</span><h2>排不排得到、面談過不過</h2><p>2026/12/3 前公布中籤後才開始。中籤人數約為名額的 2.5 倍，排號和面談都會淘汰人。建議報名前就先看過，提早準備文件。</p></div>

<!-- STAGE 3 -->
<section class="stage" id="s3">
  <div class="stage-head"><span class="stage-no">STEP 3</span><h2>排號：排得到名額嗎？</h2><p>中籤人數約為名額的 2.5 倍。每月簽證公告（Visa Bulletin）公布各區截止號碼，案件編號低於截止號碼才能面談。</p></div>
  <div class="grid">
    <label class="f">你的案件編號（亞洲區數字部分）<small>例如 AS00012345 輸入 12345</small><input type="number" id="caseNo" min="1" max="99999" value="18000"></label>
  </div>
  <div>
    <h3>對照 DV-2026 亞洲區截止號碼</h3>
    <div class="scale" id="scale"></div>
  </div>
  <ul class="results" id="r3"></ul>
</section>

<!-- STAGE 4 -->
<section class="stage" id="s4i">
  <div class="stage-head"><span class="stage-no">STEP 4</span><h2>面談審查</h2><p>排到號碼後，在美國在台協會（AIT）面談。審查學歷、財力、文件、體檢與背景，任何一項沒過，名額就會給下一位。</p></div>

  <div class="sub">
    <h3>4-1　學歷或工作經驗</h3>
    <p class="note">報名表上只是自行填寫，面談時才查證。只看有沒有達到高中，學歷更高不會提高中籤率。</p>
    <div class="grid">
    <label class="f">最高學歷<select id="edu">
      <option value="none">未完成高中</option><option value="hs">高中（職）畢業</option><option value="voc">專科／技術學院</option>
      <option value="ba" selected>大學學士</option><option value="ms">碩士</option><option value="phd">博士</option></select></label>
    <label class="f" id="jobWrap">職業 <small>學歷未達高中時，才用工作經驗代替</small><select id="job">
      <option value="5">醫師、藥師、律師（Job Zone 5）</option>
      <option value="4" selected>工程師、軟體開發、化學師、會計師（Job Zone 4）</option>
      <option value="4">護理師、教師（Job Zone 4）</option>
      <option value="3">電工、實驗室技術員、牙科助理（Job Zone 3）</option>
      <option value="2">門市銷售、司機、行政助理（Job Zone 2）</option>
      <option value="1">餐飲服務、清潔、收銀（Job Zone 1）</option></select></label>
    </div>
    <label class="check" id="workWrap"><input type="checkbox" id="work" checked><span>上述職業在過去 5 年內做滿 2 年</span></label>
    <ul class="results" id="r4e"></ul>
  </div>

  <div class="sub">
    <h3>4-2　財力證明（公共負擔審查）</h3>
    <p class="note">要證明到美國後不會依賴政府補助。一般以美國聯邦貧窮線 100% 為參考門檻，可用自己的存款與資產、美國工作錄取，或由美國公民／綠卡持有人簽 I-134 財力擔保。</p>
  <div class="grid">
    <label class="f">移民人數（含本人與隨行家人）<input type="number" id="hh" min="1" max="12" value="1"></label>
    <label class="f">可動用存款與資產（新台幣）<input type="number" id="assets" min="0" step="10000" value="800000"></label>
    <label class="f">匯率（1 美元兌新台幣）<small>請依當日匯率調整</small><input type="number" id="fx" min="1" step="0.1" value="31"></label>
  </div>
  <div class="checks">
    <label class="check"><input type="checkbox" id="joboffer"><span>有美國雇主的工作錄取（job offer）</span></label>
    <label class="check"><input type="checkbox" id="sponsor"><span>有美國公民或綠卡持有人願意簽 I-134 財力擔保</span></label>
    <label class="check"><input type="checkbox" id="health"><span>本人或家人有慢性病（如糖尿病、心血管疾病、肥胖、癌症、精神疾病）</span></label>
    <label class="check"><input type="checkbox" id="insure" checked><span>到美國後有醫療保險規劃（雇主保險或自購）</span></label>
  </div>
  <ul class="results" id="r4f"></ul>
  </div>

  <div class="sub">
  <div class="two">
    <div>
      <h3>4-3　文件與體檢（勾選已備妥）</h3>
      <div class="checks" id="docs">
        <label class="check"><input type="checkbox" data-doc checked><span>DS-260 線上移民申請表（每位移民的家人各一份）</span></label>
        <label class="check"><input type="checkbox" data-doc checked><span>DV 申請費每人 330 美元，面談前繳交，不退費</span></label>
        <label class="check"><input type="checkbox" data-doc><span>戶籍謄本（含詳細記事，中英文版）作為出生證明</span></label>
        <label class="check"><input type="checkbox" data-doc><span>良民證（警察刑事紀錄證明），16 歲以上都要，向戶籍地警察局申請</span></label>
        <label class="check"><input type="checkbox" data-doc><span>高中以上畢業證書正本，或工作經驗證明</span></label>
        <label class="check"><input type="checkbox" data-doc><span>結婚或離婚證明（已婚、離婚者）</span></label>
        <label class="check"><input type="checkbox" data-doc><span>AIT 指定醫院體檢報告與疫苗接種紀錄</span></label>
        <label class="check"><input type="checkbox" data-doc checked><span>有效護照與 5×5 公分白底照片</span></label>
        <label class="check"><input type="checkbox" data-doc><span>入境前繳交 USCIS 移民費每人 235 美元（綠卡製卡費）</span></label>
      </div>
      <p class="note" style="margin-top:8px">有前科者另需法院判決書。台灣無軍方紀錄可申請，不需提供兵役紀錄。DS-260 會要求填寫過去 5 年的社群媒體帳號。</p>
    </div>
    <div>
      <h3>4-4　背景審查：不可入境事由（勾選曾經發生的）</h3>
      <div class="checks" id="bars2">
        <label class="check"><input type="checkbox" data-bar="逾期居留"><span>曾在美國逾期居留或非法打工</span></label>
        <label class="check"><input type="checkbox" data-bar="遭拒入境"><span>曾被美國拒絕入境或遣返</span></label>
        <label class="check"><input type="checkbox" data-bar="刑事紀錄"><span>曾被逮捕、起訴或判刑</span></label>
        <label class="check"><input type="checkbox" data-bar="不實陳述"><span>曾在美國簽證或入境時提供不實資料</span></label>
        <label class="check"><input type="checkbox" data-bar="藥物濫用"><span>有藥物濫用紀錄</span></label>
      </div>
    </div>
  </div>
  <ul class="results" id="r4d"></ul>
  </div>
</section>

<!-- VERDICT -->
<section class="stage" id="s4">
  <div class="stage-head"><span class="stage-no">RESULT</span><h2>綜合評估</h2></div>
  <ul class="results" id="r4"></ul>
  <div class="two">
    <div>
      <h3>DV-2027 時程（依 2026/10/14 法院命令）</h3>
      <ul class="timeline">
        <li><time>2026/10/29 前</time>國務院公告登記細節</li>
        <li><time>2026/11/1 起</time>開放線上登記，為期 30 天</li>
        <li><time>2026/12/3 前</time>通知中籤者（Entrant Status Check 查詢）</li>
        <li><time>2027/9/30</time>簽證核發截止，未用名額作廢</li>
      </ul>
    </div>
    <div class="checks" style="align-content:start">
      <h3>提醒</h3>
      <p class="note">唯一官方報名網址：<a href="https://dvprogram.state.gov/" target="_blank" rel="noopener">dvprogram.state.gov</a>。政府不會用 email 通知中籤，只能用確認碼自行查詢。</p>
      <p class="note">2025 年 12 月 DV 計畫曾遭暫停，目前靠法院命令恢復，後續仍可能有政策變動。</p>
      <p class="note">建議中籤公布前就先申請良民證、戶籍謄本與畢業證書，今年處理期只有約 10 個月。</p>
      <p class="note">財力門檻依 2026 年美國聯邦貧窮線（本土 48 州）計算：1 人 US$15,960，每多 1 人加 US$5,680。</p>
    </div>
  </div>
</section>
</div>

<div class="wrap dv-foot">
  <div class="ai-note" id="ai">
    <h3>AI 製作說明</h3>
    <ul>
      <li>本工具的資料蒐集、文字內容與網頁程式，由 AI（Anthropic 的 Claude）協助產生，再由審盾橘整理後發布。</li>
      <li>規則與數據來自美國國務院等公開資料，查證日期為 2026/10/19；DV-2027 正式規則預計 10/29 前公告，屆時可能變動。</li>
      <li>DV-2027 中籤率、台灣報名人數為依歷史數據推估的模擬值，不是官方數字。</li>
      <li>內容未經美國移民律師審閱。AI 可能出錯，重要決定請以官方公告為準，必要時諮詢專業律師。</li>
    </ul>
  </div>
  <p>本網站為非官方模擬工具，與美國政府無關，不構成法律意見。機率為依歷史數據推估，實際結果以美國國務院公告為準。</p>
  <p>資料來源：U.S. Department of State DV-2024／2025／2026 Selected Entrants、DV-2019–2021 Entrants by Country、Visa Bulletin（2025/11、2026/5）、DV-2027 護照與報名費最終規則（2026/3/11 公告）、Taiwan Reciprocity Schedule、2026 HHS Poverty Guidelines、國務院公共負擔指引（2025/11、2026/2）與 75 國移民簽證暫停措施（2026/1）。</p>
</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'DV 綠卡抽籤審核模擬｜資格、中籤機率、面談財力試算 - 審盾橘',
  meta: [
    { name: 'description', content: '美國多元移民簽證（DV 綠卡抽籤）四關審核模擬：資格判定、DV-2027 台灣中籤機率推估、案件編號排號評估、面談財力與文件檢核。非官方工具。' },
    { property: 'og:url', content: 'https://www.aicheck.com.tw/dv-greencard' },
  ],
  link: [
    { rel: 'canonical', href: 'https://www.aicheck.com.tw/dv-greencard' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@600;900&family=Noto+Sans+TC:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600&display=swap' },
  ],
})

onMounted(() => {

// region: AS Asia, EU Europe, AF Africa, OC Oceania, SA South America, NA North America; ok=eligible
const C = [
  ["TW","台灣","AS",true],["MO","澳門（歸葡萄牙／歐洲區）","EU",true],["JP","日本","AS",true],["SG","新加坡","AS",true],
  ["MY","馬來西亞","AS",true],["TH","泰國","AS",true],["ID","印尼","AS",true],["NP","尼泊爾","AS",true],["IR","伊朗","AS",true],
  ["CN","中國大陸","AS",false],["HK","香港","AS",false],["KR","南韓","AS",false],["VN","越南","AS",false],["PH","菲律賓","AS",false],
  ["IN","印度","AS",false],["BD","孟加拉","AS",false],["PK","巴基斯坦","AS",false],
  ["EU","歐洲國家（多數）","EU",true],["AU","澳洲","OC",true],["CA","加拿大","NA",false],["MX","墨西哥","NA",false],["NG","奈及利亞","AF",false],["AFX","其他非洲國家（多數）","AF",true]
];
const RN = {AS:"亞洲區",EU:"歐洲區",AF:"非洲區",OC:"大洋洲區",SA:"南美洲區",NA:"北美洲區"};
const byId = id=>document.getElementById(id);
const find = code=>C.find(c=>c[0]===code);
["birth","spouseBirth","parentBirth"].forEach((id,i)=>{
  const s=byId(id); C.forEach(c=>{const o=document.createElement("option");o.value=c[0];o.textContent=c[1]+(c[3]?"":"（不符資格）");s.appendChild(o)});
  s.value = i===0?"TW":"TW";
});
// historical data
const TW = [["DV-2022",574],["DV-2023",null],["DV-2024",279],["DV-2025",227],["DV-2026",247]];
const TW_AVG = (279+227+247)/3; // recent three years
const GLOBAL_P = 129516/(20822624*1.8); // selectees incl. family ÷ entries incl. ~1.8 family multiplier
// DV-2027 scenarios: Taiwan selectees (incl. family) and global qualified entries
const SCEN = {low:{tw:250,glob:20822624,name:"保守"},mid:{tw:400,glob:12000000,name:"基準"},high:{tw:574,glob:7336302,name:"樂觀"}};
const CUT = [{l:"2025/11",v:10000},{l:"2026/5",v:35000},{l:"後期公告",v:40000}];
const MAX = 50000;

let state = {eligible:true, region:"AS", code:"TW", p:0};

function li(cls,tag,text){return `<li class="${cls}"><span class="pill">${tag}</span><span>${text}</span></li>`}
const pct = p => p>=0.1? (p*100).toFixed(1)+"%" : (p*100).toFixed(2)+"%";

function stage1(){
  const married = byId("marital").value==="married";
  byId("spouseWrap").hidden=!married;
  byId("parentWrap").hidden=!byId("parentOpt").checked;
  const own=find(byId("birth").value), sp=find(byId("spouseBirth").value), pa=find(byId("parentBirth").value);
  let out=[], ok=true, charge=null, via="";
  if(own[3]){charge=own;via="本人出生地";out.push(li("ok","符合",`出生地「${own[1]}」屬 ${RN[own[2]]}，可報名。`))}
  else if(married && sp[3]){charge=sp;via="配偶出生地";out.push(li("mid","改用",`本人出生地不符，可改用配偶出生地「${sp[1]}」報名（${RN[sp[2]]}），但需與配偶同時取得簽證並一同入境。`))}
  else if(byId("parentOpt").checked && pa[3]){charge=pa;via="父母出生地";out.push(li("mid","改用",`本人出生地不符，可改用父母出生地「${pa[1]}」報名（${RN[pa[2]]}）。`))}
  else {ok=false;out.push(li("no","不符",`出生地「${own[1]}」近五年移民美國人數超過 5 萬，不在 DV 名單內；也沒有可改用的配偶或父母出生國。`))}
  const items=[["passport","護照資料與掃描檔","DV-2027 起報名必須提供有效護照並上傳掃描檔，否則無法送出。"],
    ["fee","1 美元報名費","DV-2027 起報名需繳 1 美元，無減免。"],
    ["single","單一報名","同一人送出兩筆以上，所有報名都會被取消資格。"],
    ["family","完整列出家人","漏列配偶或子女，中籤後會被拒發簽證。"],
    ["photo","照片規格","照片不合規是最常見的取消原因之一。"]];
  const passed=items.filter(([id])=>byId(id).checked);
  if(passed.length) out.push(li("ok","符合",passed.map(x=>x[1]).join("、")+"。"));
  items.forEach(([id,name,why])=>{ if(!byId(id).checked){ok=false;out.push(li("no","不符",name+"："+why))} });
  byId("r1").innerHTML=out.join("");
  const st=byId("stamp1"); st.className="stamp "+(ok?"ok":"no"); st.textContent=ok?"可以報名":"無法報名";
  byId("charge").innerHTML = ok? `以<b>${via}</b>認定，歸屬 <b>${charge[1]}・${RN[charge[2]]}</b>` : `<span class="note">修正標示「不符」的項目後再試一次。</span>`;
  state.eligible=ok; state.code=charge?charge[0]:null; state.region=charge?charge[2]:null;
  // spouse eligibility for dual entry
  const spouseEligible = married && (sp[3] || own[3]); // spouse can claim own or user's country
  byId("bothWrap").hidden=!married; state.dual = married && byId("both").checked && spouseEligible && ok;
}

function stage2(){
  const entries=+byId("entries").value, yrs=+byId("yrs").value;
  byId("entriesVal").textContent=entries.toLocaleString(); byId("yrsVal").textContent=yrs; byId("yrsLbl").textContent=yrs;
  const isTW = state.code==="TW";
  byId("entriesWrap").hidden=!isTW;
  const is27 = byId("year").value==="2027", sc=SCEN[byId("scen").value];
  byId("scenWrap").hidden=!is27; byId("factors").hidden=!is27;
  const twSel = is27? sc.tw : TW_AVG;
  let p = !state.eligible?0 : isTW? twSel/entries : (is27? 129516/(sc.glob*1.8) : GLOBAL_P);
  state.p=p; state.label = is27? `DV-2027 ${sc.name}情境` : "歷年平均";
  const pDual = state.dual? 1-(1-p)**2 : p;
  byId("pOne").textContent=pct(p);
  byId("pOneN").textContent = p? `約每 ${Math.round(1/p).toLocaleString()} 人中 1 人・${state.label}`+(isTW?"・台灣數據":"・全球平均") : "資格不符，無法參加抽籤";
  byId("pTwo").textContent = state.dual? pct(pDual) : "—";
  byId("pTwoS").textContent = state.dual? "任一人中籤，全家可一起申請" : (byId("marital").value==="married"?"未勾選夫妻雙報":"已婚才適用");
  byId("pYears").textContent = pct(1-(1-pDual)**yrs);
  byId("dataTitle").textContent = isTW? "台灣歷年登記中籤人數（含眷屬）" : "全球每年登記中籤人數（含眷屬）";
  if(isTW){
    const max=600;
    const rows = TW.map(([y,v])=>[y,v,""]); if(is27) rows.push(["DV-2027",sc.tw,"est"]);
    byId("bars").innerHTML=rows.map(([y,v,c])=>`<div class="bar"><span>${y}${c?"*":""}</span><div class="track"><div class="fill ${v?c:"na"}" style="width:${v?v/max*100:100}%"></div></div><span>${v??"—"}</span></div>`).join("");
    byId("dataNote").textContent="來源：美國國務院 DV Selected Entrants 公告。DV-2023 未取得資料；DV-2022 有護照規定，報名總數僅 733 萬筆。"+(is27?" *DV-2027 為本站推估，非官方數字。":"");
  } else {
    const g=[["DV-2024",143000],["DV-2025",131060],["DV-2026",129516]];
    byId("bars").innerHTML=g.map(([y,v])=>`<div class="bar"><span>${y}</span><div class="track"><div class="fill" style="width:${v/150000*100}%"></div></div><span>${Math.round(v/1000)}k</span></div>`).join("");
    byId("dataNote").textContent="此出生地沒有分國報名數，改用全球平均：中籤人數 ÷（合格報名數 × 約 1.8 的眷屬倍數）。";
  }
}

function stage3(){
  const n=+byId("caseNo").value||0;
  const sc=byId("scale");
  let html=`<div class="seg" style="left:0;width:${35000/MAX*100}%;background:var(--accent-soft)"></div>
  <div class="seg" style="left:${35000/MAX*100}%;width:${5000/MAX*100}%;background:var(--warn-soft)"></div>
  <div class="seg" style="left:${40000/MAX*100}%;width:${10000/MAX*100}%;background:var(--fail-soft)"></div>`;
  CUT.forEach(c=>html+=`<span class="lbl" style="left:${c.v/MAX*100}%">${c.l} ${c.v/1000}k</span>`);
  if(n>0) html+=`<div class="mark" style="left:calc(${Math.min(n,MAX)/MAX*100}% - 1px)" title="你的號碼"></div>`;
  sc.innerHTML=html;
  let out=[];
  if(state.region!=="AS" && state.eligible) out.push(li("mid","注意",`你歸屬${RN[state.region]}，下方以亞洲區截止號碼示範，實際請對照該區的簽證公告。`));
  if(!n) out.push(li("mid","未填","輸入案件編號，或在上一關模擬抽籤。"));
  else if(n<=35000) out.push(li("ok","有望",`編號 ${n.toLocaleString()} 低於 2026/5 亞洲區截止號碼 35,000，以 DV-2026 經驗來看在年度內輪到面談的機會高。`));
  else if(n<=40000) out.push(li("mid","邊緣",`編號 ${n.toLocaleString()} 介於 35,000～40,000，要到年度後期才可能輪到，要搶在 9/30 前完成面談。`));
  else out.push(li("no","偏低",`編號 ${n.toLocaleString()} 高於 DV-2026 公告過的最高截止號碼 40,000，名額可能在輪到你之前用完。`));
  out.push(li("no","今年","DV-2027 中籤名單 12/3 才公布，處理期只剩約 10 個月。DV-2026 恢復處理後的一個月內（8/28～9/28）只核發 2,026 張簽證，今年截止號碼的推進速度可能比往年慢。"));
  out.push(li("mid","提醒","伊朗、尼泊爾、阿富汗等國中籤人數多，會一起消耗亞洲區名額；尼泊爾另有較低的國別截止號碼。"));
  out.push(li("ok","對台灣有利","2026/1/21 起，美國以公共負擔為由暫停 75 國的移民簽證核發，亞洲區包括伊朗、阿富汗、尼泊爾、泰國、緬甸、寮國、柬埔寨等，台灣不在名單內。這些國家的中籤者若無法取得簽證，亞洲區名額消耗變慢，對台灣排號有利。此措施仍在訴訟中。"));
  byId("r3").innerHTML=out.join("");
  state.case=n;
}

// 2026 HHS poverty guidelines, 48 contiguous states
const FPL = n => 15960 + 5680*(Math.max(1,n)-1);
function stage4(){
  let eo=[], eduOk2=true;
  const eduSel=byId("edu"), eduOk = eduSel.value!=="none", work=byId("work").checked, zone=+byId("job").value;
  const eduName=eduSel.options[eduSel.selectedIndex].text;
  byId("jobWrap").hidden=eduOk; byId("workWrap").hidden=eduOk;
  if(eduOk) eo.push(li("ok","符合",`學歷「${eduName}」達高中門檻，面談時需出示畢業證明。學歷高低不影響中籤率。`));
  else if(zone>=4 && work) eo.push(li("ok","符合",`學歷未達，但職業屬 Job Zone ${zone}，且 5 年內做滿 2 年，可用工作經驗代替。面談需提出工作證明。`));
  else if(zone>=4) {eduOk2=false;eo.push(li("no","不符",`職業屬 Job Zone ${zone} 可代替學歷，但必須在過去 5 年內做滿 2 年。`))}
  else {eduOk2=false;eo.push(li("no","不符",`學歷未達高中，職業屬 Job Zone ${zone}，未達 Job Zone 4 的工作經驗門檻。報名時不會擋下，但面談會被拒。`))}
  byId("r4e").innerHTML=eo.join(""); state.edu=eduOk2;
  const n=+byId("hh").value||1, ntd=+byId("assets").value||0, fx=+byId("fx").value||31;
  const usd=ntd/fx, need=FPL(n);
  const job=byId("joboffer").checked, sp=byId("sponsor").checked, h=byId("health").checked, ins=byId("insure").checked;
  let out=[], fin;
  const usdTxt=`約 US$${Math.round(usd).toLocaleString()}`, needTxt=`US$${need.toLocaleString()}（新台幣約 ${Math.round(need*fx/10000)} 萬）`;
  if(usd>=need) {fin="ok"; out.push(li("ok","達標",`資產 ${usdTxt}，達到 ${n} 人家庭的貧窮線門檻 ${needTxt}。`))}
  else if(job||sp) {fin="ok"; out.push(li("ok","可補足",`資產 ${usdTxt}，低於門檻 ${needTxt}，但有${job?"美國工作錄取":""}${job&&sp?"及":""}${sp?" I-134 擔保人":""}可補足。`))}
  else {fin="no"; out.push(li("no","不足",`資產 ${usdTxt}，低於 ${n} 人家庭的門檻 ${needTxt}，且沒有工作錄取或擔保人，面談可能因公共負擔被拒。`))}
  if(usd>=need*1.25 && fin==="ok") out.push(li("ok","建議","資產超過門檻 1.25 倍，面談時較有說服力。"));
  if(h){ if(fin==="no") fin="no"; else fin = ins? "mid":"no";
    out.push(li(ins?"mid":"no","健康","2025/11 起，領事官可把慢性病（糖尿病、心血管疾病、肥胖、精神疾病等）列為公共負擔的負面因素，需證明有足夠財力或保險支應醫療費用。"+(ins?"":"目前沒有保險規劃，風險高。")));
  } else if(!ins) out.push(li("mid","保險","建議準備到美國後的醫療保險規劃，面談時可能被問到。"));
  byId("r4f").innerHTML=out.join("");
  const docs=[...document.querySelectorAll("[data-doc]")], done=docs.filter(d=>d.checked).length;
  const bars=[...document.querySelectorAll("[data-bar]")].filter(b=>b.checked).map(b=>b.dataset.bar);
  let o2=[];
  o2.push(done===docs.length? li("ok","備齊",`${done}／${docs.length} 項文件已備妥。`) : li("mid","未齊",`${done}／${docs.length} 項文件已備妥。文件不齊會被列為補件（221(g)），今年處理期短，補件可能來不及在 2027/9/30 前完成。`));
  o2.push(bars.length? li("no","高風險",`有不可入境事由：${bars.join("、")}。可能需要申請豁免或直接被拒，DV 處理期內通常來不及，建議先諮詢移民律師。`) : li("ok","無","未勾選不可入境事由。"));
  byId("r4d").innerHTML=o2.join("");
  state.fin=fin; state.docs=done===docs.length; state.bars=bars.length;
}

function verdict(){
  let out=[];
  out.push(state.eligible? li("ok","通過","第一步報名資格：可以報名。") : li("no","未過","第一步報名資格：目前無法參加抽籤。"));
  if(state.eligible){
    const p = state.dual? 1-(1-state.p)**2 : state.p;
    out.push(li("mid","機率",`第二步中籤機率（${state.label}）：中籤率約 ${pct(p)}（約 ${Math.round(1/p).toLocaleString()} 分之 1）。這是最難的一關。`));
    const n=state.case;
    out.push(n&&n<=35000? li("ok","有望","第三步排號：案件編號在常見截止範圍內。") : n&&n<=40000? li("mid","邊緣","第三步排號：案件編號偏後，時間緊。") : li("no","偏低","第三步排號：案件編號可能排不到名額。"));
    out.push(state.edu? li("ok","通過","第四步學歷：達到門檻。") : li("no","不符","第四步學歷：未達高中，也沒有符合條件的工作經驗。"));
    out.push(state.fin==="ok"? li("ok","通過","第四步財力：達到公共負擔門檻。") : state.fin==="mid"? li("mid","注意","第四步財力：達標，但健康因素可能被要求更多財力或保險證明。") : li("no","不足","第四步財力：未達公共負擔門檻。"));
    out.push(state.bars? li("no","高風險","第四步背景：有不可入境事由。") : state.docs? li("ok","備齊","第四步文件：已備齊，無不可入境事由。") : li("mid","未齊","第四步文件：尚未備齊，建議中籤前就先準備。"));
    out.push(li("mid","期限","全部要在 2027/9/30 前完成面談、取得簽證；簽證核發後通常 6 個月內要入境美國。"));
  }
  byId("r4").innerHTML=out.join("");
}

function all(){stage1();stage2();stage3();stage4();verdict()}
document.querySelectorAll("select,input").forEach(el=>el.addEventListener("input",all));

byId("draw").addEventListener("click",()=>{
  const t=byId("ticket");
  if(!state.eligible){t.innerHTML=`<span class="big" style="color:var(--fail)">無法抽籤</span><span>請先通過第一關資格審核。</span>`;return}
  const p = state.dual? 1-(1-state.p)**2 : state.p;
  const conf = Array.from({length:16},()=>"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random()*32)]).join("");
  if(Math.random()<p){
    const n=1+Math.floor(Math.random()*45000);
    const code=(state.region||"AS")+"2027"+String(n).padStart(6,"0");
    t.innerHTML=`<span>確認碼 ${conf}</span><span class="big" style="color:var(--pass)">SELECTED 中籤</span><span>案件編號 ${code}，已帶入第三關</span>`;
    byId("caseNo").value=n; all();
  } else {
    t.innerHTML=`<span>確認碼 ${conf}</span><span class="big" style="color:var(--fail)">NOT SELECTED</span><span>這次沒中。以目前機率，平均要抽 ${Math.round(1/p).toLocaleString()} 次才中一次。</span>`;
  }
});
byId("draw10k").addEventListener("click",()=>{
  const p = state.eligible?(state.dual? 1-(1-state.p)**2 : state.p):0;
  let hit=0; for(let i=0;i<10000;i++) if(Math.random()<p) hit++;
  byId("ticket").innerHTML=`<span>模擬 10,000 位和你條件相同的人報名</span><span class="big">${hit} 人中籤</span><span>其餘 ${(10000-hit).toLocaleString()} 人落選</span>`;
});
all();

})
</script>

<style>
.dv-sim{
  --paper:#eef2ef; --sheet:#fbfcfa; --ink:#17243d; --muted:#5b6678; --line:#cfd7d2;
  --accent:#1f6b52; --accent-soft:#dcebe3; --pass:#1f6b52; --warn:#a86a10; --warn-soft:#f6ead2;
  --fail:#b0352b; --fail-soft:#f6dcd8; --band:#17243d; --band-fg:#eef2ef;
  --f-display:"Noto Serif TC","Songti TC",serif;
  --f-body:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
  --f-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
}
.dv-sim *,.dv-sim *::before,.dv-sim *::after{box-sizing:border-box}
.dv-sim{background:var(--paper);color:var(--ink);font-family:var(--f-body);font-size:15px;line-height:1.65;text-align:left}
.dv-sim .wrap{max-width:980px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.dv-sim .band{background:var(--band);color:var(--band-fg)}
.dv-sim .band .wrap{padding-block:36px 30px;display:grid;gap:14px}
.dv-sim .eyebrow{font-family:var(--f-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.75}
.dv-sim h1{font-family:var(--f-display);font-weight:900;font-size:clamp(28px,5vw,44px);line-height:1.2;margin:0;text-wrap:balance}
.dv-sim .band p{margin:0;max-width:62ch;opacity:.88}
.dv-sim .status{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:13px;font-family:var(--f-mono)}
.dv-sim .status span b{color:var(--accent);font-weight:600}
.dv-sim .band .status span b{color:#8fd3b4}
.dv-sim .dv-main{padding-block:28px 48px;display:grid;gap:26px}
.dv-sim .stage{background:var(--sheet);border:1px solid var(--line);border-radius:6px;padding:24px clamp(16px,3vw,30px);display:grid;gap:18px;min-width:0}
.dv-sim .stage-head{display:flex;gap:14px;align-items:baseline;flex-wrap:wrap;border-bottom:1px dashed var(--line);padding-bottom:12px}
.dv-sim .stage-no{font-family:var(--f-mono);font-size:13px;color:var(--accent);font-weight:600;letter-spacing:.08em}
.dv-sim h2{font-family:var(--f-display);font-size:22px;margin:0;font-weight:900}
.dv-sim .stage-head p{margin:0;color:var(--muted);font-size:13.5px;flex-basis:100%}
.dv-sim .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px 20px}
.dv-sim label.f{display:grid;gap:6px;font-size:13.5px;font-weight:500;min-width:0}
.dv-sim label.f small{color:var(--muted);font-weight:400}
.dv-sim select,.dv-sim input[type=number]{font:inherit;color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:4px;padding:9px 10px;width:100%}
.dv-sim input[type=range]{width:100%;accent-color:var(--accent)}
.dv-sim select:focus-visible,.dv-sim input:focus-visible,.dv-sim button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.dv-sim .check{display:flex;gap:10px;align-items:flex-start;font-size:14px}
.dv-sim .check input{margin-top:5px;accent-color:var(--accent);width:16px;height:16px;flex:none}
.dv-sim .checks{display:grid;gap:10px}
.dv-sim .results{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.dv-sim .results li{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start;padding:9px 12px;border-radius:4px;font-size:14px}
.dv-sim .results li.ok{background:var(--accent-soft)}
.dv-sim .results li.no{background:var(--fail-soft)}
.dv-sim .results li.mid{background:var(--warn-soft)}
.dv-sim .pill{font-family:var(--f-mono);font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:99px;border:1.5px solid currentColor;white-space:nowrap;margin-top:2px}
.dv-sim .ok .pill{color:var(--pass)}
.dv-sim .no .pill{color:var(--fail)}
.dv-sim .mid .pill{color:var(--warn)}
.dv-sim .verdict-line{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.dv-sim .stamp{font-family:var(--f-display);font-weight:900;font-size:20px;padding:6px 16px;border:3px double currentColor;border-radius:4px;transform:rotate(-3deg);display:inline-block;letter-spacing:.1em}
.dv-sim .stamp.ok{color:var(--pass)}
.dv-sim .stamp.no{color:var(--fail)}
.dv-sim .stamp.mid{color:var(--warn)}
.dv-sim .figures{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
.dv-sim .fig{border-left:3px solid var(--accent);padding:4px 0 4px 12px;min-width:0}
.dv-sim .fig .k{font-size:12.5px;color:var(--muted)}
.dv-sim .fig .v{font-family:var(--f-mono);font-size:26px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.3}
.dv-sim .fig .s{font-size:12px;color:var(--muted)}
.dv-sim .two{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px}
.dv-sim .bars{display:grid;gap:8px}
.dv-sim .bar{display:grid;grid-template-columns:72px 1fr 48px;gap:10px;align-items:center;font-family:var(--f-mono);font-size:12.5px;font-variant-numeric:tabular-nums}
.dv-sim .track{height:12px;background:var(--paper);border-radius:2px;overflow:hidden}
.dv-sim .fill{height:100%;background:var(--accent)}
.dv-sim .fill.est{background:repeating-linear-gradient(45deg,var(--accent) 0 4px,var(--accent-soft) 4px 8px)}
.dv-sim .fill.na{background:repeating-linear-gradient(45deg,var(--line) 0 4px,transparent 4px 8px)}
.dv-sim h3{font-size:14.5px;margin:0 0 8px;font-weight:700}
.dv-sim .note{font-size:12.5px;color:var(--muted);margin:0}
.dv-sim button{font:inherit;font-weight:700;cursor:pointer;border-radius:4px;padding:10px 18px;border:1.5px solid var(--accent);background:var(--accent);color:var(--sheet)}
.dv-sim button.ghost{background:transparent;color:var(--accent)}
.dv-sim .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.dv-sim .ticket{font-family:var(--f-mono);border:1.5px dashed var(--line);border-radius:4px;padding:14px 16px;display:grid;gap:4px;font-size:13.5px;min-width:0;overflow-wrap:anywhere}
.dv-sim .ticket .big{font-size:20px;font-weight:600}
.dv-sim .scale{position:relative;height:44px;margin-top:6px}
.dv-sim .scale .seg{position:absolute;top:10px;height:12px}
.dv-sim .scale .mark{position:absolute;top:2px;width:2px;height:28px;background:var(--ink)}
.dv-sim .scale .lbl{position:absolute;top:28px;font-family:var(--f-mono);font-size:11px;color:var(--muted);transform:translateX(-50%);white-space:nowrap}
.dv-sim .timeline{display:grid;gap:0;margin:0;padding:0;list-style:none;border-left:2px solid var(--line);margin-left:6px}
.dv-sim .timeline li{position:relative;padding:0 0 12px 18px;font-size:14px}
.dv-sim .timeline li::before{content:"";position:absolute;left:-7px;top:7px;width:12px;height:12px;border-radius:50%;background:var(--sheet);border:2px solid var(--accent)}
.dv-sim .timeline time{font-family:var(--f-mono);font-size:12.5px;color:var(--accent);font-weight:600;display:block}
.dv-sim .dv-foot{padding-block:0 40px;font-size:12.5px;color:var(--muted);display:grid;gap:6px}
.dv-sim .dv-foot a,.dv-sim .stage a{color:var(--accent)}
.dv-sim [hidden]{display:none!important}
.dv-sim .stage,.dv-sim .ai-note{scroll-margin-top:84px}
.dv-sim .ai-tag{display:inline-flex;align-items:baseline;gap:8px;justify-self:start;max-width:100%;font-size:12.5px;line-height:1.5;border:1px solid currentColor;border-radius:6px;padding:4px 12px;opacity:.9}
.dv-sim .ai-tag b{font-family:var(--f-mono);letter-spacing:.06em;white-space:nowrap}
.dv-sim .ai-tag a{color:inherit;white-space:nowrap}
.dv-sim .flow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:0;padding:0;list-style:none;counter-reset:none}
.dv-sim .flow li{min-width:0;border-top:3px solid rgba(255,255,255,.25);padding:10px 12px 0 0}
.dv-sim .flow li.phase-a{border-top-color:#8fd3b4}
.dv-sim .flow li.phase-b{border-top-color:#e8c27a}
.dv-sim .flow a{color:inherit;text-decoration:none;display:grid;gap:2px}
.dv-sim .flow a:hover .fl-t,.dv-sim .flow a:focus-visible .fl-t{text-decoration:underline}
.dv-sim .flow .fl-n{font-family:var(--f-mono);font-size:11.5px;opacity:.75;letter-spacing:.08em}
.dv-sim .flow .fl-t{font-weight:700;font-size:14.5px}
.dv-sim .flow .fl-d{font-size:12px;opacity:.75}
@media (max-width:640px){.dv-sim .flow{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:12px}}
.dv-sim .phase{display:grid;gap:4px;padding-top:6px}
.dv-sim .phase .ph-k{font-family:var(--f-mono);font-size:12px;letter-spacing:.12em;color:var(--accent);font-weight:600}
.dv-sim .phase.b .ph-k{color:var(--warn)}
.dv-sim .phase h2{font-size:26px}
.dv-sim .phase p{margin:0;color:var(--muted);font-size:14px;max-width:70ch}
.dv-sim .sub{display:grid;gap:14px;border-top:1px dashed var(--line);padding-top:16px}
.dv-sim .stage-head + .sub{border-top:0;padding-top:0}
.dv-sim .sub h3{font-size:16px;margin:0}
.dv-sim .ai-note{border:1px solid var(--line);border-radius:6px;padding:14px 16px;display:grid;gap:6px;background:var(--sheet)}
.dv-sim .ai-note h3{margin:0}
.dv-sim .ai-note ul{margin:0;padding-left:1.2em;display:grid;gap:4px}
@media (prefers-reduced-motion:no-preference){.dv-sim .stamp{transition:transform .25s}.dv-sim .fill{transition:width .4s}}
.dv-sim [hidden]{display:none!important}
.dv-sim .stage,.dv-sim .ai-note{scroll-margin-top:84px}
.dv-sim h1,.dv-sim h2,.dv-sim h3{color:inherit}

</style>

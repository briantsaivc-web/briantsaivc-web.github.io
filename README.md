# Brian’s Playroom｜遊戲小屋

深藍鮮明的遊戲入口，手機單欄、平板雙欄、桌機三欄。每款遊戲獨立維護，本專案只管理封面、介紹、裝置建議與連結。

正式入口：https://briantsaivc-web.github.io/

## 新增遊戲：一筆資料＋一張圖

1. 先確認新遊戲的 GitHub Pages 網址能正常開啟。
2. 將封面放進 `assets/games/`，建議 3:2 橫向 WebP、檔案小於 400 KB。檔名使用英文小寫與連字號。
3. 在 `games.json` 複製一筆物件，修改下列欄位。物件之間以逗號分隔，最後一筆後面不要逗號。
4. 執行 `python tools/validate.py`，確認資料與圖片都正確。
5. 在手機與桌機預覽後，commit 並 push 到 `main`。GitHub Pages 會自動發布。

```json
{
  "id": "new-game",
  "title": "新遊戲名稱",
  "category": "邏輯解謎",
  "description": "一到兩句話，說明玩家可以做什麼。",
  "url": "https://briantsaivc-web.github.io/new-game/",
  "cover": "assets/games/new-game.webp",
  "coverAlt": "描述圖片內容，供螢幕閱讀器使用",
  "devices": ["phone", "tablet", "desktop"],
  "deviceLabel": "手機・平板・電腦",
  "deviceNote": "依實際測試結果填寫裝置建議。",
  "accent": "cyan",
  "order": 4,
  "published": true
}
```

| 欄位 | 維護規則 |
|---|---|
| `id` | 不重複的英文識別碼；只用小寫英數字與連字號 |
| `title` / `description` | 顯示名稱與簡介，文字由頁面安全插入，不需要寫 HTML |
| `category` | 自由填寫，如邏輯解謎、財商策略、數字推理 |
| `url` | 完整 HTTPS 遊戲入口；不要放 GitHub 原始碼頁面 |
| `cover` | 本專案內的封面路徑，區分大小寫 |
| `coverAlt` | 封面的文字描述 |
| `devices` | 已建議使用的裝置圖示：`phone` 手機、`tablet` 平板、`desktop` 電腦 |
| `deviceLabel` | 明確寫出建議装置；尚未驗證的裝置請如實標註 |
| `deviceNote` | 補充使用情境；不要把推測寫成已驗證 |
| `accent` | `gold`、`cyan`、`violet`，控制分類標籤顏色 |
| `order` | 數字越小越靠前，建議每款不同 |
| `published` | `true` 上架；`false` 隱藏，保留資料供日後重新上架 |

遊戲數量與排列自動更新，不必修改 HTML。第一版沒有分類選單或搜尋；數量增加後可使用既有的 `category` 欄位擴充。

## 修改與下架

- 改簡介／裝置建議：只修改 `games.json`。
- 改封面：建議換成新檔名，例如 `sudoku-v2.webp`，再修改 `cover`，避免快取舊圖。
- 調整順序：修改 `order`。
- 暫時下架：將 `published` 設為 `false`。
- 新遊戲維持自己的 repo，不要將遊戲本體搬入此入口專案。

## 本機預覽

不需要 npm、安裝套件或打包。

```sh
python tools/validate.py
python -m http.server 5174 --bind 127.0.0.1
```

瀏覽器開啟 http://127.0.0.1:5174/ 。請用 HTTP 預覽，直接雙擊 HTML 的 `file://` 模式不能載入遊戲 JSON。

## GitHub Pages

Repo 名稱必須是 `briantsaivc-web.github.io`。Settings → Pages → Deploy from a branch → `main`、`/ (root)`。

靜態入口刻意不註冊根路徑 Service Worker，以免影響同網域下各遊戲的離線快取。遊戲進度由各遊戲自己保存。

## 檔案

```text
index.html          頁面結構與網站資訊
styles.css          深藍主題、響應式版面
app.js              載入清單、自動產生卡片、重試載入
games.json          日常維護入口
assets/games/       遊戲封面
assets/favicon.svg  網站圖示
tools/validate.py   資料與資源檢查（Python 標準函式庫）
```

三張封面是為本網站生成的 AI 插畫，作為遊戲意象，並非實際遊戲畫面。

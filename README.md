# 太陽系模擬器

使用原生 HTML、CSS 和 JavaScript 製作的繁體中文互動網頁。從俯視角度觀察太陽與八大行星，並比較各行星的公轉週期及平均日距。

## 本機開啟

將 `index.html`、`style.css` 和 `script.js` 放在同一個資料夾，用瀏覽器開啟 [index.html](index.html) 即可。無需安裝套件、執行建置或啟動伺服器。

## 操作方式

- **查看行星**：點擊或輕觸軌道上的行星，也可從下方清單選取。資料面板會顯示名稱、簡介、公轉週期（地球日）及與太陽的平均距離（公里）。桌面版將滑鼠移到行星上會顯示提示。
- **調整速度**：拖動「公轉速度」滑桿，範圍為 **0.1～5 倍**。
- **暫停與繼續**：使用「暫停」凍結公轉和星空閃爍，使用「繼續」從目前位置恢復。
- **重設**：將行星移回起始位置，恢復 **1 倍速**並選取地球。若系統偏好減少動態效果，載入及重設時會保持暫停。

畫面支援電腦與手機，並以不同大小、顏色、光影及土星環呈現八大行星。圓形軌道、天體大小、軌道距離和動畫速度採示意比例。

## 檔案結構

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 頁面結構、資訊面板與操作介面 |
| `style.css` | 軌道、星空、行星外觀與響應式版面 |
| `script.js` | 行星資料、公轉動畫與互動控制 |

## 部署到 GitHub Pages

1. 將專案檔案推送到 GitHub 儲存庫的發布分支根目錄，例如 `main`。
2. 在儲存庫中開啟 **Settings → Pages**，將 **Source** 設為 **Deploy from a branch**。
3. 選擇該分支與 **/(root)**，按 **Save**。發布完成後，可在 **Settings → Pages** 開啟網站。參考 [GitHub Pages 發布設定](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 資料來源

公轉週期與平均日距取自 [NASA 行星資料表](https://nssdc.gsfc.nasa.gov/planetary/factsheet/)。

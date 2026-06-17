# 整书阅读 · 部署说明

「真 AI + 页面感知」的儿童整本书阅读演示站。前端构建为静态文件，由 Node/Express 后端统一 serve，并代理 LLM 提供 AI 陪读 / 找书。

## 架构
- **前端**：React 18 + Vite 5 + Tailwind（HashRouter），`npm run build` → `dist/`
- **后端**：Node + Express（`server/`），同时 ① serve `dist/` 静态站 ② 提供 `POST /api/chat`（页面感知 AI）+ `GET /api/health`
- **生产同源**：后端 serve dist，前端相对 `/api` 直达，无需跨域 / 代理

## 一、环境要求
- Node.js ≥ 18（用到 `node --watch`、原生 fetch）
- 一个 OpenAI 兼容的 LLM 端点 + key

## 二、部署步骤
```bash
# 1. 装依赖（前端 + 后端各一次）
npm install
cd server && npm install && cd ..

# 2. 配置 AI（复制模板填 key）
cp server/.env.example server/.env
#    编辑 server/.env：填 AI_BASE_URL / AI_API_KEY，按需调 AI_MODEL

# 3. 构建前端
npm run build            # 生成 dist/

# 4. 启动（默认 5191，serve dist + /api）
cd server && npm start
#    浏览器访问 http://<服务器IP>:5191
```

> 已 build 的部署包可跳过第 1、3 步的前端部分（dist 已在包内）：只需 `cd server && npm install`、配 `.env`、`npm start`。

## 三、环境变量（server/.env）
| 变量 | 说明 | 默认 |
|---|---|---|
| `PORT` | 服务端口 | `5191` |
| `AI_BASE_URL` | OpenAI 兼容端点（带 `/v1`） | — |
| `AI_API_KEY` | API key | — |
| `AI_MODEL` | 主模型 | `gpt-5.4-mini` |
| `AI_FALLBACK_MODELS` | 降级链（逗号分隔） | `gpt-5.4,gpt-5.5` |
| `AI_MAX_RETRIES` | 每模型重试次数 | `2` |
| `AI_TIMEOUT_MS` | 单请求超时(ms) | `30000` |
| `DIST_DIR` | 前端产物目录（相对 `server/`） | `../dist` |

> AI 链路自带 fallback / retry / 友好兜底：主模型失败自动按链降级，全失败返回友好提示而非报错，不会阻断页面。

## 四、验证
- `GET /api/health` → `{ok:true, ai:{...}}` 即后端 + AI 配置就绪
- 书架页：AI 找书向导；阅读页：**按住 Ctrl 拖选**正文 → 浮层「解释 / 问 AI / 标注」+ 右侧 AI 学伴结合当前页陪读

## 五、开发模式（本地改代码）
```bash
# 终端 A：后端
cd server && npm run dev         # 5191（--watch 热重启）

# 终端 B：前端（热更，vite 自动 proxy /api → 5191）
npm run dev                      # 5190
```
访问 http://127.0.0.1:5190

## 备注
- `server/.env` 含密钥，已 gitignore，**切勿提交**；每个部署各自填本地 `.env`
- 前端 js 单包约 1 MB（含 3D 翻页引擎），演示足够；如需优化可做 code-split

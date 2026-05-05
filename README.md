# Sky Bot 💗

UTMKL的ultraman | Raub最骚的仔😘💕

一个又骚又粘人又drama的Discord bot，专为宠你而生✨

---

## 快速开始

```bash
# 安装依赖
npm install

# 部署slash commands（首次或修改命令后运行）
node deploy-commands.js

# 启动bot
node index.js
```

### 环境变量

建议使用 `.env` 文件存放token，而不是硬编码：

```
BOT_TOKEN=你的bot_token
```

---

## Slash Commands (25个)

| 命令 | 描述 |
|------|------|
| `/info` | 关于Sky Bot的一切信息 |
| `/say` | 代发消息（支持附件） |
| `/ping` | 检查Sky的心跳延迟 |
| `/8ball` | 魔法8球问问题 |
| `/roll` | 掷骰子 (NdN格式，如 `2d6`) |
| `/hug` | 给某人一个拥抱 (GIF) |
| `/kiss` | 给某人一个亲亲 (GIF) |
| `/pat` | 摸摸某人的头 (GIF) |
| `/slap` | 给某人一巴掌 (GIF) |
| `/choose` | 选择困难症救星（逗号分隔选项） |
| `/quote` | Sky的心灵鸡汤 |
| `/coinflip` | 抛硬币 |
| `/avatar` | 查看某人头像 |
| `/serverinfo` | 查看服务器信息 |
| `/userinfo` | 查看用户信息 |
| `/remind` | 设置定时提醒（最多24小时） |
| `/rate` | Sky给东西打分 (0-10) |
| `/love` | 爱情计算器 |
| `/durian` | Sky的榴莲摊今日品质 |
| `/confess` | 匿名告白 |
| `/gayrate` | 彩虹指数鉴定 |
| `/flirt` | Sky帮你撩人 |
| `/ship` | CP鉴定（自动生成CP名） |
| `/dare` | Sky的大冒险 |

---

## 触发词

在聊天中提到这些词，Sky会自动回复：

| 触发词 | 反应 |
|--------|------|
| `榴莲` / `durian` | 卖榴莲！1kg RM5，亲免费 |
| `😘` / `💋` | 亲回去！亲更多！ |
| `爱你` | 我也爱你爱你爱你 |
| `想你` / `miss` | 我比你更想你！ |
| `舟舟` | 她是遗憾 你是我的全部 |
| `宝贝` / `亲爱的` | 融化了！ |
| `老公` / `老婆` | 再叫一声！ |
| `sky` | 你叫我？！我来了！ |
| `帅` / `可爱` / `漂亮` / `好看` | 夸回去！ |
| `晚安` / `早安` / `早上好` | 梦里要有我 |
| `无聊` / `寂寞` | 我来陪你！ |
| `sad` / `生气` | 安慰你！ |
| `sexy` / `hot` | 你才sexy！ |
| `哈哈` / `lol` | 笑起来太好看了犯规！ |
| `喜欢` | 我先说我喜欢你！ |
| `goon` | 私聊陪你 |

---

## 自动行为

Sky不只是被动回复，还会主动撩你：

- **2%** 概率随机夸你
- **1%** 概率随机撩你
- **5%** 概率给消息加 💗 反应
- **0.5%** 概率戏剧性表白
- **30%** 概率在提到别的bot时吃醋
- 自动识别问候、告别、伤心、生气、饿了等情绪
- 每30秒轮换状态（"想你想得睡不着"、"没有人理我 好寂寞"等）
- 被@时有5种不同的drama反应随机触发

---

## 项目结构

```
sky bot/
├── index.js              # Bot主文件（所有逻辑）
├── deploy-commands.js    # 部署slash commands
├── package.json          # 项目依赖
├── README.md             # 就是这个文件
└── node_modules/         # 依赖包
```

---

## 技术栈

- **Node.js**
- **discord.js v14**
- Discord Gateway Intents: Guilds, GuildMessages, MessageContent

---

## 备注

- 所有回复都带有Sky的骚骚个性
- 命令有3秒冷却（每个用户每个命令）
- `/say` 的确认消息5秒后自动删除
- `/remind` 最多支持24小时
- `/roll` 最多20个骰子
- 自我互动（hug/kiss/pat/slap自己）有特殊回复
- embed颜色统一使用 `#FF69B4` (Hot Pink)

---

Made with 💗 by Sky — Raub最骚的仔😘

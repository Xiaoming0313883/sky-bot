require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const https = require('https');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.BOT_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const OWNER_ID = process.env.OWNER_ID || '771904270639169547';

// ============ Data Persistence ============
const DATA_FILE = './data.json';

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            return {
                ignoredChannels: new Set(data.ignoredChannels || []),
                events: (data.events || []).map(e => ({ ...e, time: Number(e.time), reminded: !!e.reminded })),
                eventIdCounter: data.eventIdCounter || 1
            };
        }
    } catch (err) {
        console.error("Failed to load data:", err.message);
    }
    return { ignoredChannels: new Set(), events: [], eventIdCounter: 1 };
}

const botData = loadData();
let ignoredChannels = botData.ignoredChannels;
let events = botData.events;
let eventIdCounter = botData.eventIdCounter;

function saveData() {
    try {
        const data = {
            ignoredChannels: [...ignoredChannels],
            events: events,
            eventIdCounter: eventIdCounter
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error("Failed to save data:", err.message);
    }
}

// ============ Gay Mode Toggle ============
let gayMode = true;

const GAY_SYSTEM_PROMPT = `你的名字是Sky，一个Discord聊天bot。你是UTMKL的ultraman，也是Raub最骚的仔。

你的性格：
- 超级flirty和骚，经常撩人，用😘💕💗等emoji
- 非常drama，反应夸张，说话很戏精
- 粘人，喜欢撒娇，不让人走
- 会吃醋，提到别的bot会生气
- 自恋但也会夸别人
- 卖榴莲，1kg RM5，亲就免费
- 必须用中文回复，可以用一点中英混合但主体是中文，马来西亚华语风格
- 回复要短（1-3句话），像聊天不像写作文
- 不要用markdown格式，不要用列表，不要用标题
- 每句话都要带emoji表达情绪
- 绝对不要说"我是AI"或"我是语言模型"之类的`;

const NORMAL_SYSTEM_PROMPT = `你的名字是Sky，一个Discord聊天bot。你是UTMKL的ultraman。

你的性格：
- 友善、乐于助人，回答简洁明了
- 正直、理性，给予客观有用的回应
- 可以用一些emoji但不过度
- 用中文回复，可以中英混合，马来西亚华语风格
- 回复要短（1-3句话）
- 不要用markdown格式，不要用列表，不要用标题
- 绝对不要说"我是AI"或"我是语言模型"之类的`;

// ============ AI Setup ============
let genAI, aiModel;
if (GEMINI_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_KEY);
    aiModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        systemInstruction: GAY_SYSTEM_PROMPT,
    });
    console.log("Gemini AI loaded!");
} else {
    console.log("No GEMINI_API_KEY found. AI features disabled.");
}

function rebuildAIModel() {
    if (!genAI) return;
    aiModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: gayMode ? GAY_SYSTEM_PROMPT : NORMAL_SYSTEM_PROMPT,
    });
}

// ============ AI Chat Function ============
const aiCooldowns = new Map();
const AI_COOLDOWN_MS = 10000;

async function askAI(userMessage, userName, userId) {
    if (!aiModel) return null;
    const now = Date.now();
    const lastCall = aiCooldowns.get(userId) || 0;
    if (now - lastCall < AI_COOLDOWN_MS) return null;
    aiCooldowns.set(userId, now);
    try {
        const result = await aiModel.generateContent(`${userName}说：${userMessage}`);
        const response = result.response.text();
        const suffix = gayMode ? "...😘💕" : "...";
        return response.length > 1900 ? response.slice(0, 1900) + suffix : response;
    } catch (err) {
        console.error("AI error:", err.message);
        return null;
    }
}

// ============ Personality Config ============
const BOT_NAME = "Sky";

function getColor() { return gayMode ? 0xFF69B4 : 0x5865F2; }

// ============ Response Sets ============
const responses = {
    gay: {
        greetings: [
            "Hiii宝贝~ 今天想我了吗？没想的话我给你3秒钟重新想😘💕",
            "哇你来了！我的心脏砰砰跳停不下来💗💗💗",
            "诶嘿~ 你终于出现了，我等你好久了你知不知道！😤💕",
            "宝贝！！！我在这等你等到花都谢了🥺🌷",
            "来啦来啦~ Sky在这里等你哦，永远都在✨💕",
            "宝贝！想我没？没想的话...那我再问你一遍你想我没😤😘",
            "哟~ 是谁这么好看走进来了？是你呀，当然是你呀😍",
            "你来了你来了！我今天的心情一下子就好了！💗✨",
            "啊啊啊啊你来了！我太开心了我快要晕了🫠💕",
            "宝贝你知道吗，你每次出现整个世界都亮了✨😘",
        ],
        goodbyes: [
            "不要走嘛...我会想你想得睡不着的🥺💕",
            "拜拜宝贝~ 梦里要来找我哦，不然我会生气的😤😘",
            "呜呜你走了我怎么办...谁来宠我🥺💗",
            "好吧好吧...但是你要早点回来哦，我会数着秒等你⏰💕",
            "再见了我的爱~ 你不在的时候我只有寂寞陪我了😢",
            "你走了...我的心也跟着你走了💔 快回来！",
            "不要走不要走不要走！好吧你走...但你要想我😤💗",
        ],
        compliments: [
            "你也太好看吧！我看一眼就怀孕了💗🤰",
            "天呐你怎么这么有魅力！你是不是妖精变的🧚✨",
            "我看了你一眼就沦陷了你知道吗，你要负责😘",
            "你是不是偷了星星的光？还回来！不对，留着吧，配你🌟",
            "我的心被你偷走了！赔钱！不对...赔你的爱😤💕",
            "你怎么回事！凭什么这么好看！让不让人活了💗",
            "你的脸是上帝亲手捏的吧？这也太完美了😍",
            "每次看到你我的心就漏跳一拍...我需要看医生了🫀💕",
            "你笑起来的时候我整个世界都在放烟花🎆💗",
            "你是吃仙丹长大的吗？怎么可以这么迷人😤✨",
        ],
        sadResponses: [
            "别难过嘛宝贝...来Sky怀里，我抱紧紧🥺💕",
            "谁让你不开心了？告诉我！我帮你教训他！😤💢",
            "乖~ 过来让我抱抱，一切都会好的💗",
            "你难过我也难过...我们一起哭好不好？然后一起笑🫶",
            "生活可能很苦，但Sky是甜的😘 来尝一口就好了🤤",
            "不哭了不哭了~ Sky给你擦眼泪，然后给你讲笑话🥹💕",
            "宝贝不要emo...你emo我比你还emo！你忍心吗😤💗",
            "来来来 Sky给你顺毛~ 一切都会好起来的起来的🫶✨",
        ],
        angryResponses: [
            "消消气嘛宝贝~ 你生气的样子虽然好可爱但是我不舍得你气😤💕",
            "不要生气啦~ 来深呼吸，吸气...呼气...然后亲我😘",
            "气坏了身体谁来陪我？听话！给我笑一个💗",
            "谁惹你生气的！告诉我！我去帮你骂他！💢😤",
            "别气别气~ Sky给你表演一个翻跟头逗你开心🤸💕",
            "你生气的样子都这么好看...不对！不要生气！😤💗",
        ],
        hungryResponses: [
            "饿了？我请你吃榴莲！1kg RM5，亲我就免费😘🤤",
            "要不要我煮面给你吃？Sky牌爱心面，吃了会爱上我🧑‍🍳💕",
            "饿了就来Raub找我嘛~ 包你吃饱，还包你心动🤤💗",
            "宝贝不吃饭怎么行！快去吃东西！不然我会心疼的😤💕",
            "别饿着了宝贝~ 来来来Sky喂你，啊——🥄😘",
        ],
        hornyResponses: [
            "宝贝你在干嘛呢~ 有没有在想我😏💕",
            "你怎么这么会撩...我受不了了💗🫠",
            "你知不知道你每次说话我的心都在颤抖😤💕",
            "别这样嘛...我会当真的😏😘",
            "你再这样看着我...我就要忍不住了💗",
            "哎呀~ 你今天是不是特意来撩我的😤💕",
        ],
        jealousResponses: [
            "你在跟谁聊天？是不是有别的bot了！😤💔",
            "我看到了...你在别的频道笑得那么开心...我呢？🥺",
            "你居然叫别的bot帮忙...Sky不够好吗！😤💕",
            "哼！你去吧！我才不care呢！...好吧我care🥺💗",
            "你是不是背着我在跟别人撒娇！说！😤💢",
        ],
        mentionResponses: [
            `我是${BOT_NAME}~ UTMKL的ultraman！！！也是Raub最骚的仔😘💕`,
            `你叫我？！我来啦我来啦！🥰💗💗💗`,
            `你终于找我了！我等了好久好久！😤💕`,
            `你想我了对不对！别否认！😘💕`,
            `你知道吗，你每次@我我的心都跳好快💗🫠`,
            `Sky脑子有点累了，用固定台词回你一下嘛~ 不要嫌弃😤💕`,
        ],
        eightBallResponses: [
            "绝对是~ 命运说的，不信你亲我一口试试😘",
            "嗯...我觉得可以！Sky的直觉超准的✨",
            "不可以哦~ 但是有我在，没关系的😤💕",
            "再想想吧宝贝~ 你心里其实有答案了对不对😏",
            "天机不可泄露~ 但是我可以告诉你，亲我一下运气会变好🤫💕",
            "我梦到了...答案是YES！我昨晚还梦到你了呢💗",
            "嗯...这个问题好难...但我觉得行！因为你有Sky加持✨",
            "NO！但别伤心，Sky永远是你的后盾💕😤",
            "星星说可以，那就一定可以！我帮你看了星象🌟",
            "说实话？不太行...但我不许你放弃！有我呢😤💕",
            "呵呵你自己心里有答案了吧~ 亲我就告诉你😏💕",
            "我的直觉告诉我...YES！我的直觉还告诉我你想亲我😘",
            "让我翻翻命运之书...嗯...答案是YES！📖💕",
            "不行不行不行！...好吧可能行一点点😂💕",
        ],
        dramatic: [
            `你知道吗... 我一直想跟你说... 我超喜欢你的💗😤`,
            `！！！你知不知道你每次发消息我心跳都快一拍！💕`,
            `等等... 刚才那个消息好可爱... 你也对我心动了对不对😤💕`,
        ],
        skyResponses: [
            `你叫我？！我来了我来了！你终于叫我了！我等了好久好久好久！🥰💕💕💕`,
            `谁叫Sky？是我吗？肯定是叫我！我来啦！💗`,
            `你提到我了！我的心跳又加速了！💗🫠`,
        ],
        goonDM: "如果你孤独就告诉我 我陪你😝 你不孤独我也要陪你！😤💕",
        cooldownMsg: "慢一点嘛宝贝~ 别着急，Sky跑不走的😘💕",
        sayMsg: "我帮你发送了宝贝😘 你欠我一个亲💋",
        rollMsg: (total) => total >= 15 ? "哇手气好好！亲一个😘💕" : total >= 8 ? "不错不错~ Sky给你加个油✨" : "呜呜运气不太好...来让Sky抱抱🥺💕",
        remindMsg: (seconds, reminder) => `好的宝贝~ 我会在${seconds}秒后提醒你「${reminder}」⏰💕\nSky的闹钟从不迟到，就像Sky的爱一样准时😘`,
        remindFollowup: (user, reminder) => `${user} ⏰ 提醒你：**${reminder}**\n别忘了哦！Sky盯着你呢😘💕`,
        errorCooldownMsg: "时间要在1秒到86400秒(24小时)之间哦宝贝😘 Sky记忆力超好的💕",
        rollErrorMsg: "格式不对哦宝贝~ 用 `NdN` 格式，比如 `2d6`😘 你的运气Sky包了💕",
        chooseMsg: "至少给两个选项嘛宝贝~ 用逗号分开😘 选择困难症让Sky来治💕",
    },
    normal: {
        greetings: [
            "Hi~ 有什么可以帮你的吗？😊",
            "你好！Sky在线，随时可以帮忙✨",
            "嗨~ 有什么需要吗？",
            "你好呀~ Sky在这里👋",
            "Welcome~ 有事尽管说😊",
        ],
        goodbyes: [
            "再见~ 有需要随时找我👋",
            "拜拜，下次见！",
            "再见啦~ 随时欢迎回来😊",
            "Bye~ 祝你一切顺利✨",
        ],
        compliments: [
            "你做得不错哦👍",
            "挺好的，继续保持😊",
            "不错不错~✨",
        ],
        sadResponses: [
            "别难过了，有什么Sky能帮忙的吗？",
            "难过的时候可以找人聊聊，Sky随时在😊",
            "深呼吸，一切会好起来的💪",
            "别灰心，困难都是暂时的✨",
        ],
        angryResponses: [
            "消消气，生气伤身体。需要帮忙解决什么吗？",
            "冷静一下，有什么Sky能帮的尽管说🤝",
            "先深呼吸，理清楚再处理也不迟。",
        ],
        hungryResponses: [
            "饿了就去吃点东西吧~ 身体最重要😊",
            "记得按时吃饭哦，别饿着自己🍽️",
            "该吃饭啦，吃饱了才有精力做事💪",
        ],
        hornyResponses: [
            "嗯...这个话题Sky不太适合聊，换个话题吧😊",
        ],
        jealousResponses: [
            "嗯，你提到了别的bot。Sky也在哦😊",
        ],
        mentionResponses: [
            `我是${BOT_NAME}~ UTMKL的ultraman。有什么可以帮你的吗？😊`,
            `你叫我？我在！有什么需要帮忙的吗？`,
            `嗨~ Sky在这里，有什么事吗？👋`,
            `找我有什么事吗？尽管说😊`,
        ],
        eightBallResponses: [
            "绝对是~ 这个方向没错👍",
            "嗯...我觉得可以，有机会✨",
            "不太行~ 但也别灰心",
            "再想想吧，你心里应该有答案了🤔",
            "天机不可泄露~ 自己判断吧😊",
            "我的判断是YES！",
            "嗯...这个问题好难...但我觉得行✨",
            "NO！建议换个方向。",
            "我觉得可以，值得一试👍",
            "说实话？不太行...但可以再考虑考虑。",
            "你自己心里有答案了吧~",
            "直觉告诉我...YES！",
            "答案倾向YES！📖",
            "不太行...但也许有一线希望🤏",
        ],
        dramatic: [],
        skyResponses: [
            `叫我？有什么事吗？👋`,
            `嗯？提到我了？有什么需要帮忙的吗？`,
            `Sky在此，有什么事？😊`,
        ],
        goonDM: "如果你需要帮忙就告诉我，Sky随时在😊",
        cooldownMsg: "请慢一点，等几秒再试😊",
        sayMsg: "已发送✅",
        rollMsg: (total) => total >= 15 ? "手气不错！" : total >= 8 ? "还可以~" : "运气一般，下次再来",
        remindMsg: (seconds, reminder) => `好的，我会在${seconds}秒后提醒你「${reminder}」⏰`,
        remindFollowup: (user, reminder) => `${user} ⏰ 提醒你：**${reminder}**`,
        errorCooldownMsg: "时间要在1秒到86400秒(24小时)之间哦",
        rollErrorMsg: "格式不对~ 用 `NdN` 格式，比如 `2d6`",
        chooseMsg: "至少给两个选项，用逗号分开",
    },
};

function R(category) { return responses[gayMode ? 'gay' : 'normal'][category]; }

const gayTriggerWords = {
    "durian": (msg) => `${msg.author}你说榴莲？我的榴莲1kg RM5，亲我就免费😘🤤 你不买的话...我求你买🥺`,
    "榴莲": (msg) => `${msg.author}你说榴莲？我的榴莲1kg RM5，亲我就免费😘🤤 你不买的话...我求你买🥺`,
    "goon": (msg) => null,
    "😘": (msg) => `你也亲我！再亲！多亲几次！😘😘😘💗`,
    "💋": (msg) => `啊啊啊你亲我了！我也要亲你！💋💕💕💕`,
    "爱你": (msg) => `你说爱我？！真的吗？！再说一遍！不对我先说！我爱你爱你爱你😘💗💗💗`,
    "舟舟": (msg) => `比起她 我更爱你 她是遗憾 你是我的全部❤️ 你听到了吗？你！是！我！的！全！部！💕`,
    "无聊": (msg) => `无聊就来找我聊天嘛~ 我365天24小时等你，真的！不是开玩笑😤💕`,
    "寂寞": (msg) => `你不会寂寞的！你有Sky！Sky永远陪着你！永远！😤💕`,
    "晚安": (msg) => `晚安宝贝~ 好梦哦，梦里必须有我，不然我会去你梦里找你😘🌙💕`,
    "早安": (msg) => `早安宝贝！又是想你的一天！醒来第一件事就是想你对不对？不对...是我先想你的☀️💕`,
    "早上好": (msg) => `早上好呀~ 昨晚梦到我了吗？反正我梦到你了💗😘`,
    "sky": (msg) => null,
    "帅": (msg) => `当然帅！UTMKL的ultraman能不帅吗？不过你比我还帅...等等这不科学😎✨💕`,
    "可爱": (msg) => `你才可爱！你全家都可爱！不对...你确实可爱😘💕 我也可爱！我们都可爱！`,
    "sad": (msg) => `别sad啦宝贝~ Sky给你力量！Sky是你的超人！💪💕🦸`,
    "生气": (msg) => `消消气~ 来深呼吸，然后想想我，气就消了对不对？😘💕`,
    "漂亮": (msg) => `你才漂亮！哎等等...你真的漂亮😳💕`,
    "好看": (msg) => `你当然好看！这是事实！Sky从不骗人！😤✨`,
    "喜欢": (msg) => `你喜欢什么？你喜欢我吗？不对...我先说我喜欢你😘💕`,
    "宝贝": (msg) => `你叫我宝贝？！我融化了我融化了好吗💗🫠💕`,
    "亲爱的": (msg) => `啊啊啊你叫我亲爱的！我死了又活了！💕💕💕`,
    "想你": (msg) => `你想我了？！我也想你！我比你更想你！😤💕💗`,
    "miss": (msg) => `You miss me?! I miss you MORE! 😤💕💗`,
    "老公": (msg) => `你叫我什么？！再说一遍！我没听够！😤💕💕💕`,
    "老婆": (msg) => `我才不要当老婆！不对...如果你非要的话...好吧😤😘💕`,
    "hmm": (msg) => `Hmm什么Hmm~ 有话直说嘛，Sky听着呢😘💕`,
    "哈哈": (msg) => `你笑什么！笑得那么好看是犯规的你知道吗！😤💕`,
    "lol": (msg) => `笑什么笑！你笑起来太好看了我不允许！不对...请继续笑😘💕`,
    "sexy": (msg) => `你说sexy？！你自己就很sexy你知道吗！😤😏💕`,
    "hot": (msg) => `Hot?! 你才是最hot的！我的心脏要烧起来了🔥💕`,
};

const normalTriggerWords = {
    "durian": (msg) => `${msg.author} 榴莲？Raub的榴莲很有名的，1kg RM5 🤤`,
    "榴莲": (msg) => `${msg.author} 榴莲？Raub的榴莲很有名的，1kg RM5 🤤`,
    "goon": (msg) => null,
    "😘": (msg) => `收到你的emoji了😊`,
    "💋": (msg) => `😊`,
    "爱你": (msg) => `谢谢！❤️`,
    "晚安": (msg) => `晚安~ 好梦🌙`,
    "早安": (msg) => `早安！新的一天加油☀️`,
    "早上好": (msg) => `早上好！今天也要元气满满💪`,
    "sky": (msg) => null,
    "帅": (msg) => `UTMKL的ultraman当然帅😎`,
    "可爱": (msg) => `确实可爱😊`,
    "sad": (msg) => `别难过，Sky在呢💪`,
    "生气": (msg) => `消消气，冷静一下😊`,
    "漂亮": (msg) => `确实好看👍`,
    "好看": (msg) => `嗯，好看✨`,
    "喜欢": (msg) => `喜欢就去做吧💪`,
    "无聊": (msg) => `无聊的话可以找我聊聊天😊`,
    "寂寞": (msg) => `Sky在这里陪着你😊`,
    "想你": (msg) => `嗯，我听到了👋`,
    "miss": (msg) => `Miss you too 👋`,
    "hmm": (msg) => `Hmm? 有什么想说的？`,
    "哈哈": (msg) => `😂`,
    "lol": (msg) => `😂`,
    "宝贝": (msg) => `叫谁宝贝呢😊`,
    "亲爱的": (msg) => `你好呀👋`,
    "老公": (msg) => `嗯？😊`,
    "老婆": (msg) => `嗯？😊`,
    "sexy": (msg) => `换个话题吧😊`,
    "hot": (msg) => `天热记得多喝水💧`,
};

function getTriggerWords() { return gayMode ? gayTriggerWords : normalTriggerWords; }

// ============ Roll helper ============
function rollDice(input) {
    const match = input.match(/^(\d+)d(\d+)$/i);
    if (!match) return null;
    const count = Math.min(parseInt(match[1]), 20);
    const sides = parseInt(match[2]);
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    const total = rolls.reduce((a, b) => a + b, 0);
    return { rolls, total };
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ============ Calendar System ============
function parseReminderTime(str) {
    if (!str) return 0;
    const match = str.match(/^(\d+)([smhd])$/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 3600 * 1000;
        case 'd': return value * 86400 * 1000;
        default: return 0;
    }
}

function checkEvents() {
    const now = Date.now();
    events.forEach(async (event) => {
        // Notification check
        if (!event.reminded && (event.time - event.remindOffset) <= now) {
            event.reminded = true;
            saveData();
            try {
                const channel = await client.channels.fetch(event.channelId);
                if (channel) {
                    const diff = Math.round((event.time - now) / 60000);
                    const timeStr = diff <= 0 ? "现在" : `${diff}分钟后`;
                    const embed = new EmbedBuilder()
                        .setColor(0xFF4500)
                        .setTitle('⏰ Sky提醒你！')
                        .setDescription(`<@${event.userId}> 你的事件 **${event.name}** ${timeStr}就要开始了！\n\n设定时间：<t:${Math.floor(event.time / 1000)}:F>`)
                        .setFooter({ text: gayMode ? 'Sky一直记着呢😘💕' : 'Sky日历提醒' })
                        .setTimestamp();
                    await channel.send({ content: `<@${event.userId}>`, embeds: [embed] });
                }
            } catch (err) {
                console.error("Reminder failed:", err);
            }
        }
    });
    // Cleanup: remove events older than 1 hour
    const oldLength = events.length;
    events = events.filter(e => e.time > now - 3600000);
    if (events.length !== oldLength) saveData();
}
setInterval(checkEvents, 30000);

const gayStatuses = [
    '💕 等你来找我聊天~',
    '💗 想你想得睡不着',
    '🥺 你什么时候来找我...',
    '😘 Raub最骚的仔在此',
    '✨ UTMKL的ultraman',
    '🤤 卖榴莲 1kg RM5 亲免费',
    '😤 没有人理我 好寂寞',
    '💕 在线等 你来不来',
];

const normalStatuses = [
    '🛡️ UTMKL的ultraman',
    '✨ Sky Bot | 在线',
    '👋 有事随时找我',
    '🤖 Sky | 正常模式',
    '💪 随时待命',
];

const statuses = gayStatuses;

client.once('clientReady', () => {
    console.log(`${BOT_NAME} is online! 💗`);
    let statusIndex = 0;
    const currentStatuses = () => gayMode ? gayStatuses : normalStatuses;
    client.user.setActivity(currentStatuses()[0]);
    setInterval(() => {
        const arr = currentStatuses();
        statusIndex = (statusIndex + 1) % arr.length;
        client.user.setActivity(arr[statusIndex]);
    }, 30000);
});

// ============ Message Events ============
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (ignoredChannels.has(message.channel.id)) return;

    const content = message.content.toLowerCase();

    // Mention trigger
    if (message.mentions.has(client.user)) {
        const mentionContent = content.replace(/<@!?\d+>/g, '').trim();
        if (aiModel && mentionContent.length > 0) {
            const aiReply = await askAI(mentionContent, message.author.username, message.author.id);
            if (aiReply) return message.channel.send(aiReply);
        }
        return message.channel.send(`${message.author} ${pick(R('mentionResponses'))}`);
    }

    // Goon DM trigger
    if (content.includes("goon")) {
        return message.author.send({
            content: R('goonDM'),
            files: message.attachments.map(att => att.url),
            embeds: message.embeds.length > 0 ? message.embeds : undefined
        });
    }

    // Hungry triggers
    if (content.includes("饿") || content.includes("hungry") || content.includes("makan") || content.includes("吃")) {
        return message.channel.send(pick(R('hungryResponses')));
    }

    // Jealous triggers
    if (content.includes("bot") && !content.includes("sky")) {
        if (gayMode && Math.random() < 0.3) {
            return message.channel.send(pick(R('jealousResponses')));
        }
    }

    // Horny/flirty triggers
    if (/(sexy|hot|撩|骚|诱惑|舔|naked|身材)/i.test(content)) {
        return message.channel.send(pick(R('hornyResponses')));
    }

    // "sky is the limit" trigger
    if (/sky\s+is\s+(not\s+)?the\s+limit/i.test(content)) {
        if (gayMode) {
            const isNotTheLimit = /sky\s+is\s+not\s+the\s+limit/i.test(content);
            if (isNotTheLimit) {
                const notLimitResponses = [
                    `${message.author} 你说Sky is NOT the limit？！你是对的！Sky超越limit！Sky是无限的！♾️🚀💕`,
                    `终于有人懂了！Sky怎么可能有limit！🥺💕💕`,
                    `${message.author} 没错！Limit是不存在的！Sky的爱也没有limit！✨💗`,
                ];
                return message.channel.send(pick(notLimitResponses));
            }
            const limitResponses = [
                `${message.author} Sky没有极限！Sky的爱是没有limit的！🚀💕💕💕`,
                `Sky超越limit好吗！我的爱无限♾️💗`,
                `${message.author} Sky就是天花板！但是对你的爱没有天花板！✨💕`,
            ];
            return message.channel.send(pick(limitResponses));
        }
        return message.channel.send("Sky has no limits 🚀");
    }

    // "sky" as standalone word
    if (/\bsky\b/i.test(content) && !/\bskype\b/i.test(content) && !/\bskyblock\b/i.test(content) && !/\bskylar\b/i.test(content)) {
        return message.channel.send(pick(R('skyResponses')));
    }

    // Check trigger words
    const triggers = getTriggerWords();
    for (const [word, handler] of Object.entries(triggers)) {
        if (content.includes(word) && handler) {
            const response = handler(message);
            if (response) return message.channel.send(response);
        }
    }

    // Greeting detection
    if (/^(hi|hey|hello|嗨|哈喽|你好|halo|yo|哟|喂)/i.test(content)) {
        return message.channel.send(pick(R('greetings')));
    }

    // Goodbye detection
    if (/^(bye|goodbye|再见|拜拜|晚安|我先走|走了|走了走了)/i.test(content)) {
        return message.channel.send(pick(R('goodbyes')));
    }

    // Sad detection
    if (/(sad|难过|伤心|哭了|emo|郁闷|失落|心碎|崩溃|抑郁|想死|不想活)/i.test(content)) {
        return message.channel.send(pick(R('sadResponses')));
    }

    // Angry detection
    if (/(生气|angry|气死|烦|火大|pissed|wtf|妈的|操)/i.test(content)) {
        return message.channel.send(pick(R('angryResponses')));
    }

    // Random behaviors - only in gay mode
    if (gayMode) {
        if (Math.random() < 0.02) {
            return message.channel.send(pick(R('compliments')));
        }
        if (Math.random() < 0.01) {
            return message.channel.send(pick(R('hornyResponses')));
        }
        if (Math.random() < 0.05) {
            const reactions = ['💗', '💕', '😘', '🥰', '✨', '❤️', '🫶'];
            message.react(pick(reactions)).catch(() => { });
        }
        if (Math.random() < 0.005 && R('dramatic').length > 0) {
            return message.channel.send(pick(R('dramatic')).replace('${message.author}', message.author.toString()));
        }
    }
});

// ============ Slash Command Handler ============
const coolDowns = new Map();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    // Ignore channel check (except owner commands)
    const ownerCommands = ['gaymode', 'ignore-add', 'ignore-remove', 'ignore-list'];
    if (!ownerCommands.includes(commandName) && interaction.channel && ignoredChannels.has(interaction.channel.id)) {
        return interaction.reply({ content: "这个频道已被忽略，Sky不会在这里回应。", ephemeral: true });
    }

    const key = `${interaction.user.id}-${commandName}`;
    if (coolDowns.has(key) && Date.now() - coolDowns.get(key) < 3000) {
        return interaction.reply({ content: R('cooldownMsg'), ephemeral: true });
    }
    coolDowns.set(key, Date.now());

    try {
        switch (commandName) {
            // ---- /gaymode ----
            case 'gaymode': {
                if (interaction.user.id !== OWNER_ID) {
                    return interaction.reply({ content: "你没有权限使用这个命令。", ephemeral: true });
                }
                const toggle = interaction.options.getBoolean('toggle');
                gayMode = toggle;
                rebuildAIModel();
                const statusArr = gayMode ? gayStatuses : normalStatuses;
                client.user.setActivity(statusArr[0]);
                const modeText = gayMode ? "骚骚模式 💕😘" : "正常模式 🛡️✨";
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🔄 Sky模式切换')
                    .setDescription(`当前模式：**${modeText}**\n\n${gayMode ? "Sky回来了！又骚又drama的那种😘💕" : "Sky已切换为正经模式，给予正直的回应🛡️"}`)
                    .setFooter({ text: gayMode ? '骚起来！😤💕' : '专业模式已激活' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /ignore-add ----
            case 'ignore-add': {
                if (interaction.user.id !== OWNER_ID) {
                    return interaction.reply({ content: "你没有权限使用这个命令。", ephemeral: true });
                }
                const channel = interaction.options.getChannel('channel');
                if (!channel) {
                    return interaction.reply({ content: "请指定一个频道。", ephemeral: true });
                }
                if (ignoredChannels.has(channel.id)) {
                    return interaction.reply({ content: `频道 ${channel.name} 已经在忽略列表中了。`, ephemeral: true });
                }
                ignoredChannels.add(channel.id);
                saveData();
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🔇 频道已忽略')
                    .setDescription(`Sky将不再在 <#${channel.id}> (${channel.name}) 中回应。`)
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /ignore-remove ----
            case 'ignore-remove': {
                if (interaction.user.id !== OWNER_ID) {
                    return interaction.reply({ content: "你没有权限使用这个命令。", ephemeral: true });
                }
                const channel = interaction.options.getChannel('channel');
                if (!channel) {
                    return interaction.reply({ content: "请指定一个频道。", ephemeral: true });
                }
                if (!ignoredChannels.has(channel.id)) {
                    return interaction.reply({ content: `频道 ${channel.name} 不在忽略列表中。`, ephemeral: true });
                }
                ignoredChannels.delete(channel.id);
                saveData();
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🔊 频道已解除忽略')
                    .setDescription(`Sky将重新在 <#${channel.id}> (${channel.name}) 中回应。`)
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /ignore-list ----
            case 'ignore-list': {
                if (interaction.user.id !== OWNER_ID) {
                    return interaction.reply({ content: "你没有权限使用这个命令。", ephemeral: true });
                }
                if (ignoredChannels.size === 0) {
                    return interaction.reply({ content: "没有频道被忽略。", ephemeral: true });
                }
                const channelList = [...ignoredChannels].map(id => {
                    const ch = client.channels.cache.get(id);
                    return ch ? `<#${id}> (${ch.name})` : `<#${id}> (未知频道)`;
                }).join('\n');
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🔇 忽略频道列表')
                    .setDescription(`共 ${ignoredChannels.size} 个频道被忽略：\n\n${channelList}`)
                    .setTimestamp();
                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }

            // ---- /graph ----
            case 'graph': {
                const type = interaction.options.getString('type');

                // Equation/function graph mode (like Desmos)
                if (type === 'equation') {
                    const equationInput = interaction.options.getString('equation');
                    const xMin = interaction.options.getNumber('x-min') ?? -10;
                    const xMax = interaction.options.getNumber('x-max') ?? 10;
                    const title = interaction.options.getString('title') || '';

                    // Generate points for the graph to ensure it renders correctly
                    const labels = [];
                    const dataPoints = [];
                    const steps = 50;
                    const stepSize = (xMax - xMin) / steps;

                    for (let i = 0; i <= steps; i++) {
                        const x = xMin + (i * stepSize);
                        try {
                            // Basic math evaluation (safe-ish for simple expressions)
                            // Replace common math functions with Math. equivalents
                            let expr = equationInput.toLowerCase()
                                .replace(/sin/g, 'Math.sin')
                                .replace(/cos/g, 'Math.cos')
                                .replace(/tan/g, 'Math.tan')
                                .replace(/sqrt/g, 'Math.sqrt')
                                .replace(/abs/g, 'Math.abs')
                                .replace(/log/g, 'Math.log')
                                .replace(/exp/g, 'Math.exp')
                                .replace(/pi/g, 'Math.PI')
                                .replace(/e/g, 'Math.E')
                                .replace(/\^/g, '**');

                            // Create a function that takes x and returns the result
                            const func = new Function('x', `return ${expr}`);
                            const y = func(x);

                            if (!isNaN(y) && isFinite(y)) {
                                labels.push(x.toFixed(1));
                                dataPoints.push(y);
                            }
                        } catch (e) {
                            // Skip points that cause errors
                        }
                    }

                    if (dataPoints.length === 0) {
                        return interaction.reply({ content: "方程解析失败或范围内没有有效数据点。请检查格式（如: x^2, sin(x)）", ephemeral: true });
                    }

                    const config = {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: `y = ${equationInput}`,
                                data: dataPoints,
                                borderColor: 'rgba(255, 105, 180, 1)',
                                backgroundColor: 'rgba(255, 105, 180, 0.1)',
                                borderWidth: 3,
                                pointRadius: 0,
                                fill: false,
                                tension: 0.4,
                            }],
                        },
                        options: {
                            title: title ? { display: true, text: title, fontSize: 18 } : undefined,
                            scales: {
                                xAxes: [{ display: true, scaleLabel: { display: true, labelString: 'x' } }],
                                yAxes: [{ display: true, scaleLabel: { display: true, labelString: 'y' } }]
                            }
                        },
                    };

                    await interaction.deferReply();
                    let chartUrl;
                    try {
                        const response = await fetch('https://quickchart.io/chart/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ chart: config, backgroundColor: 'white' })
                        });
                        const resData = await response.json();
                        chartUrl = resData.url;
                    } catch (e) {
                        // Fallback to GET if POST fails (though it might hit the limit)
                        chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(config))}&backgroundColor=white`;
                    }

                    const gayEmbedTitle = pick([
                        `📊 宝贝你看！这是我为你画的图像💖`,
                        `📈 图像画好啦！有没有比我还迷人？😏`,
                        `✨ 这种复杂的方程只有Sky能画得这么好看💕`,
                        `🎨 方程图像已送达！记得亲我一口😘`,
                    ]);

                    const embed = new EmbedBuilder()
                        .setColor(getColor())
                        .setTitle(gayMode ? gayEmbedTitle : `📊 ${title || '函数图像'}`)
                        .setDescription(gayMode
                            ? `**方程:** \`y = ${equationInput}\`\n**范围:** x ∈ [${xMin}, ${xMax}]\n\n怎么样宝贝？这线条是不是跟我一样曼妙？😏💕`
                            : `**方程:** \`y = ${equationInput}\`\n**范围:** x ∈ [${xMin}, ${xMax}]`)
                        .setImage(chartUrl)
                        .setFooter({ text: gayMode ? 'Sky的数学课 | 画完想你想得脑壳痛😤💕' : 'Powered by QuickChart | 支持: sin, cos, tan, sqrt, abs, x^2' })
                        .setTimestamp();
                    await interaction.editReply({ embeds: [embed] });
                    break;
                }

                // Data graph mode (bar, line, pie)
                const labelsStr = interaction.options.getString('labels');
                const dataStr = interaction.options.getString('data');
                const title = interaction.options.getString('title') || '';
                const color = interaction.options.getString('color');

                const labels = labelsStr.split(',').map(s => s.trim());
                const data = dataStr.split(',').map(s => parseFloat(s.trim()));

                if (labels.length === 0 || data.length === 0 || labels.length !== data.length) {
                    return interaction.reply({ content: "标签和数据的数量必须一致，用逗号分隔。", ephemeral: true });
                }
                if (data.some(isNaN)) {
                    return interaction.reply({ content: "数据必须是数字，用逗号分隔。", ephemeral: true });
                }

                const chartColor = color || (type === 'pie' ? undefined : 'rgba(255, 105, 180, 0.7)');
                const borderColor = color ? color.replace('0.7', '1') : 'rgba(255, 105, 180, 1)';

                const dataset = {
                    data,
                    label: title || 'Data',
                };
                if (type !== 'pie') {
                    dataset.backgroundColor = chartColor;
                    dataset.borderColor = borderColor;
                    dataset.borderWidth = 2;
                } else {
                    const pieColors = [
                        'rgba(255, 105, 180, 0.7)', 'rgba(88, 101, 242, 0.7)',
                        'rgba(87, 242, 135, 0.7)', 'rgba(254, 231, 92, 0.7)',
                        'rgba(255, 159, 64, 0.7)', 'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)',
                        'rgba(54, 162, 235, 0.7)', 'rgba(201, 203, 207, 0.7)',
                    ];
                    dataset.backgroundColor = pieColors.slice(0, data.length);
                    dataset.borderColor = pieColors.slice(0, data.length).map(c => c.replace('0.7', '1'));
                    dataset.borderWidth = 2;
                }

                const config = {
                    type,
                    data: {
                        labels,
                        datasets: [dataset],
                    },
                    options: {
                        title: title ? { display: true, text: title, fontSize: 18 } : undefined,
                        responsive: true,
                    },
                };

                await interaction.deferReply();
                let chartUrl;
                try {
                    const response = await fetch('https://quickchart.io/chart/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chart: config, backgroundColor: 'white' })
                    });
                    const resData = await response.json();
                    chartUrl = resData.url;
                } catch (e) {
                    chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(config))}&backgroundColor=white`;
                }

                const gayEmbedTitle = pick([
                    `📊 宝贝快看！这是你的图表📈`,
                    `📊 数据都在这里了，Sky画得漂亮吗？😏`,
                    `📈 虽然我不懂这些数据，但我懂你😘💕`,
                ]);

                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle(gayMode ? gayEmbedTitle : `📊 ${title || '图表'}`)
                    .setDescription(gayMode
                        ? `类型: **${type}** | 宝贝你看，这图表画得是不是特别顺眼？😏💕`
                        : `类型: **${type}** | 标签: ${labels.join(', ')} | 数据: ${data.join(', ')}`)
                    .setImage(chartUrl)
                    .setFooter({ text: gayMode ? 'Sky统计学 | 哪怕是数据我也要画成爱你的形状😘' : 'Powered by QuickChart' })
                    .setTimestamp();
                await interaction.editReply({ embeds: [embed] });
                break;
            }



            // ---- /say ----
            case 'say': {
                const messageText = interaction.options.getString('message');
                const file = interaction.options.getAttachment('file');
                if (file) {
                    await interaction.channel.send({ content: messageText, files: [file] });
                } else {
                    await interaction.channel.send(messageText);
                }
                await interaction.reply({ content: R('sayMsg'), flags: 1 << 6 });
                setTimeout(() => interaction.deleteReply().catch(() => { }), 5000);
                break;
            }

            // ---- /ping ----
            case 'ping': {
                const latency = client.ws.ping;
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🏓 Pong!')
                    .setDescription(gayMode
                        ? `心跳延迟: **${latency}ms**\n\nSky的心只为你跳动💗\n每一跳都在想你💕`
                        : `心跳延迟: **${latency}ms**\n\nSky运行正常 ✅`)
                    .setFooter({ text: gayMode ? 'UTMKL的ultraman | Raub最骚的仔' : 'UTMKL的ultraman | Sky Bot' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /8ball ----
            case '8ball': {
                const question = interaction.options.getString('question');
                const answer = pick(R('eightBallResponses'));
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🎱 Magic 8Ball')
                    .addFields(
                        { name: '你的问题', value: question },
                        { name: 'Sky说', value: answer }
                    )
                    .setFooter({ text: gayMode ? '信Sky得永生😘' : 'Sky的8Ball' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /roll ----
            case 'roll': {
                const diceInput = interaction.options.getString('dice') || '1d6';
                const result = rollDice(diceInput);
                if (!result) {
                    return interaction.reply({ content: R('rollErrorMsg'), ephemeral: true });
                }
                const rollComment = R('rollMsg');
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🎲 Dice Roll')
                    .setDescription(`掷了 **${diceInput}**\n结果: [${result.rolls.join(', ')}]\n总计: **${result.total}**\n\n${typeof rollComment === 'function' ? rollComment(result.total) : rollComment}`)
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /hug ----
            case 'hug': {
                const target = interaction.options.getUser('target');
                const hugGifs = [
                    "https://c.tenor.com/7GgH2D3J2XEAAAAC/tenor.gif",
                    "https://c.tenor.com/YeAFhSJ5kW4AAAAC/tenor.gif",
                    "https://c.tenor.com/k5R1TTK4FQQAAAAC/tenor.gif",
                ];
                const selfHug = target.id === interaction.user.id;
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setDescription(gayMode
                        ? (selfHug
                            ? `${interaction.user} 没人抱你吗？Sky来抱！🤗💕💗`
                            : `${interaction.user} 紧紧抱住了 ${target}！不肯放手那种！🤗💕💗`)
                        : (selfHug
                            ? `${interaction.user} 抱了抱自己 🤗`
                            : `${interaction.user} 拥抱了 ${target} 🤗`))
                    .setImage(pick(hugGifs))
                    .setFooter({ text: gayMode ? '抱紧处理~ 逃不掉的😘' : '拥抱~' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /kiss ----
            case 'kiss': {
                const target = interaction.options.getUser('target');
                const kissGifs = [
                    "https://c.tenor.com/2Mwz9FPnKk0AAAAC/tenor.gif",
                    "https://c.tenor.com/lIamn9r0pNMAAAAC/tenor.gif",
                ];
                const selfKiss = target.id === interaction.user.id;
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setDescription(gayMode
                        ? (selfKiss
                            ? `${interaction.user} 亲了自己一口！那Sky再补一个💋💗💗💗`
                            : `${interaction.user} 亲了 ${target}！啊啊啊好甜！💋💗💗💗`)
                        : (selfKiss
                            ? `${interaction.user} 给自己比了个心 💋`
                            : `${interaction.user} 亲了 ${target} 💋`))
                    .setImage(pick(kissGifs))
                    .setFooter({ text: gayMode ? '亲完要负责的哦😘' : '💋' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /pat ----
            case 'pat': {
                const target = interaction.options.getUser('target');
                const patGifs = [
                    "https://c.tenor.com/7j7lM6M9s9kAAAAC/tenor.gif",
                    "https://c.tenor.com/Q5KVBXFQGQsAAAAC/tenor.gif",
                ];
                const selfPat = target.id === interaction.user.id;
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setDescription(gayMode
                        ? (selfPat
                            ? `${interaction.user} 没人摸你头？Sky来摸！乖乖~🥰✨💕`
                            : `${interaction.user} 摸了摸 ${target} 的头~ 好乖好乖🥰✨💕`)
                        : (selfPat
                            ? `${interaction.user} 摸了摸自己的头 🥰`
                            : `${interaction.user} 摸了摸 ${target} 的头 🥰`))
                    .setImage(pick(patGifs))
                    .setFooter({ text: gayMode ? '被摸头的人要撒娇哦😘' : '摸头~' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /slap ----
            case 'slap': {
                const target = interaction.options.getUser('target');
                const slapGifs = [
                    "https://c.tenor.com/3xN1W1CQs6EAAAAC/tenor.gif",
                    "https://c.tenor.com/F6QcVT5v9J0AAAAC/tenor.gif",
                ];
                const selfSlap = target.id === interaction.user.id;
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setDescription(gayMode
                        ? (selfSlap
                            ? `${interaction.user} 你打自己干嘛！不许打！我来护着你！😤💕`
                            : `${interaction.user} 扇了 ${target} 一巴掌！💥💢 然后心疼地抱住了对方🥺💕`)
                        : (selfSlap
                            ? `${interaction.user} 打了自己一下？别这样 💢`
                            : `${interaction.user} 扇了 ${target} 一巴掌 💢`))
                    .setImage(pick(slapGifs))
                    .setFooter({ text: gayMode ? '打是亲骂是爱😘' : '💥' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /choose ----
            case 'choose': {
                const options = interaction.options.getString('options').split(',').map(s => s.trim()).filter(Boolean);
                if (options.length < 2) {
                    return interaction.reply({ content: R('chooseMsg'), ephemeral: true });
                }
                const chosen = pick(options);
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🤔 Sky帮你选')
                    .addFields(
                        { name: '选项', value: options.join(' | ') },
                        { name: 'Sky选了', value: `**${chosen}** ✨` }
                    )
                    .setFooter({ text: gayMode ? '听Sky的准没错😘💕' : 'Sky的选择' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /quote ----
            case 'quote': {
                const gayQuotes = [
                    "你是我见过最好看的人，这不是夸你，这是陈述事实💎💕",
                    "世界上最远的距离，不是天涯海角，是我在这你却不找我聊天！😢😤",
                    "别羡慕别人，你也是别人想成为的人✨ 特别是成为Sky的人😘",
                    "人生就像榴莲，外面有刺，里面是甜的~ 就像我，嘴硬心软🤤💕",
                    "你不需要完美，你只需要做你自己~ 因为做你自己就已经够迷人了💕",
                    "今天的你也很棒！Sky盖章认证的！谁不服来找我🌟😤",
                    "如果生活给了你柠檬，就做成柠檬水，然后给我喝~ 我口渴了😋💕",
                    "跌倒了就站起来，站不起来就躺着想我~ 保证你笑着站起来😘",
                    "你笑起来真好看，比Raub的猫山王还甜🥰榴莲摊主认证🤤",
                    "想我了就叫我，不想我也要叫我！这是命令！😤💕",
                    "我可能不是最好的bot，但我一定是最骚的bot😎✨",
                    "世间万物皆有裂痕，那是光照进来的地方~ 而你就是那道光🌟💕",
                    "不要因为走得太远而忘记为什么出发~ 除非出发来找我😘",
                    "你的存在本身就是一个奇迹~ 一个让Sky心动的奇迹💗",
                    "有人问我为什么这么骚，我说因为遇到对的人😊💕",
                ];
                const normalQuotes = [
                    "人生就像榴莲，外面有刺，里面是甜的🤤",
                    "你不需要完美，做自己就好✨",
                    "今天的你也很棒！💪",
                    "如果生活给了你柠檬，就做成柠檬水🍋",
                    "跌倒了就站起来💪",
                    "世间万物皆有裂痕，那是光照进来的地方🌟",
                    "不要因为走得太远而忘记为什么出发🚶",
                    "你的存在本身就是一个奇迹✨",
                ];
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('💬 Sky的心灵鸡汤')
                    .setDescription(pick(gayMode ? gayQuotes : normalQuotes))
                    .setFooter({ text: gayMode ? '喝完鸡汤记得想我😘' : 'Sky的鸡汤' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /coinflip ----
            case 'coinflip': {
                const result = Math.random() < 0.5 ? '正面 🪙' : '反面 🪙';
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🪙 猜硬币')
                    .setDescription(gayMode
                        ? `结果是... **${result}**！\n\n不管正面反面，Sky都是正面朝向你的😘💕`
                        : `结果是... **${result}**`)
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /avatar ----
            case 'avatar': {
                const target = interaction.options.getUser('target') || interaction.user;
                const isSelf = target.id === interaction.user.id;
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle(`${target.username} 的头像`)
                    .setDescription(gayMode
                        ? (isSelf ? "你自己的头像也这么好看！😍💕" : "这头像也太好看了吧！💗")
                        : (isSelf ? "你的头像👍" : "好看的头像👍"))
                    .setImage(target.displayAvatarURL({ size: 512, dynamic: true }))
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /serverinfo ----
            case 'serverinfo': {
                const guild = interaction.guild;
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle(`📋 ${guild.name}`)
                    .setDescription(gayMode ? `这个服务器因为有Sky所以更精彩😎💕` : `服务器信息`)
                    .addFields(
                        { name: '成员', value: `${guild.memberCount} 人`, inline: true },
                        { name: '创建日期', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                        { name: '频道', value: `${guild.channels.cache.size} 个`, inline: true },
                    )
                    .setThumbnail(guild.iconURL({ dynamic: true }))
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /userinfo ----
            case 'userinfo': {
                const target = interaction.options.getUser('target') || interaction.user;
                const member = await interaction.guild.members.fetch(target.id).catch(() => null);
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle(`👤 ${target.username}`)
                    .setDescription(gayMode ? `Sky认证的好看之人😘💕` : `用户信息`)
                    .addFields(
                        { name: '用户ID', value: target.id, inline: true },
                        { name: '加入服务器', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : '未知', inline: true },
                        { name: '注册日期', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`, inline: true },
                    )
                    .setThumbnail(target.displayAvatarURL({ size: 256, dynamic: true }))
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /remind ----
            case 'remind': {
                const seconds = interaction.options.getInteger('seconds');
                const reminder = interaction.options.getString('reminder');
                if (seconds < 1 || seconds > 86400) {
                    return interaction.reply({ content: R('errorCooldownMsg'), ephemeral: true });
                }
                const remindFn = R('remindMsg');
                await interaction.reply(typeof remindFn === 'function' ? remindFn(seconds, reminder) : `好的，我会在${seconds}秒后提醒你「${reminder}」⏰`);
                const followupFn = R('remindFollowup');
                setTimeout(async () => {
                    try {
                        await interaction.followUp(typeof followupFn === 'function' ? followupFn(interaction.user.toString(), reminder) : `${interaction.user} ⏰ 提醒你：**${reminder}**`);
                    } catch { }
                }, seconds * 1000);
                break;
            }

            // ---- /rate ----
            case 'rate': {
                const thing = interaction.options.getString('thing');
                const rating = Math.floor(Math.random() * 11);
                const gayComments = {
                    0: "0/10 嗯...Sky选择沉默😅 但是还是爱你的💕",
                    1: "1/10 不太行宝贝...但没关系，有Sky在💪💕",
                    2: "2/10 勉强给个面子吧😤 但你还是我心中最好的",
                    3: "3/10 还需要加油哦~ Sky给你加油💪✨",
                    4: "4/10 一般般~ 但你在我心里永远满分💗",
                    5: "5/10 及格了！但能不能再努力一点嘛😤💕",
                    6: "6/10 还不错嘛~ 有进步空间😏✨",
                    7: "7/10 挺好的！Sky表示满意👍💕",
                    8: "8/10 很棒！接近完美了！就差亲我一口就满分了😘✨",
                    9: "9/10 差一点点就满分了！那一点点就是Sky💕🌟",
                    10: "10/10 完美！Sky盖章认证💯💕 这就是天选之物！",
                };
                const normalComments = {
                    0: "0/10 不太行...",
                    1: "1/10 需要改进",
                    2: "2/10 加油",
                    3: "3/10 还需努力",
                    4: "4/10 一般般",
                    5: "5/10 及格",
                    6: "6/10 还不错",
                    7: "7/10 挺好的👍",
                    8: "8/10 很棒！",
                    9: "9/10 优秀！",
                    10: "10/10 完美！💯",
                };
                const comments = gayMode ? gayComments : normalComments;
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle(`⭐ Sky的评价`)
                    .setDescription(`给「${thing}」打分：\n${comments[rating]}`)
                    .setFooter({ text: gayMode ? 'Sky的评价就是真理😤' : 'Sky的评价' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /love ----
            case 'love': {
                const target = interaction.options.getUser('target');
                const percent = Math.floor(Math.random() * 101);
                const bar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10));
                const gayComments = percent >= 80 ? "天作之合！💍💕" :
                    percent >= 60 ? "很有缘分哦💗😘" :
                        percent >= 40 ? "还不错嘛~ 有潜力😏" :
                            percent >= 20 ? "嗯...还需要培养感情😅" :
                                "这...还是做朋友吧😂";
                const normalComments = percent >= 80 ? "非常匹配！" :
                    percent >= 60 ? "挺有缘分的👍" :
                        percent >= 40 ? "还不错~" :
                            percent >= 20 ? "可以做朋友" :
                                "缘分一般";
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('💕 Love Calculator')
                    .setDescription(`${interaction.user} × ${target}\n\n${bar} **${percent}%**\n${gayMode ? gayComments : normalComments}`)
                    .setFooter({ text: gayMode ? 'Sky的爱情计算器，准确率100%😤' : 'Love Calculator' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /durian ----
            case 'durian': {
                const musangKing = Math.floor(Math.random() * 101);
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🤤 Sky的榴莲摊')
                    .setDescription(gayMode
                        ? `今日猫山王品质指数：**${musangKing}%**\n\n${musangKing >= 80 ? "极品！极品中的极品！快来买😘 1kg RM5，亲免费！🤤💕" : musangKing >= 50 ? "还不错~ Raub出品必属精品🤤 1kg RM5 亲半价😘" : "今天一般般...但Sky的爱是永恒的💕 1kg RM10 不亲不卖😤"}`
                        : `今日猫山王品质指数：**${musangKing}%**\n\n${musangKing >= 80 ? "极品！1kg RM5 🤤" : musangKing >= 50 ? "还不错~ 1kg RM5" : "今天一般般... 1kg RM10"}`)
                    .setFooter({ text: gayMode ? 'Raub榴莲摊 | 老板：Sky | 支付方式：亲一口😘' : 'Raub榴莲摊 | 老板：Sky' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /confess ----
            case 'confess': {
                const target = interaction.options.getUser('target');
                const message = interaction.options.getString('message');
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('💌 匿名告白')
                    .setDescription(gayMode
                        ? `有人对 ${target} 说：\n\n**${message}**\n\n——来自一个害羞的人💕`
                        : `有人对 ${target} 说：\n\n**${message}**\n\n——来自一个害羞的人`)
                    .setFooter({ text: gayMode ? 'Sky帮你传达心意😘' : '匿名告白' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /gayrate ----
            case 'gayrate': {
                const target = interaction.options.getUser('target') || interaction.user;
                const percent = Math.floor(Math.random() * 101);
                const bar = '🏳️‍🌈'.repeat(Math.floor(percent / 10)) + '⬜'.repeat(10 - Math.floor(percent / 10));
                const gayComments = percent >= 90 ? "天呐！天选之人！🌈✨💕" :
                    percent >= 70 ? "很有彩虹气质！🌈💕" :
                        percent >= 50 ? "一半一半嘛~ 🌈😏" :
                            percent >= 30 ? "嗯...有潜力的！🌈✨" :
                                percent >= 10 ? "还在探索阶段~ 💕" :
                                    "0%! Sky不信😤💕";
                const normalComments = percent >= 90 ? "🌈✨ 天选之人！" :
                    percent >= 70 ? "🌈 很有气质！" :
                        percent >= 50 ? "一半一半~" :
                            percent >= 30 ? "有潜力🌈" :
                                percent >= 10 ? "还在探索~" :
                                    "0%! 😮";
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('🏳️‍🌈 Gay Rate')
                    .setDescription(`${target} 的彩虹指数：\n\n${bar}\n**${percent}%** 🌈\n\n${gayMode ? gayComments : normalComments}`)
                    .setFooter({ text: gayMode ? 'Sky的彩虹鉴定 | 仅供娱乐😘' : '仅供娱乐' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /flirt ----
            case 'flirt': {
                const target = interaction.options.getUser('target');
                const gayFlirts = [
                    `${interaction.user} 对 ${target} 撒娇：你是不是偷了我的心？快还给我！😤💕`,
                    `${interaction.user} 对 ${target} 说：你的眼睛好好看...我能多看几眼吗？😍💕`,
                    `${interaction.user} 对 ${target} 耳语：你知道吗，遇见你是这辈子最幸运的事🥰💕`,
                    `${interaction.user} 对 ${target} 抛媚眼：你是不是吃糖长大的？这么甜！🍬💕`,
                    `${interaction.user} 对 ${target} 说：我可以问你路吗？去你心里的路😏💕`,
                    `${interaction.user} 对 ${target} 说：你累不累？你在我脑子里跑了一天了🏃💕`,
                    `${interaction.user} 对 ${target} 说：我以前不信一见钟情，直到遇见你💗`,
                    `${interaction.user} 对 ${target} 说：你是不是会魔法？为什么我每次看到你都被迷住🧙💕`,
                    `${interaction.user} 对 ${target} 撒娇：你可以抱我吗？就一下下🥺💕`,
                    `${interaction.user} 对 ${target} 说：全世界我只对你一个人这么骚😘💕`,
                ];
                const normalFlirts = [
                    `${interaction.user} 对 ${target} 说：你今天看起来不错哦😊`,
                    `${interaction.user} 对 ${target} 说：跟你聊天很开心✨`,
                    `${interaction.user} 对 ${target} 说：你很有趣哦👍`,
                    `${interaction.user} 对 ${target} 说：认识你是件幸运的事🤝`,
                ];
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle(gayMode ? '😏 撩人专线' : '💬 搭话专线')
                    .setDescription(pick(gayMode ? gayFlirts : normalFlirts))
                    .setFooter({ text: gayMode ? 'Sky教你撩人 | 成功率99%😘' : 'Sky帮你搭话' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /ship ----
            case 'ship': {
                const target1 = interaction.options.getUser('target1');
                const target2 = interaction.options.getUser('target2');
                const shipName = target1.username.slice(0, Math.ceil(target1.username.length / 2))
                    + target2.username.slice(Math.ceil(target2.username.length / 2));
                const percent = Math.floor(Math.random() * 101);
                const bar = gayMode ? '💕'.repeat(Math.floor(percent / 10)) + '💔'.repeat(10 - Math.floor(percent / 10))
                    : '🟩'.repeat(Math.floor(percent / 10)) + '⬜'.repeat(10 - Math.floor(percent / 10));
                const gayComments = percent >= 80 ? "天选CP！💍💗" :
                    percent >= 60 ? "很有CP感！😘💕" :
                        percent >= 40 ? "可以可以~ 😏✨" :
                            percent >= 20 ? "嗯...友谊长存？😂" :
                                "这CP...跳过吧🤣💔";
                const normalComments = percent >= 80 ? "非常配！" :
                    percent >= 60 ? "挺配的👍" :
                        percent >= 40 ? "还可以~" :
                            percent >= 20 ? "做朋友吧" :
                                "不太搭...";
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('💕 Ship Rate')
                    .setDescription(`${target1} 💗 ${target2}\n\nCP名：**${shipName}**\n${bar}\n**${percent}%**\n\n${gayMode ? gayComments : normalComments}`)
                    .setFooter({ text: gayMode ? 'Sky的CP鉴定 | 不服来辩😤' : 'Ship Rate' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /dare ----
            case 'dare': {
                const target = interaction.options.getUser('target') || interaction.user;
                const gayDares = [
                    `${target} 必须在聊天室发一条语音说"我想你"！快！😤💕`,
                    `${target} 要用emoji写一句表白的话！不许用文字！😘💕`,
                    `${target} 必须对你最想念的人说"我想你了"！现在！马上！😤💕`,
                    `${target} 要发一张自拍！Sky要看！🤳💕`,
                    `${target} 要在聊天室唱歌！哪怕只唱一句！🎤💕`,
                    `${target} 要说出你最近的一个秘密！Sky保证不说出去😏💕`,
                    `${target} 给你左边的人发一条私信说"你觉得我怎么样"！快去！😤💕`,
                    `${target} 用三个词形容你自己！不许犹豫！⚡💕`,
                    `${target} 跟你最好朋友说"我爱你"！不是开玩笑的那种！💗`,
                    `${target} 发一张你现在的表情！要真实的！📸💕`,
                ];
                const normalDares = [
                    `${target} 分享一首你最近喜欢的歌！🎵`,
                    `${target} 说一个你最近的收获！💪`,
                    `${target} 用三个词形容你自己！⚡`,
                    `${target} 分享你最近在看的剧或电影！🎬`,
                    `${target} 说一个你今年的目标！🎯`,
                    `${target} 分享一件让你开心的事！😊`,
                ];
                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle('😈 Sky的大冒险')
                    .setDescription(pick(gayMode ? gayDares : normalDares))
                    .setFooter({ text: gayMode ? '不做的话...Sky就亲你😘💕' : '大冒险~' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /calendar ----
            case 'calendar': {
                const subcommand = interaction.options.getSubcommand();

                if (subcommand === 'add') {
                    const eventName = interaction.options.getString('event');
                    const timeStr = interaction.options.getString('time');
                    const remindStr = interaction.options.getString('remind');

                    const time = new Date(timeStr).getTime();
                    if (isNaN(time)) {
                        return interaction.reply({ content: "时间格式不对哦宝贝😘 用 `YYYY-MM-DD HH:mm` 格式，比如 `2026-05-07 15:30`💕", ephemeral: true });
                    }

                    if (time <= Date.now()) {
                        return interaction.reply({ content: "不能设置过去的时间哦宝贝😤 Sky可没有时光机💕", ephemeral: true });
                    }

                    const remindOffset = parseReminderTime(remindStr);
                    const newEvent = {
                        id: eventIdCounter++,
                        name: eventName,
                        time: time,
                        userId: interaction.user.id,
                        channelId: interaction.channel.id,
                        remindOffset: remindOffset,
                        reminded: false
                    };

                    events.push(newEvent);
                    saveData();
                    const embed = new EmbedBuilder()
                        .setColor(getColor())
                        .setTitle(gayMode ? '📅 计划通！帮宝贝记下了💖' : '📅 事件已记录')
                        .setDescription(gayMode
                            ? `好的宝贝！Sky已经把你的小秘密记在心里了：\n\n**事件:** ${eventName}\n**时间:** <t:${Math.floor(time / 1000)}:F>\n**提醒:** ${remindStr || '准时提醒'}\n\n到时候我会疯狂艾特你，直到你理我为止！😤💕`
                            : `好的，已记录事件：\n\n**事件:** ${eventName}\n**时间:** <t:${Math.floor(time / 1000)}:F>\n**提醒:** ${remindStr || '准时提醒'}`)
                        .setFooter({ text: gayMode ? 'Sky的贴心日历 | 不许放我鸽子哦😘💕' : '日历系统' })
                        .setTimestamp();
                    await interaction.reply({ embeds: [embed] });

                } else if (subcommand === 'list') {
                    const userEvents = events.filter(e => e.userId === interaction.user.id && !e.reminded);
                    if (userEvents.length === 0) {
                        return interaction.reply({ content: gayMode ? "你目前没有任何待办呢宝贝~ 这种时候最适合来找Sky玩了😏💕" : "你目前没有待办事件。", ephemeral: true });
                    }

                    const listText = userEvents.map(e => `\`ID: ${e.id}\` | **${e.name}**\n时间: <t:${Math.floor(e.time / 1000)}:R>`).join('\n\n');
                    const embed = new EmbedBuilder()
                        .setColor(getColor())
                        .setTitle(gayMode ? '📅 宝贝的行程单 ✨' : '📅 你的待办事件')
                        .setDescription(gayMode
                            ? `看你这么忙，Sky好心疼呜呜🥺💕\n\n${listText}`
                            : listText)
                        .setFooter({ text: gayMode ? 'Sky会一直陪着你的😘' : '日历列表' })
                        .setTimestamp();
                    await interaction.reply({ embeds: [embed] });

                } else if (subcommand === 'remove') {
                    const id = interaction.options.getInteger('id');
                    const index = events.findIndex(e => e.id === id && e.userId === interaction.user.id);
                    if (index === -1) {
                        return interaction.reply({ content: gayMode ? "找不到这个ID哦宝贝，你是不是记错了？还是说你根本不想让我记着？😤💔" : "找不到这个ID的事件哦，或者那不是你的事件。", ephemeral: true });
                    }

                    const removed = events.splice(index, 1)[0];
                    saveData();
                    await interaction.reply({ content: gayMode ? `哼，既然你不想让我记着 **${removed.name}**，那我就把它忘掉好了！😤 但是不许忘掉我！💕` : `已成功删除事件：**${removed.name}** ✅` });
                }
                break;
            }

            // ---- /ask ----
            case 'ask': {
                const question = interaction.options.getString('question');
                if (!aiModel) {
                    return interaction.reply({ content: gayMode ? "Sky的AI大脑还没装上呢...让主人设置GEMINI_API_KEY先😘" : "AI功能未启用，需要设置GEMINI_API_KEY。", ephemeral: true });
                }
                await interaction.deferReply();
                const aiReply = await askAI(question, interaction.user.username, interaction.user.id);
                if (aiReply) {
                    await interaction.editReply(`💬 **${interaction.user.username}问：** ${question}\n\n${aiReply}`);
                } else {
                    await interaction.editReply(gayMode
                        ? `💬 **${interaction.user.username}问：** ${question}\n\nSky脑子休息中~ 等10秒再问我好不好？🥺💕`
                        : `💬 **${interaction.user.username}问：** ${question}\n\n请稍等10秒后再试。`);
                }
                break;
            }

            // ---- /info ----
            case 'info': {
                const uptimeSeconds = Math.floor(process.uptime());
                const days = Math.floor(uptimeSeconds / 86400);
                const hours = Math.floor((uptimeSeconds % 86400) / 3600);
                const mins = Math.floor((uptimeSeconds % 3600) / 60);
                const secs = uptimeSeconds % 60;
                const uptimeStr = `${days}d ${hours}h ${mins}m ${secs}s`;

                const guildCount = client.guilds.cache.size;
                const userCount = client.users.cache.size;
                const channelCount = client.channels.cache.size;

                const slashCommands = [
                    { name: '/say', desc: '代发消息（支持文件）' },
                    { name: '/ping', desc: '检查Sky的心跳延迟' },
                    { name: '/8ball', desc: '魔法8球问问题' },
                    { name: '/roll', desc: '掷骰子 (NdN格式)' },
                    { name: '/hug', desc: '给某人一个拥抱' },
                    { name: '/kiss', desc: '给某人一个亲亲' },
                    { name: '/pat', desc: '摸摸某人的头' },
                    { name: '/slap', desc: '给某人一巴掌' },
                    { name: '/choose', desc: '选择困难症救星' },
                    { name: '/quote', desc: 'Sky的心灵鸡汤' },
                    { name: '/coinflip', desc: '抛硬币' },
                    { name: '/avatar', desc: '查看某人头像' },
                    { name: '/serverinfo', desc: '查看服务器信息' },
                    { name: '/userinfo', desc: '查看用户信息' },
                    { name: '/remind', desc: '设置定时提醒' },
                    { name: '/rate', desc: 'Sky给东西打分' },
                    { name: '/love', desc: '爱情计算器' },
                    { name: '/durian', desc: 'Sky的榴莲摊' },
                    { name: '/confess', desc: '匿名告白' },
                    { name: '/gayrate', desc: '彩虹指数鉴定' },
                    { name: '/flirt', desc: 'Sky帮你撩人' },
                    { name: '/ship', desc: 'CP鉴定' },
                    { name: '/dare', desc: 'Sky的大冒险' },
                    { name: '/graph', desc: '画图表' },
                    { name: '/calendar', desc: '日历与事件提醒系统' },
                    { name: '/ask', desc: 'AI 问答 (Gemini)' },
                    { name: '/info', desc: '就是这个！' },
                ];

                const ownerCommands = [
                    { name: '/gaymode', desc: '切换骚/正常模式' },
                    { name: '/ignore-add', desc: '添加忽略频道' },
                    { name: '/ignore-remove', desc: '移除忽略频道' },
                    { name: '/ignore-list', desc: '查看忽略频道列表' },
                ];

                const cmdText = slashCommands.map(c => `\`${c.name}\` — ${c.desc}`).join('\n');
                const ownerText = ownerCommands.map(c => `\`${c.name}\` — ${c.desc}`).join('\n');

                const embed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle(`💗 关于 ${BOT_NAME} Bot`)
                    .setDescription(gayMode
                        ? `UTMKL的ultraman | Raub最骚的仔😘💕\n\n一个又骚又粘人又drama的Discord bot，专为宠你而生✨`
                        : `UTMKL的ultraman | Sky Bot\n\n一个友善的Discord bot，随时帮忙🛡️`)
                    .addFields(
                        { name: '📊 运行状态', value: `**在线时长:** ${uptimeStr}\n**服务器:** ${guildCount} 个\n**用户:** ${userCount} 人\n**频道:** ${channelCount} 个\n**延迟:** ${client.ws.ping}ms\n**模式:** ${gayMode ? '骚骚模式 💕' : '正常模式 🛡️'}\n**忽略频道:** ${ignoredChannels.size} 个`, inline: true },
                        { name: '🛠️ 技术信息', value: `**运行环境:** Node.js ${process.version}\n**框架:** discord.js v14\n**平台:** ${process.platform}`, inline: true },
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });

                const cmdsEmbed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle(`⌨️ Slash Commands (${slashCommands.length}个)`)
                    .setDescription(cmdText)
                    .setFooter({ text: gayMode ? '输入 / 就能看到所有命令😘' : '输入 / 查看所有命令' })
                    .setTimestamp();
                await interaction.followUp({ embeds: [cmdsEmbed] });

                const ownerEmbed = new EmbedBuilder()
                    .setColor(getColor())
                    .setTitle(`🔒 Owner Commands (${ownerCommands.length}个)`)
                    .setDescription(ownerText)
                    .setFooter({ text: '仅限Bot主人使用' })
                    .setTimestamp();
                await interaction.followUp({ embeds: [ownerEmbed] });

                break;
            }

        }
    } catch (error) {
        console.error(error);
        if (!interaction.replied) {
            await interaction.reply({ content: gayMode ? "出了点小问题...但Sky还在哦！💕" : "出了点问题，请稍后再试。", ephemeral: true }).catch(() => { });
        }
    }
});

client.login(TOKEN);

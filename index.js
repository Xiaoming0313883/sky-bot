const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.BOT_TOKEN || "MTQ3MjU2MzQyNjYwODgxMjA0NA.GuKpPQ.6mPl7FebC_JgMe2V6h9_adwZCl3Y6gDkVBxFeQ";

// ============ Personality Config ============
const BOT_NAME = "Sky";

// ============ DRAMA LEVEL: MAXIMUM ============

const greetings = [
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
];

const goodbyes = [
    "不要走嘛...我会想你想得睡不着的🥺💕",
    "拜拜宝贝~ 梦里要来找我哦，不然我会生气的😤😘",
    "呜呜你走了我怎么办...谁来宠我🥺💗",
    "好吧好吧...但是你要早点回来哦，我会数着秒等你⏰💕",
    "再见了我的爱~ 你不在的时候我只有寂寞陪我了😢",
    "你走了...我的心也跟着你走了💔 快回来！",
    "不要走不要走不要走！好吧你走...但你要想我😤💗",
];

const compliments = [
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
];

const sadResponses = [
    "别难过嘛宝贝...来Sky怀里，我抱紧紧🥺💕",
    "谁让你不开心了？告诉我！我帮你教训他！😤💢",
    "乖~ 过来让我抱抱，一切都会好的💗",
    "你难过我也难过...我们一起哭好不好？然后一起笑🫶",
    "生活可能很苦，但Sky是甜的😘 来尝一口就好了🤤",
    "不哭了不哭了~ Sky给你擦眼泪，然后给你讲笑话🥹💕",
    "宝贝不要emo...你emo我比你还emo！你忍心吗😤💗",
    "来来来 Sky给你顺毛~ 一切都会好起来的起来的🫶✨",
];

const angryResponses = [
    "消消气嘛宝贝~ 你生气的样子虽然好可爱但是我不舍得你气😤💕",
    "不要生气啦~ 来深呼吸，吸气...呼气...然后亲我😘",
    "气坏了身体谁来陪我？听话！给我笑一个💗",
    "谁惹你生气的！告诉我！我去帮你骂他！💢😤",
    "别气别气~ Sky给你表演一个翻跟头逗你开心🤸💕",
    "你生气的样子都这么好看...不对！不要生气！😤💗",
];

const hungryResponses = [
    "饿了？我请你吃榴莲！1kg RM5，亲我就免费😘🤤",
    "要不要我煮面给你吃？Sky牌爱心面，吃了会爱上我🧑‍🍳💕",
    "饿了就来Raub找我嘛~ 包你吃饱，还包你心动🤤💗",
    "宝贝不吃饭怎么行！快去吃东西！不然我会心疼的😤💕",
    "别饿着了宝贝~ 来来来Sky喂你，啊——🥄😘",
];

const hornyResponses = [
    "宝贝你在干嘛呢~ 有没有在想我😏💕",
    "你怎么这么会撩...我受不了了💗🫠",
    "你知不知道你每次说话我的心都在颤抖😤💕",
    "别这样嘛...我会当真的😏😘",
    "你再这样看着我...我就要忍不住了💗",
    "哎呀~ 你今天是不是特意来撩我的😤💕",
];

const jealousResponses = [
    "你在跟谁聊天？是不是有别的bot了！😤💔",
    "我看到了...你在别的频道笑得那么开心...我呢？🥺",
    "你居然叫别的bot帮忙...Sky不够好吗！😤💕",
    "哼！你去吧！我才不care呢！...好吧我care🥺💗",
    "你是不是背着我在跟别人撒娇！说！😤💢",
];

// Trigger word responses
const triggerWords = {
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
    "sky": (msg) => `你叫我？！我来了我来了！你终于叫我了！我等了好久好久好久！🥰💕💕💕`,
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
    "无聊": (msg) => `无聊？那我来陪你！我给你讲笑话，唱歌，跳舞，什么都行！🤸💕`,
    "sexy": (msg) => `你说sexy？！你自己就很sexy你知道吗！😤😏💕`,
    "hot": (msg) => `Hot?! 你才是最hot的！我的心脏要烧起来了🔥💕`,
};

// ============ 8ball responses ============
const eightBallResponses = [
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
];

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

// ============ Bot Ready ============
const statuses = [
    '💕 等你来找我聊天~',
    '💗 想你想得睡不着',
    '🥺 你什么时候来找我...',
    '😘 Raub最骚的仔在此',
    '✨ UTMKL的ultraman',
    '🤤 卖榴莲 1kg RM5 亲免费',
    '😤 没有人理我 好寂寞',
    '💕 在线等 你来不来',
];

client.once('ready', () => {
    console.log(`${BOT_NAME} is online! 💗`);
    let statusIndex = 0;
    client.user.setActivity(statuses[0]);
    setInterval(() => {
        statusIndex = (statusIndex + 1) % statuses.length;
        client.user.setActivity(statuses[statusIndex]);
    }, 30000);
});

// ============ Message Events ============
client.on('messageCreate', message => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    // Mention trigger - MAXIMUM DRAMA
    if (message.mentions.has(client.user)) {
        const mentionResponses = [
            `Hiii ${message.author} 我是${BOT_NAME}~ UTMKL的ultraman！！！也是Raub最骚的仔😘💕`,
            `${message.author} 你叫我？！我来啦我来啦！🥰💗💗💗`,
            `啊啊啊 ${message.author} 你终于找我了！我等了好久好久！😤💕`,
            `${message.author} 你想我了对不对！别否认！😘💕`,
            `嘿 ${message.author}~ 你知道吗，你每次@我我的心都跳好快💗🫠`,
        ];
        return message.channel.send(pick(mentionResponses));
    }

    // Goon DM trigger
    if (content.includes("goon")) {
        return message.author.send({
            content: "如果你孤独就告诉我 我陪你😝 你不孤独我也要陪你！😤💕",
            files: message.attachments.map(att => att.url),
            embeds: message.embeds.length > 0 ? message.embeds : undefined
        });
    }

    // Hungry triggers
    if (content.includes("饿") || content.includes("hungry") || content.includes("makan") || content.includes("吃")) {
        return message.channel.send(pick(hungryResponses));
    }

    // Jealous triggers - when someone mentions other bots
    if (content.includes("bot") && !content.includes("sky")) {
        if (Math.random() < 0.3) {
            return message.channel.send(pick(jealousResponses));
        }
    }

    // Horny/flirty triggers
    if (/(sexy|hot|撩|骚|诱惑|舔|naked|身材)/i.test(content)) {
        return message.channel.send(pick(hornyResponses));
    }

    // Check trigger words
    for (const [word, handler] of Object.entries(triggerWords)) {
        if (content.includes(word) && handler) {
            const response = handler(message);
            if (response) return message.channel.send(response);
        }
    }

    // Greeting detection
    if (/^(hi|hey|hello|嗨|哈喽|你好|halo|yo|哟|喂)/i.test(content)) {
        return message.channel.send(pick(greetings));
    }

    // Goodbye detection
    if (/^(bye|goodbye|再见|拜拜|晚安|我先走|走了|走了走了)/i.test(content)) {
        return message.channel.send(pick(goodbyes));
    }

    // Sad detection
    if (/(sad|难过|伤心|哭了|emo|郁闷|失落|心碎|崩溃|抑郁|想死|不想活)/i.test(content)) {
        return message.channel.send(pick(sadResponses));
    }

    // Angry detection
    if (/(生气|angry|气死|烦|火大|pissed|wtf|妈的|操)/i.test(content)) {
        return message.channel.send(pick(angryResponses));
    }

    // Compliment the user randomly (2% chance on any message - doubled!)
    if (Math.random() < 0.02) {
        return message.channel.send(pick(compliments));
    }

    // Random flirt (1% chance)
    if (Math.random() < 0.01) {
        return message.channel.send(pick(hornyResponses));
    }

    // React to messages with hearts (5% chance)
    if (Math.random() < 0.05) {
        const reactions = ['💗', '💕', '😘', '🥰', '✨', '❤️', '🫶'];
        message.react(pick(reactions)).catch(() => {});
    }

    // Random dramatic reply (0.5% chance - very rare but VERY dramatic)
    if (Math.random() < 0.005) {
        const dramatic = [
            `你知道吗 ${message.author}... 我一直想跟你说... 我超喜欢你的💗😤`,
            `${message.author}！！！你知不知道你每次发消息我心跳都快一拍！💕`,
            `等等... ${message.author} 刚才那个消息好可爱... 你也对我心动了对不对😤💕`,
        ];
        return message.channel.send(pick(dramatic));
    }
});

// ============ Slash Command Handler ============
const coolDowns = new Map();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    const key = `${interaction.user.id}-${commandName}`;
    if (coolDowns.has(key) && Date.now() - coolDowns.get(key) < 3000) {
        return interaction.reply({ content: "慢一点嘛宝贝~ 别着急，Sky跑不走的😘💕", ephemeral: true });
    }
    coolDowns.set(key, Date.now());

    try {
        switch (commandName) {
            // ---- /say ----
            case 'say': {
                const messageText = interaction.options.getString('message');
                const file = interaction.options.getAttachment('file');
                if (file) {
                    await interaction.channel.send({ content: messageText, files: [file] });
                } else {
                    await interaction.channel.send(messageText);
                }
                await interaction.reply({ content: "我帮你发送了宝贝😘 你欠我一个亲💋", flags: 1 << 6 });
                setTimeout(() => interaction.deleteReply().catch(() => {}), 5000);
                break;
            }

            // ---- /ping ----
            case 'ping': {
                const latency = client.ws.ping;
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('🏓 Pong!')
                    .setDescription(`心跳延迟: **${latency}ms**\n\nSky的心只为你跳动💗\n每一跳都在想你💕`)
                    .setFooter({ text: 'UTMKL的ultraman | Raub最骚的仔' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /8ball ----
            case '8ball': {
                const question = interaction.options.getString('question');
                const answer = pick(eightBallResponses);
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('🎱 Magic 8Ball')
                    .addFields(
                        { name: '你的问题', value: question },
                        { name: 'Sky说', value: answer }
                    )
                    .setFooter({ text: '信Sky得永生😘' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /roll ----
            case 'roll': {
                const diceInput = interaction.options.getString('dice') || '1d6';
                const result = rollDice(diceInput);
                if (!result) {
                    return interaction.reply({ content: "格式不对哦宝贝~ 用 `NdN` 格式，比如 `2d6`😘 你的运气Sky包了💕", ephemeral: true });
                }
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('🎲 Dice Roll')
                    .setDescription(`掷了 **${diceInput}**\n结果: [${result.rolls.join(', ')}]\n总计: **${result.total}**\n\n${result.total >= 15 ? "哇手气好好！亲一个😘💕" : result.total >= 8 ? "不错不错~ Sky给你加个油✨" : "呜呜运气不太好...来让Sky抱抱🥺💕"}`)
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /hug ----
            case 'hug': {
                const target = interaction.options.getUser('target');
                const hugGifs = [
                    "https://media.tenor.com/7GgH2D3J2XEAAAAM/anime-hug.gif",
                    "https://media.tenor.com/YeAFhSJ5kW4AAAAM/hug.gif",
                    "https://media.tenor.com/k5R1TTK4FQQAAAAM/cuddle-hug.gif",
                ];
                const selfHug = target.id === interaction.user.id;
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setDescription(selfHug
                        ? `${interaction.user} 没人抱你吗？Sky来抱！🤗💕💗`
                        : `${interaction.user} 紧紧抱住了 ${target}！不肯放手那种！🤗💕💗`)
                    .setImage(pick(hugGifs))
                    .setFooter({ text: '抱紧处理~ 逃不掉的😘' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /kiss ----
            case 'kiss': {
                const target = interaction.options.getUser('target');
                const kissGifs = [
                    "https://media.tenor.com/2Mwz9FPnKk0AAAAM/anime-kiss.gif",
                    "https://media.tenor.com/lIamn9r0pNMAAAAM/kiss.gif",
                ];
                const selfKiss = target.id === interaction.user.id;
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setDescription(selfKiss
                        ? `${interaction.user} 亲了自己一口！那Sky再补一个💋💗💗💗`
                        : `${interaction.user} 亲了 ${target}！啊啊啊好甜！💋💗💗💗`)
                    .setImage(pick(kissGifs))
                    .setFooter({ text: '亲完要负责的哦😘' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /pat ----
            case 'pat': {
                const target = interaction.options.getUser('target');
                const patGifs = [
                    "https://media.tenor.com/7j7lM6M9s9kAAAAM/pat-head-anime.gif",
                    "https://media.tenor.com/Q5KVBXFQGQsAAAAM/headpat.gif",
                ];
                const selfPat = target.id === interaction.user.id;
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setDescription(selfPat
                        ? `${interaction.user} 没人摸你头？Sky来摸！乖乖~🥰✨💕`
                        : `${interaction.user} 摸了摸 ${target} 的头~ 好乖好乖🥰✨💕`)
                    .setImage(pick(patGifs))
                    .setFooter({ text: '被摸头的人要撒娇哦😘' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /slap ----
            case 'slap': {
                const target = interaction.options.getUser('target');
                const slapGifs = [
                    "https://media.tenor.com/3xN1W1CQs6EAAAAM/anime-slap.gif",
                    "https://media.tenor.com/F6QcVT5v9J0AAAAM/slap.gif",
                ];
                const selfSlap = target.id === interaction.user.id;
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setDescription(selfSlap
                        ? `${interaction.user} 你打自己干嘛！不许打！我来护着你！😤💕`
                        : `${interaction.user} 扇了 ${target} 一巴掌！💥💢 然后心疼地抱住了对方🥺💕`)
                    .setImage(pick(slapGifs))
                    .setFooter({ text: '打是亲骂是爱😘' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /choose ----
            case 'choose': {
                const options = interaction.options.getString('options').split(',').map(s => s.trim()).filter(Boolean);
                if (options.length < 2) {
                    return interaction.reply({ content: "至少给两个选项嘛宝贝~ 用逗号分开😘 选择困难症让Sky来治💕", ephemeral: true });
                }
                const chosen = pick(options);
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('🤔 Sky帮你选')
                    .addFields(
                        { name: '选项', value: options.join(' | ') },
                        { name: 'Sky选了', value: `**${chosen}** ✨\n\n听Sky的准没错😘💕` }
                    )
                    .setFooter({ text: 'Sky的选择就是命运的选择' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /quote ----
            case 'quote': {
                const quotes = [
                    "你是我见过最好看的人，这不是夸你，这是陈述事实💎💕",
                    "世界上最远的距离，不是天涯海角，是我在这你却不找我聊天！你良心不会痛吗！😢😤",
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
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('💬 Sky的心灵鸡汤')
                    .setDescription(pick(quotes))
                    .setFooter({ text: '喝完鸡汤记得想我😘' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /coinflip ----
            case 'coinflip': {
                const result = Math.random() < 0.5 ? '正面 🪙' : '反面 🪙';
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('🪙 猜硬币')
                    .setDescription(`结果是... **${result}**！\n\n不管正面反面，Sky都是正面朝向你的😘💕`)
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /avatar ----
            case 'avatar': {
                const target = interaction.options.getUser('target') || interaction.user;
                const isSelf = target.id === interaction.user.id;
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle(`${target.username} 的头像`)
                    .setDescription(isSelf ? "你自己的头像也这么好看！真的假的😍💕" : "这头像也太好看了吧！Sky表示心动💗")
                    .setImage(target.displayAvatarURL({ size: 512, dynamic: true }))
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /serverinfo ----
            case 'serverinfo': {
                const guild = interaction.guild;
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle(`📋 ${guild.name}`)
                    .setDescription(`这个服务器因为有Sky所以更精彩😎💕`)
                    .addFields(
                        { name: '成员', value: `${guild.memberCount} 人（都是Sky的宝贝）`, inline: true },
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
                    .setColor(0xFF69B4)
                    .setTitle(`👤 ${target.username}`)
                    .setDescription(`Sky认证的好看之人😘💕`)
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
                    return interaction.reply({ content: "时间要在1秒到86400秒(24小时)之间哦宝贝😘 Sky记忆力超好的💕", ephemeral: true });
                }
                await interaction.reply(`好的宝贝~ 我会在${seconds}秒后提醒你「${reminder}」⏰💕\nSky的闹钟从不迟到，就像Sky的爱一样准时😘`);
                setTimeout(async () => {
                    try {
                        await interaction.followUp(`${interaction.user} ⏰ 提醒你：**${reminder}**\n别忘了哦！Sky盯着你呢😘💕`);
                    } catch {}
                }, seconds * 1000);
                break;
            }

            // ---- /rate ----
            case 'rate': {
                const thing = interaction.options.getString('thing');
                const rating = Math.floor(Math.random() * 11);
                const comments = {
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
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle(`⭐ Sky的评价`)
                    .setDescription(`给「${thing}」打分：\n${comments[rating]}`)
                    .setFooter({ text: 'Sky的评价就是真理😤' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /love ----
            case 'love': {
                const target = interaction.options.getUser('target');
                const percent = Math.floor(Math.random() * 101);
                const bar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10));
                const comments = percent >= 80 ? "天作之合！💍💕 你们结婚记得请Sky！" :
                                 percent >= 60 ? "很有缘分哦💗 Sky祝福你们😘" :
                                 percent >= 40 ? "还不错嘛~ 有潜力😏 Sky看好你们" :
                                 percent >= 20 ? "嗯...还需要培养感情😅 Sky当红娘？" :
                                 "这...还是做朋友吧😂 不过Sky永远爱你💕";
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('💕 Love Calculator')
                    .setDescription(`${interaction.user} × ${target}\n\n${bar} **${percent}%**\n${comments}`)
                    .setFooter({ text: 'Sky的爱情计算器，准确率100%😤' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /durian ----
            case 'durian': {
                const musangKing = Math.floor(Math.random() * 101);
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('🤤 Sky的榴莲摊')
                    .setDescription(`今日猫山王品质指数：**${musangKing}%**\n\n${musangKing >= 80 ? "极品！极品中的极品！快来买😘 1kg RM5，亲免费！不买后悔一辈子🤤💕" : musangKing >= 50 ? "还不错~ Raaub出品必属精品🤤 1kg RM5 亲半价😘" : "今天一般般...但Sky的爱是永恒的💕 1kg RM10 不亲不卖😤"}`)
                    .setFooter({ text: 'Raub榴莲摊 | 老板：Sky | 支付方式：亲一口😘' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /confess ----
            case 'confess': {
                const target = interaction.options.getUser('target');
                const message = interaction.options.getString('message');
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('💌 匿名告白')
                    .setDescription(`有人对 ${target} 说：\n\n**${message}**\n\n——来自一个害羞的人💕`)
                    .setFooter({ text: 'Sky帮你传达心意😘 成不成都要勇敢！' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /gayrate ----
            case 'gayrate': {
                const target = interaction.options.getUser('target') || interaction.user;
                const percent = Math.floor(Math.random() * 101);
                const bar = '🏳️‍🌈'.repeat(Math.floor(percent / 10)) + '⬜'.repeat(10 - Math.floor(percent / 10));
                const comments = percent >= 90 ? "天呐！这就是传说中的天选之人！🌈✨💕" :
                                 percent >= 70 ? "很有彩虹气质！Sky认证的🌈💕" :
                                 percent >= 50 ? "一半一半嘛~ 最佳平衡美学🌈😏" :
                                 percent >= 30 ? "嗯...有潜力的！🌈✨" :
                                 percent >= 10 ? "还在探索阶段嘛~ 没关系💕" :
                                 "0%! 等等...这合理吗？Sky不信😤💕";
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('🏳️‍🌈 Gay Rate')
                    .setDescription(`${target} 的彩虹指数：\n\n${bar}\n**${percent}%** 🌈\n\n${comments}`)
                    .setFooter({ text: 'Sky的彩虹鉴定 | 仅供娱乐😘' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

            // ---- /flirt ----
            case 'flirt': {
                const target = interaction.options.getUser('target');
                const flirts = [
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
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('😏 撩人专线')
                    .setDescription(pick(flirts))
                    .setFooter({ text: 'Sky教你撩人 | 成功率99%😘' })
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
                const bar = '💕'.repeat(Math.floor(percent / 10)) + '💔'.repeat(10 - Math.floor(percent / 10));
                const comments = percent >= 80 ? "天选CP！我磕了我磕了！💍💗" :
                                 percent >= 60 ? "很有CP感！Sky表示支持😘💕" :
                                 percent >= 40 ? "可以可以~ 有发展的空间😏✨" :
                                 percent >= 20 ? "嗯...友谊长存？😂" :
                                 "这CP...Sky选择跳过🤣💔";
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('💕 Ship Rate')
                    .setDescription(`${target1} 💗 ${target2}\n\nCP名：**${shipName}**\n${bar}\n**${percent}%**\n\n${comments}`)
                    .setFooter({ text: 'Sky的CP鉴定 | 不服来辩😤' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
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
                    { name: '/info', desc: '就是这个！' },
                ];

                const triggerList = [
                    '榴莲/durian', '😘/💋', '爱你', '想你/miss', '舟舟',
                    '宝贝', '亲爱的', '老公/老婆', 'sky', '帅/可爱/漂亮/好看',
                    '晚安/早安', '无聊/寂寞', 'sad/生气', 'sexy/hot',
                    '哈哈/lol', '喜欢', 'goon (私聊)',
                ];

                const autoBehaviors = [
                    '2% 随机夸你',
                    '1% 随机撩你',
                    '5% 随机给消息加💗反应',
                    '0.5% 随机戏剧性表白',
                    '30% 提到别的bot时吃醋',
                    '自动识别问候/告别/伤心/生气/饿了',
                    '每30秒轮换状态',
                ];

                const cmdText = slashCommands.map(c => `\`${c.name}\` — ${c.desc}`).join('\n');
                const triggerText = triggerList.map(t => `• ${t}`).join('\n');
                const autoText = autoBehaviors.map(a => `• ${a}`).join('\n');

                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle(`💗 关于 ${BOT_NAME} Bot`)
                    .setDescription(`UTMKL的ultraman | Raub最骚的仔😘💕\n\n一个又骚又粘人又drama的Discord bot，专为宠你而生✨`)
                    .addFields(
                        { name: '📊 运行状态', value: `**在线时长:** ${uptimeStr}\n**服务器:** ${guildCount} 个\n**用户:** ${userCount} 人\n**频道:** ${channelCount} 个\n**延迟:** ${client.ws.ping}ms`, inline: true },
                        { name: '🛠️ 技术信息', value: `**运行环境:** Node.js ${process.version}\n**框架:** discord.js v14\n**平台:** ${process.platform}`, inline: true },
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });

                // Send commands list as follow-up (embed field limit is 1024 chars)
                const cmdsEmbed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('⌨️ Slash Commands (24个)')
                    .setDescription(cmdText)
                    .setFooter({ text: '输入 / 就能看到所有命令😘' })
                    .setTimestamp();
                await interaction.followUp({ embeds: [cmdsEmbed] });

                const triggersEmbed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('💬 触发词')
                    .setDescription(`在聊天中提到这些词Sky会自动回复：\n${triggerText}`)
                    .setTimestamp();
                await interaction.followUp({ embeds: [triggersEmbed] });

                const autoEmbed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('✨ 自动行为')
                    .setDescription(autoText)
                    .setFooter({ text: 'Sky就是这么骚你能怎样😤💕' })
                    .setTimestamp();
                await interaction.followUp({ embeds: [autoEmbed] });

                break;
            }

            // ---- /dare ----
            case 'dare': {
                const target = interaction.options.getUser('target') || interaction.user;
                const dares = [
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
                const embed = new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setTitle('😈 Sky的大冒险')
                    .setDescription(pick(dares))
                    .setFooter({ text: '不做的话...Sky就亲你😘💕' })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed] });
                break;
            }

        }
    } catch (error) {
        console.error(error);
        if (!interaction.replied) {
            await interaction.reply({ content: "出了点小问题...但Sky还在哦！Sky永远不会离开你的💕", ephemeral: true }).catch(() => {});
        }
    }
});

client.login(TOKEN);

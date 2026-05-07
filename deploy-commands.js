require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.BOT_TOKEN || "MTQ3MjU2MzQyNjYwODgxMjA0NA.GuKpPQ.6mPl7FebC_JgMe2V6h9_adwZCl3Y6gDkVBxFeQ";
const CLIENT_ID = "1472563426608812044";
const GUILD_ID = "1501125408089837579";

const commands = [
    // /say - 代发消息
    new SlashCommandBuilder()
        .setName('say')
        .setDescription('代发消息')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('发送消息')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('发送文件，包括gif')
                .setRequired(false)),

    // /ping - 检查延迟
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏓 检查Sky的心跳'),

    // /8ball - 魔法8球
    new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('🎱 问Sky一个问题')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('你想问的问题')
                .setRequired(true)),

    // /roll - 掷骰子
    new SlashCommandBuilder()
        .setName('roll')
        .setDescription('🎲 掷骰子 (格式: NdN, 如 2d6)')
        .addStringOption(option =>
            option.setName('dice')
                .setDescription('骰子格式，如 2d6 (默认1d6)')
                .setRequired(false)),

    // /hug - 拥抱
    new SlashCommandBuilder()
        .setName('hug')
        .setDescription('🤗 给某人一个拥抱')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('你想拥抱的人')
                .setRequired(true)),

    // /kiss - 亲亲
    new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('💋 给某人一个亲亲')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('你想亲的人')
                .setRequired(true)),

    // /pat - 摸头
    new SlashCommandBuilder()
        .setName('pat')
        .setDescription('🥰 摸摸某人的头')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('你想摸头的人')
                .setRequired(true)),

    // /slap - 打脸
    new SlashCommandBuilder()
        .setName('slap')
        .setDescription('💥 给某人一巴掌')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('你想打的人')
                .setRequired(true)),

    // /choose - 选择困难症救星
    new SlashCommandBuilder()
        .setName('choose')
        .setDescription('🤔 让Sky帮你选，用逗号分隔选项')
        .addStringOption(option =>
            option.setName('options')
                .setDescription('选项，用逗号分隔，如: 火锅,烧烤,炸鸡')
                .setRequired(true)),

    // /quote - 随机语录
    new SlashCommandBuilder()
        .setName('quote')
        .setDescription('💬 Sky的随机语录'),

    // /coinflip - 猜硬币
    new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('🪙 抛硬币'),

    // /avatar - 查看头像
    new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('🖼️ 查看某人头像')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('想看谁的头像')
                .setRequired(false)),

    // /serverinfo - 服务器信息
    new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('📋 查看服务器信息'),

    // /userinfo - 用户信息
    new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('👤 查看用户信息')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('想查看谁的信息')
                .setRequired(false)),

    // /remind - 提醒
    new SlashCommandBuilder()
        .setName('remind')
        .setDescription('⏰ 设置提醒')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('多少秒后提醒 (最多86400秒/24小时)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reminder')
                .setDescription('提醒内容')
                .setRequired(true)),

    // /rate - 评分
    new SlashCommandBuilder()
        .setName('rate')
        .setDescription('⭐ 让Sky给东西打分')
        .addStringOption(option =>
            option.setName('thing')
                .setDescription('你想让Sky评分的东西')
                .setRequired(true)),

    // /love - 爱情计算器
    new SlashCommandBuilder()
        .setName('love')
        .setDescription('💕 计算两人的缘分')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('你想计算缘分的人')
                .setRequired(true)),

    // /durian - 榴莲摊
    new SlashCommandBuilder()
        .setName('durian')
        .setDescription('🤤 Sky的榴莲摊今日品质'),

    // /confess - 匿名告白
    new SlashCommandBuilder()
        .setName('confess')
        .setDescription('💌 匿名告白')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('告白对象')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('你想说的话')
                .setRequired(true)),

    // /gayrate - 彩虹指数
    new SlashCommandBuilder()
        .setName('gayrate')
        .setDescription('🏳️‍🌈 测测你的彩虹指数')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('想测谁？不填就是测自己')
                .setRequired(false)),

    // /flirt - 撩人专线
    new SlashCommandBuilder()
        .setName('flirt')
        .setDescription('😏 Sky帮你撩人')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('你想撩谁')
                .setRequired(true)),

    // /ship - CP鉴定
    new SlashCommandBuilder()
        .setName('ship')
        .setDescription('💕 鉴定两人的CP指数')
        .addUserOption(option =>
            option.setName('target1')
                .setDescription('第一个人')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('target2')
                .setDescription('第二个人')
                .setRequired(true)),

    // /dare - 大冒险
    new SlashCommandBuilder()
        .setName('dare')
        .setDescription('😈 Sky的大冒险')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('谁来做大冒险？不填就是自己')
                .setRequired(false)),

    // /info - 关于bot
    new SlashCommandBuilder()
        .setName('info')
        .setDescription('💗 关于Sky Bot的一切'),

    // /ask - AI对话
    new SlashCommandBuilder()
        .setName('ask')
        .setDescription('🧠 问Sky任何问题')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('你想问Sky什么')
                .setRequired(true)),

    // /gaymode - 切换骚/正常模式 (owner only)
    new SlashCommandBuilder()
        .setName('gaymode')
        .setDescription('🔄 切换Sky的骚骚模式/正常模式 (仅主人)')
        .addBooleanOption(option =>
            option.setName('toggle')
                .setDescription('开启=true 关闭=false')
                .setRequired(true)),

    // /ignore-add - 添加忽略频道 (owner only)
    new SlashCommandBuilder()
        .setName('ignore-add')
        .setDescription('🔇 添加忽略频道，Sky不会在该频道回应 (仅主人)')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('要忽略的频道')
                .setRequired(true)),

    // /ignore-remove - 移除忽略频道 (owner only)
    new SlashCommandBuilder()
        .setName('ignore-remove')
        .setDescription('🔊 移除忽略频道，Sky重新在该频道回应 (仅主人)')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('要解除忽略的频道')
                .setRequired(true)),

    // /ignore-list - 查看忽略频道列表 (owner only)
    new SlashCommandBuilder()
        .setName('ignore-list')
        .setDescription('📋 查看忽略频道列表 (仅主人)'),

    // /graph - 画图表
    new SlashCommandBuilder()
        .setName('graph')
        .setDescription('📊 画图表')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('图表类型')
                .setRequired(true)
                .addChoices(
                    { name: '柱状图 (Bar)', value: 'bar' },
                    { name: '折线图 (Line)', value: 'line' },
                    { name: '饼图 (Pie)', value: 'pie' },
                    { name: '函数图像 (Equation)', value: 'equation' },
                ))
        .addStringOption(option =>
            option.setName('labels')
                .setDescription('标签，用逗号分隔，如: A,B,C (equation模式不需要)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('data')
                .setDescription('数据，用逗号分隔，如: 10,20,30 (equation模式不需要)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('equation')
                .setDescription('方程式，如: x^2, sin(x), sqrt(x) (仅equation模式)')
                .setRequired(false))
        .addNumberOption(option =>
            option.setName('x-min')
                .setDescription('x最小值 (仅equation模式，默认-10)')
                .setRequired(false))
        .addNumberOption(option =>
            option.setName('x-max')
                .setDescription('x最大值 (仅equation模式，默认10)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('图表标题')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('颜色 (hex)，如: #FF69B4')
                .setRequired(false)),

    // /calendar - 日历系统
    new SlashCommandBuilder()
        .setName('calendar')
        .setDescription('📅 日历与事件记录')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('添加一个事件')
                .addStringOption(option => option.setName('event').setDescription('事件名称').setRequired(true))
                .addStringOption(option => option.setName('time').setDescription('时间 (格式: 2026-05-07 15:30)').setRequired(true))
                .addStringOption(option => option.setName('remind').setDescription('提前多久提醒 (如: 5m, 30m, 1h, 1d)').setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('查看所有待办事件'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('删除指定ID的事件')
                .addIntegerOption(option => option.setName('id').setDescription('事件ID').setRequired(true))),

].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Registering ${commands.length} slash commands...`);
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log("All slash commands registered successfully!");
    } catch (error) {
        console.error("Failed to register commands:", error);
    }
})();

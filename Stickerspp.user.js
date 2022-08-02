// ==UserScript==
// @name        表情贴纸增强插件
// @namespace   https://github.com/HazukiKaguya/Stickers_PlusPlus
// @version     2.0.3
// @author      HazukiKaguya
// @description 回复表情，插图扩展插件，在发帖时快速输入自定义表情和论坛BBCODE
// @icon        https://sticker.inari.site/favicon.ico
// @homepage    https://mistakey.top/StickersPP
// @include     https://*9shenmi.com*
// @include     https://*kf*
// @include     https://*miaola*
// @include     https://*365gal*
// @include     https://*-plus.net*
// @include     https://bbs.zdfx.net*
// @include     *bbs*
// @copyright   2020-2022, Hazukikaguya
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @run-at      document-end
// @license      MIT License
// @require     https://sticker.inari.site/js/jquery.min.user.js
// @updateURL   https://github.com/HazukiKaguya/Stickers_PlusPlus/raw/master/Stickerstickerpp.user.js
// ==/UserScript==
// 特别感谢：eddie32 https://greasyfork.org/users/5415-eddie32 & 喵拉布丁 https://github.com/miaolapd
// 更新日志：https://github.com/HazukiKaguya/Stickers_PlusPlus#%E6%9B%B4%E6%96%B0%E8%AE%B0%E5%BD%95


/**
 * 各种设置
 */
'use strict';
// jQuery隔离
this.$ = this.jQuery = jQuery.noConflict(true);
// 网站是否为KF
const check = ["kf", "365gal", "miaola", "bakabbs", "9shenmi"]; let isKF = false, KFstyle = "";
for (let i = 0; i < check.length; i++) { if (window.location.href.indexOf(check[i]) > -1) { isKF = true; KFstyle = 'style="display:none"'; break; } }
// 网站是否为Mobile
const isKfMobile = typeof Info !== 'undefined' && typeof Info.imgPath !== 'undefined';
// 是否为移动端页面
const mbcheck = ["&mobile=2", "/simple/"]; let sMobile = false;
for (let i = 0; i < mbcheck.length; i++) { if (window.location.href.indexOf(mbcheck[i]) > -1) { sMobile = true; break; } }
const isMobile = sMobile;

// 检测多重引用
const mqcheck = ["&multiquote"]; let isMQ = false;
for (let i = 0; i < mqcheck.length; i++) { if (window.location.href.indexOf(mqcheck[i]) > -1) { isMQ = true; } }
// 默认配置&载入个性化配置
const defaultSConf = {
    "version": "2.0.0",
    "kanbansize": "64",
    "kanbanimg": "https://sticker.inari.site/truenight.gif",
    "imgapi": "https://up.inari.site/api/v1/",
    "cloudapi": "https://api.inari.site/?s=App.User.",
    "onlineraw": "https://api.inari.site/?s=App.Sticker.",
    "notauthed": false,
    "realedit": false,
    "markdown": false,
    "lcimglists": false,
    "olimglists": []
};
let loadcustom = true, customize = defaultSConf;
if (!localStorage.StickerConf) {
    loadcustom = false;
    localStorage.setItem('StickerConf', JSON.stringify(defaultSConf));
}
else { customize = JSON.parse(localStorage.StickerConf); };
if (customize.version != defaultSConf.version) {
    console.log("个性化配置版本不匹配，自动进行兼容性变更！");
    customize.version = defaultSConf.version;
    if (!customize.kanbanimg) customized.kanbanimg = defaultSConf.kanbanimg;
    if (!customize.kanbansize) customize.kanbansize = defaultSConf.kanbansize;
    if (!customize.imgapi) customize.imgapi = defaultSConf.imgapi;
    if (!customize.cloudapi) customize.cloudapi = defaultSConf.cloudapi;
    if (!customize.onlineraw) customize.onlineraw = defaultSConf.onlineraw;
    if (!customize.notauthed) customize.notauthed = defaultSConf.notauthed;
    if (!customize.realedit) customize.realedit = defaultSConf.realedit;
    if (!customize.markdown) customize.markdown = defaultSConf.markdown;
    if (!customize.lcimglists) customize.lcimglists = defaultSConf.lcimglists;
    if (!customize.olimglists) customize.olimglists = defaultSConf.olimglists;
    localStorage.setItem('StickerConf', JSON.stringify(customize));
    localStorage.removeItem('onlineraws'); localStorage.removeItem('Alertless'); sessionStorage.removeItem('localSmile'); sessionStorage.removeItem('OnlineSmile');
    console.log("兼容性变更完成！");
}
const imgapi = customize.imgapi, cloudapi = customize.cloudapi;
let realedit = customize.realedit, realeditcheck = '';
if (realedit && isMQ == false) { realeditcheck = 'checked' }
// 贴纸数据源
let LocalRaws = [
    { "id": 1, "desc": "AC娘表情贴纸，属于AcSmileList，AC娘。", "cover": "https://sticker.inari.site/acfun/1/1.png", "name": "_Acfun", "title": 'AC娘', "addr": "_AcSmileList", "numstart": [1, 1001, 2001], "numend": [55, 1041, 2056], "url1": ["https://sticker.inari.site/acfun/1/", "https://sticker.inari.site/acfun/2/", "https://sticker.inari.site/acfun/3/"], "url2": [".png", ".png", ".png"] },
    { "id": 2, "desc": "华语第三动漫高手论坛S1的麻将脸表情包喵~", "cover": "https://sticker.inari.site/s1/1.gif", "name": "_S1", "title": 'S1', "addr": "_S1SmileList", "numstart": [1, 1], "numend": [21, 229], "url1": ["https://sticker.inari.site/s1/", "https://sticker.inari.site/s1/"], "url2": [".gif", ".png"] },
    { "id": 3, "desc": "《摇曳百合》的阿卡林的表情包~", "cover": "https://sticker.inari.site/akarin/2/akarin (1).gif", "name": "_Akarin", "title": '阿卡林', "addr": "_AkarinSmileList", "numstart": [1, 1], "numend": [21, 72], "url1": ["https://sticker.inari.site/akarin/2/akarin (", "https://sticker.inari.site/akarin/1/akarin ("], "url2": [").gif", ").png"] },
    { "id": 4, "desc": "小B是画师林大B练习用的看板娘，最初是在sosg论坛上出现~", "cover": "https://sticker.inari.site/lindaB/lindaB (1).jpg", "name": "_xiaoB", "title": '小B', "addr": "_xiaoBSmileList", "numstart": [1], "numend": [52], "url1": ["https://sticker.inari.site/lindaB/lindaB ("], "url2": [").jpg"] },
    { "id": 5, "desc": "微博贴吧表情包", "cover": "https://sticker.inari.site/weibo/1.png", "name": "_Weitb", "title": '微博贴吧', "addr": "_WeitbSmileList", "numstart": [1, 1, 10], "numend": [101, 10, 34], "url1": ["https://sticker.inari.site/weibo/", "https://tb2.bdstatic.com/tb/editor/images/face/i_f0", "https://tb2.bdstatic.com/tb/editor/images/face/i_f"], "url2": [".png", ".png", ".png"] },
    { "id": 6, "desc": "暹罗猫小红豆，世界，就是绕着猫打转！", "cover": "https://sticker.inari.site/usr/Kawaii_Siamese/line/0_show.png", "name": "_Siamese", "title": '小红豆', "addr": "_SiameseSmileList", "numstart": [1, 1, 1], "numend": [25, 25, 41], "url1": ["https://sticker.inari.site/usr/Kawaii_Siamese/wx1/", "https://sticker.inari.site/usr/Kawaii_Siamese/wx2/", "https://sticker.inari.site/usr/Kawaii_Siamese/line/"], "url2": [".png", ".png", ".png"] },
    { "id": 7, "desc": "Lovelive表情贴纸~", "cover": "https://sticker.inari.site/lovelive/2/ll (1).png", "name": "_LL", "title": 'LL', "addr": "_LLSmileList", "numstart": [1, 1], "numend": [42, 20], "url1": ["https://sticker.inari.site/lovelive/2/ll (", "https://sticker.inari.site/lovelive/4/ll ("], "url2": [").png", ").jpg"] },
    { "id": 8, "desc": "少女☆歌剧。去吧，两人一起，摘下那颗星。", "cover": "https://sticker.inari.site/revstar/revstar (1).png", "name": "_Revue", "title": '少歌', "addr": "_RevueSmileList", "numstart": [1], "numend": [41], "url1": ["https://sticker.inari.site/revstar/revstar ("], "url2": [").png"] },
    { "id": 9, "desc": "公主连结Re:Dive。いま、新たな冒険の幕が上がる——", "cover": "https://sticker.inari.site/redive/sticker (1).png", "name": "_Redive", "title": 'PCR', "addr": "_RediveSmileList", "numstart": [1], "numend": [49], "url1": ["https://sticker.inari.site/redive/sticker ("], "url2": [").png"] },
    { "id": 10, "desc": "BanG Dream！噜~ キラキラ☆ドキドキ~ ふえぇ~", "cover": "https://sticker.inari.site/bangdream/bangdream (1).png", "name": "_Bandori", "title": '邦邦', "addr": "_BandoriSmileList", "numstart": [1], "numend": [41], "url1": ["https://sticker.inari.site/bangdream/bangdream ("], "url2": [").png"] },
];
let OnlineRaws = [];
if (localStorage.onlineraws) { OnlineRaws = JSON.parse(localStorage.onlineraws); }
const FinalList = [], FinalRaw = [];
// 在KF论坛，直接显示表情贴纸增强插件所属域名的图片，而不是显示【请手动点击打开本图片】
// 实验性功能，在KF论坛修复旧的失效的表情贴纸的显示。
if (isKF == true) {
    let x = document.getElementsByTagName("img");
    for (let i = 0; i < x.length; i++) {
        x[i].src = x[i].src.replace(/mistake.tech\/emote/g, "sticker.inari.site");
        x[i].src = x[i].src.replace(/http:\/\/o6smnd6uw.bkt.clouddn.com\/xds3\/akari/g, "https://sticker.inari.site/akarin/akarin");
        x[i].src = x[i].src.replace(/http:\/\/o6smnd6uw.bkt.clouddn.com\/xds\/2233/g, "https://sticker.inari.site/bili/2233");
        x[i].src = x[i].src.replace(/http:\/\/o6smnd6uw.bkt.clouddn.com\/lovelive\/Lovelive2nd/g, "https://sticker.inari.site/lovelive/Lovelive2nd");
        x[i].src = x[i].src.replace(/http:\/\/smilell2.eclosionstudio.com\/Small\/Lovelive2nd/g, "https://sticker.inari.site/lovelive/Lovelive2nd");
    }
    document.body.querySelectorAll('.readtext a').forEach(i => {
        if (i.innerHTML === '<span class=\"k_f18\">请手动点击打开本图片</span>') {
            let p = document.createElement("img"); p.src = i.href;
            if (p.src.match(/https:\/\/sticker.inari.site/)) { i.parentElement.replaceChild(p, i); }
            else if (p.src.match(/http:\/\/tb2.bdstatic.com\/tb\/editor\/images\/face/)) { i.parentElement.replaceChild(p, i); }
        }
    });
}
// 复用字符串
const
    notbindText = "图片上传将使用游客上传！已登录，现在你可以进行同步操作了！",
    lengtherrText = "长度不合规，位数应在以下范围内：",
    imguperrText = "图片上传失败，可能是网络原因。",
    guestupimgText = "游客上传成功！建议绑定up.inari.site图床账号到云同步账号！",
    kanbanerrText = "当前存在多个文本区，无法确认上传区域，看板娘点击上传暂不可用！",
    resText = "已重置，请刷新！",
    updatelog = 'V2.0.3 : 为不支持所见即所得模式的论坛添加实时编辑模式，修复若干bug。'
    ;


/**
 * 初始化表情图片
 */
// 灰企鹅
const KfSmileList = [], KfSmileCodeList = [];
if (isKF) {
    let kfImgPath = typeof imgpath !== 'undefined' ? imgpath : '';
    if (isKfMobile) kfImgPath = Info.imgPath; for (let i = 1; i < 49; i++) {
        KfSmileList.push(`/${kfImgPath}/post/smile/em/em${(i) > 9 ? i : ('0' + i)}.gif`); KfSmileCodeList.push(`[s:${i + 9}]`);
    }
    for (let i = 1; i < 204; i++) {
        KfSmileList.push(`https://sticker.inari.site/pesoguin/${i}.gif`);
        KfSmileCodeList.push(`[img]https://sticker.inari.site/pesoguin/${i}.gif[/img]`);
    }
}
else {
    for (let i = 1; i < 49; i++) { KfSmileList.push(`https://sticker.inari.site/pesoguin/em${i}.gif`); }
    for (let i = 1; i < 204; i++) { KfSmileList.push(`https://sticker.inari.site/pesoguin/${i}.gif`); }
}
// 随机
const RandomSmileList = []; RandomSmileList.push(`https://sticker.inari.site/yukika/${Math.ceil(Math.random() * 6)}.jpg`);
for (let i = 0; i < 29; i++) { RandomSmileList.push(`https://sticker.inari.site/rwebp/${Math.ceil(Math.random() * 6930)}.webp`); }
for (let i = 1; i < 10; i++) { RandomSmileList.push(`https://sticker.inari.site/rgif/${Math.ceil(Math.random() * 2555)}.gif`); }
// 自定义
!localStorage.userimgst ? userimgst = `["https://sticker.inari.site/null.jpg"]` : userimgst = localStorage.userimgst;
const UserSmileList = JSON.parse(userimgst); const UsersSmileList = [];
for (let i = 0; i < UserSmileList.length; i++) { UsersSmileList.push(`${UserSmileList[i]}#num=${i + 1}`); }
// 来自本地数据源的表情贴纸
let locAuth = sessionStorage.localSmile, localSmile = [];
!customize.lcimglists ? loconsticker = [] : loconsticker = customize.lcimglists;
for (let t = 0; t < loconsticker.length; t++) { localSmile[t] = LocalRaws[loconsticker[t]]; }
if (locAuth == null) {
    for (let t = 0; t < localSmile.length; t++) {
        localSmile[t].addr = [];
        for (let i = 0; i < localSmile[t].numstart.length; i++) {
            for (let ii = localSmile[t].numstart[i]; ii < localSmile[t].numend[i]; ii++) {
                localSmile[t].addr.push(localSmile[t].url1[i] + ii + localSmile[t].url2[i]);
            }
        }
    }
    sessionStorage.setItem('localSmile', JSON.stringify(localSmile));
}
localSmile = JSON.parse(sessionStorage.localSmile)
// 来自在线数据源的表情贴纸
let olAuth = sessionStorage.OnlineSmile;
if (olAuth == null) {
    let onlineSmile = OnlineRaws;
    for (let s = 0; s < onlineSmile.length; s++) {
        onlineSmile[s].addr = []; for (let i = 0; i < onlineSmile[s].numstart.length; i++) {
            for (let ii = onlineSmile[s].numstart[i]; ii < onlineSmile[s].numend[i]; ii++) {
                onlineSmile[s].addr.push(onlineSmile[s].url1[i] + ii + onlineSmile[s].url2[i]);
            }
        }
    } sessionStorage.setItem('OnlineSmile', JSON.stringify(onlineSmile));
}
OnlineSmile = JSON.parse(sessionStorage.OnlineSmile)


/**
 * 表情菜单
*/
const MenuList = {}
if (isKF) {
    MenuList['KfSmile'] = { datatype: 'imageLink', title: '小企鹅', desc: 'KF论坛的小企鹅表情', addr: KfSmileList, ref: KfSmileCodeList };
    MenuList['Shortcut'] = {
        datatype: 'plain', title: '快捷', desc: '发帖实用BBcode',
        addr: [
            '[sell=100][/sell]', '[quote][/quote]', '[backcolor=#000][color=#000]在此输入[/color][/backcolor]', '[hide=100][/hide]', '[code][/code]', '[strike][/strike]', '[fly][/fly]', '[color=#00FF00][/color]',
            '[b][/b]', '[u][/u]', '[i][/i]', '[hr]', '[backcolor=][/backcolor]', '[url=][/url]', '[img][/img]', '[url=][img][/img][/url]', '[table][/table]', '[tr][/tr]', '[td][/td]',
            '[align=left][/align]', '[align=center][/align]', '[align=right][/align]', '[audio][/audio]', '[video][/video]', '[email][/email]', '[list][/list]',
            '[/align]这里是签名档内容，可以随意修改，支持bbcode，实验性功能，喵拉手机版不显示，编辑帖子后如果有修改说明会导致喵拉手机版重复显示两次内容。',
            '[align=center][img]此处替换为自定义图片url[/img][/align][align=center][backcolor=#FFF][size=3]  [b]在此输入自定义文字[/b]  [/size][/backcolor][/align]'
        ],
        ref: [
            '出售贴sell=售价', '引用', '隐藏(黑条)', '隐藏hide=神秘等级', '插入代码', '删除线', '跑马灯', '文字颜色', '粗体', '下划线', '斜体', '水平线', '背景色', '插入链接',
            '插入图片', '插入超链接图片', '插入表格', '插入表格行', '插入表格列', '左对齐', '居中', '右对齐', '插入音频', '插入视频', 'Email', '插入列表', '签名档[实验性功能]', '自定义表情配文字'
        ]
    };
}
else if (!isKF) {
    MenuList['KfSmile'] = { datatype: 'image', title: '小企鹅', desc: 'KF论坛的小企鹅表情', addr: KfSmileList };
    MenuList['Shortcut'] = {
        datatype: 'plain', title: 'BBcode', desc: '发帖实用BBcode',
        addr: [
            '[sell=100][/sell]', '[quote][/quote]', '[backcolor=#000][color=#000]在此输入[/color][/backcolor]', '[hide=100][/hide]', '[code][/code]', '[strike][/strike]', '[fly][/fly]', '[color=#00FF00][/color]',
            '[b][/b]', '[u][/u]', '[i][/i]', '[hr]', '[backcolor=][/backcolor]', '[url=][/url]', '[img][/img]', '[url=][img][/img][/url]', '[table][/table]', '[tr][/tr]', '[td][/td]',
            '[align=left][/align]', '[align=center][/align]', '[align=right][/align]', '[audio][/audio]', '[flash=audio][/flash]', '[video][/video]', '[media][/media]', '[flash][/flash]', '[email][/email]', '[list][/list]', '[font=字体名]文字[/font]', '[collapse=文字]需要折叠的内容[/collapse]', '[dice]d楼层数[/dice]', '[@用户名]or[@用户ID]'
        ],
        ref: [
            '出售贴sell=售价', '引用', '隐藏(黑条)', '隐藏(hide=)', '插入代码', '删除线', 'Fly', '文字颜色', '粗体', '下划线', '斜体', '水平线', '背景色', '插入链接',
            '插入图片', '插入超链接图片', '插入表格框', '插入表格行', '插入表格列', '左对齐', '居中', '右对齐', '插入音频', '插入flash音频', '插入视频[video]', '插入视频[media]', '插入flash', 'Email', '插入列表', '字体', '折叠', 'ngaRoll点', 'nga@用户'
        ]
    };
};

MenuList['Markdown'] = {
    datatype: 'plain', title: 'M↓', desc: 'Markdown语法，如需全局更换为markdown请前往【自定义】-》【个性设置】，勾选【使用Markdown取代BBcode】',
    addr: [
        '> ', '**', '****', '---', '~~~~', '<u></u>', '``', '[]()', '![]()', '# '
    ],
    ref: [
        '引用', '斜体', '粗体', '分割线', '删除线', '下划线', '代码', '链接', '图片', '标题'
    ]
};
MenuList['Random'] = { datatype: 'image', title: '随机', desc: '从随机表情贴纸池里随机抽取表情贴纸！', addr: RandomSmileList },
    MenuList['Userimg'] = { datatype: 'image', title: '自定义', desc: '你自己新增的表情贴纸都在这里！', addr: UsersSmileList };
MenuList['Kaomoji'] = {
    datatype: 'plain',
    title: ':)',
    desc: '颜文字',
    addr: [
        '(●・ 8 ・●)', '╰(๑◕ ▽ ◕๑)╯', '(ゝω・)', '〜♪♪', '(ﾟДﾟ≡ﾟДﾟ)', '(＾o＾)ﾉ', '(|||ﾟДﾟ)', '(`ε´ )', '(╬ﾟдﾟ)', '(|||ﾟдﾟ)', '(￣∇￣)', '(￣3￣)', '(￣ｰ￣)',
        '(￣ . ￣)', '(￣︿￣)', '(￣︶￣)', '(*´ω`*)', '(・ω・)', '(⌒▽⌒)', '(￣▽￣）', '(=・ω・=)', '(･∀･)', '(｀・ω・´)', '(〜￣△￣)〜', '(°∀°)ﾉ', '(￣3￣)',
        '╮(￣▽￣)╭', '( ´_ゝ｀)', 'のヮの', '(ﾉ؂< ๑）诶嘿☆～', '(<_<)', '(>_>)', '(;¬_¬)', '(▔□▔)/', '(ﾟДﾟ≡ﾟдﾟ)!?', 'Σ(ﾟдﾟ;)', 'Σ( ￣□￣||)', '(´；ω；`)',
        '（/TДT)/', '(^・ω・^ )', '(｡･ω･｡)', '(oﾟωﾟo)', '(●￣(ｴ)￣●)', 'ε=ε=(ノ≧∇≦)ノ', '(´･_･`)', '(-_-#)', '（￣へ￣）', '(￣ε(#￣) Σ', 'ヽ(`Д´)ﾉ', '( ´ρ`)',
        '(╯°口°)╯(┴—┴', '（#-_-)┯━┯', '_(:3」∠)_', '(笑)', '(汗)', '(泣)', '(苦笑)', '(´・ω・`)', '(╯°□°）╯︵ ┻━┻', '(╯‵□′)╯︵┻━┻', '( ﾟωﾟ)',
        '(　^ω^)', '(｡◕∀◕｡)', '/( ◕‿‿◕ )\\', 'ε٩( º∀º )۶з', '(￣ε(#￣)☆╰╮(￣▽￣///)', '（●´3｀）~♪', '_(:з」∠)_', 'хорошо!', '＼(^o^)／', '(•̅灬•̅ )',
        '(ﾟДﾟ)', '(；°ほ°)', 'ε=ε=ε=┏(゜ロ゜;)┛', '⎝≧⏝⏝≦⎠', 'ヽ(✿ﾟ▽ﾟ)ノ', '|•ω•`)', '小学生は最高だぜ！！', '焔に舞い上がるスパークよ、邪悪な異性交際に、天罰を与え！'
    ]
};
for (let s = 0; s < localSmile.length; s++) { MenuList[`${localSmile[s].name}`] = { datatype: 'image', title: localSmile[s].title, desc: localSmile[s].desc, addr: localSmile[s].addr }; }
for (let s = 0; s < OnlineSmile.length; s++) { MenuList[`${OnlineSmile[s].name}`] = { datatype: 'image', title: OnlineSmile[s].title, desc: OnlineSmile[s].desc, addr: OnlineSmile[s].addr }; }


/**
 * 添加BBCode
 * @param textArea 文本框
 * @param {string} code BBCode
 * @param {string} selText 选择文本
 */
const addCode = function (textArea, code, selText = '') {
    let startPos;
    if (customize.markdown == false) {
        startPos = !selText ? (code.indexOf('[img]') > -1 || code.indexOf(']') < 0 ? code.length : code.indexOf(']') + 1) : code.indexOf(selText);
    }
    else if (customize.markdown == true) {
        startPos = !selText ? (code.indexOf('[]') > -1 && code.length < 10 ? code.length - 1 : (code.indexOf('*') > -1 || code.indexOf('`') > -1 || code.indexOf('<') > -1 || code.indexOf('~') > -1 ? Math.floor(code.length / 2) : code.length)) : code.indexOf(selText);
    }
    if (typeof textArea.selectionStart !== 'undefined') {
        let prePos = textArea.selectionStart;
        textArea.value = textArea.value.substring(0, prePos) + code + textArea.value.substring(textArea.selectionEnd);
        textArea.selectionStart = prePos + startPos;
        textArea.selectionEnd = prePos + startPos + selText.length;
        if ($('#spp-reply-textarea').length > 0) {
            let textArea2 = $('#spp-reply-textarea')[0], prePos = textArea2.selectionStart;
            textArea2.value = textArea2.value.substring(0, prePos) + code + textArea2.value.substring(textArea2.selectionEnd);
            textArea2.selectionStart = prePos + startPos;
            textArea2.selectionEnd = prePos + startPos + selText.length;
        }
    }
    else {
        textArea.value += code;
        if ($('#spp-reply-textarea').length > 0) { $('#spp-reply-textarea')[0].value += code; }
    }
};


/**
 * 添加Html文本
 * @param {string} code Html文本
 */
const addHCode = function (code) {
    let target1 = document.createTextNode("\u0001");
    $realtimeView.getSelection().getRangeAt(0).insertNode(target1);
    let position = $realtimeView.body.innerHTML.indexOf("\u0001");
    target1.parentNode.removeChild(target1);
    if (position > 0) {
        let target = $realtimeView.createElement("nobr"); target.innerHTML = code;
        $realtimeView.getSelection().getRangeAt(0).insertNode(target);
    }
    else { $realtimeView.body.innerHTML += code; }
};


/**
 * 显示放大的表情图片
 * @param {jQuery} $img 表情图片对象
 */
const showZoomInImage = function ($img) {
    if ($img.get(0).naturalWidth <= $img.height()) return;
    let offset = $img.offset();
    let $zoomIn = $(`<img class="stickerpp-zoom-in" src="${$img.attr('src')}" alt="[预览图片]">`).appendTo('body');
    let windowWidth = $(window).width();
    let zoomInWidth = $zoomIn.outerWidth();
    let top = offset.top - $zoomIn.outerHeight() - 5;
    let left = offset.left + $img.width() / 2 - zoomInWidth / 2;
    if (left < 0) left = 0;
    else if (left + zoomInWidth > windowWidth) left = windowWidth - zoomInWidth;
    $zoomIn.css({ top, left });
};


/**
* 获取表情面板的HTML代码
* @param {string} key 菜单关键字
* @returns {string} 表情面板内容
*/
const getSmilePanelHtml = function (key) {
    let data = MenuList[key];
    if (!data) return '';
    let html = '';
    for (let i = 0; i < data.addr.length; i++) {
        if (data.datatype === 'image') {
            html += `<img class="stickerpp-smile" src="${data.addr[i]}" alt="[表情]">`;
        }
        else if (data.datatype === 'imageLink') {
            let ref = typeof data.ref !== 'undefined' && typeof data.ref[i] !== 'undefined' ? data.ref[i] : '';
            html += `<img class="stickerpp-smile" data-code="${ref}" src="${data.addr[i]}" alt="[表情]">`;
        }
        else if (data.datatype === 'plain') {
            let ref = typeof data.ref !== 'undefined' && typeof data.ref[i] !== 'undefined' ? data.ref[i] : data.addr[i];
            html += `<a class="stickerpp-smile-text" data-code="${data.addr[i]}"  href="#">${ref}</a>`;
        }
    }
    return `<div class="stickerpp-smile-panel" data-key="${key}">${html}</div>`;
};


/**
* 获取子菜单的HTML代码
* @returns {string} 子菜单内容
*/
const getSubMenuHtml = function () {
    let html = '';
    $.each(MenuList, function (key, data) {
        html += `<a class="stickerpp-sub-menu" data-key="${key}" href="#" title="${data.desc}">${data.title}</a>`;
    });
    return html;
};


/**
 * 创建容器
 * @param textArea 文本框
 * @param qufen 区分不同文本区域
 */
// 看板娘
let stickerppkanban = document.createElement("div");
if (isKfMobile == true || isMobile == true) {
    stickerppkanban.innerHTML = `<div id = "stickerppkanban" style = "position:fixed;left:5px;top:300px;z-index:88;cursor:pointer;" >
 <img class="stickerppkanban" src = ${customize.kanbanimg} width ="32%"} height ="32%"}></div>`;
}
else {
    if (localStorage.imgpvpc != null) {
        let imgpvpc = localStorage.imgpvpc; let imgpvpcpush = JSON.parse(imgpvpc);
        stickerppkanban.innerHTML = `<div id = "stickerppkanban" style = "position:fixed;left:${imgpvpcpush[0]};top:${imgpvpcpush[1]};z-index:88;cursor:pointer;" >
 <img class="stickerppkanban" src = ${customize.kanbanimg} width =${customize.kanbansize + "%"} height =${customize.kanbansize + "%"}></div>`;
    }
    else {
        stickerppkanban.innerHTML = `<div id = "stickerppkanban" style = "position:fixed;left:5px;top:40px;z-index:88;cursor:pointer;" >
 <img class="stickerppkanban" src = ${customize.kanbanimg} width =${customize.kanbansize + "%"} height =${customize.kanbansize + "%"}></div>`;
    }
} document.body.appendChild(stickerppkanban);
let imgpv = document.getElementById("stickerppkanban"); window.onload = function () { drag(imgpv); };
// 表情商店相关
const StickerPPDialogHtml = `
<form>
<div class="stickerpp-shop_box" id="StickerPP-shop-dialog" style="display: block; top: 8px; left: 336px;">
  <sheader><logo>&nbsp;&nbsp;&nbsp;表情贴纸商店 | Sticker Shop</logo>
    <span class="stickerpp-close-shop">×&nbsp;&nbsp;</span></sheader>
    <div class="stickerpp-shop_main" ><br>
    <div class="StickerPP-list-content"></div>
</div>
<div class="pd_cfg_btns"></div>
<div class="sticker-pages"><div class="StickerPP-list-pagination"></div></div>
<div class="stickerpp-shop_footer">
    <a target="_blank" href="https://stickers.inari.site/terms">Terms Of Service/服务条款</a> | <a target="_blank" href="https://stickers.inari.site/rules">Privacy Policy/隐私策略</a> | <a target="_blank" href="https://stickers.inari.site/qa">Q&A/常见问题</a> |
    ©mistakey&nbsp;&nbsp;
  </div></div></form>
`;
const StickerPPItemHtml = `
<div class="sticker-item">
<div class="sticker-item-img"><img style="width: 50px; height: 50px;"/></div>
<div class="sticker-item-name"></div>
</div>
`;
const StickerPPPaginationItemHtml = `
<div class="StickerPP-pagination-item-button"></div>
`;
const StickerPPNowPageHtml = `
<div class="StickerPP-pagination-nowpage-button"></div>
`;
const prevNextPageHtml = `
<div class="StickerPP-pagination-prev-next"></div>
`;
$(document).on("click", "#StickerPP-shop-dialog .sticker-item", function (e) {
    let selctedid = $(e.target).parents(".sticker-item").data("id"), selctedtext = JSON.parse($(e.target).parents(".sticker-item").data("content"));
    localStorage.onlineraws ? OnlineRawslists = JSON.parse(localStorage.onlineraws) : OnlineRawslists = [];
    OnlineRawslists == [] ? olhaved = false : olhaved = OnlineRawslists.some(o => o.id === selctedid);
    if (olhaved == false) {
        if (confirm("是否选择启用ID为" + $(e.target).parents(".sticker-item").data("id") + "的在线表情贴纸" + $(e.target).parents(".sticker-item").text())) {
            customize.olimglists.push(selctedid);
            OnlineRawslists.push(selctedtext);
            localStorage.setItem('onlineraws', JSON.stringify(OnlineRawslists))
            localStorage.setItem('StickerConf', JSON.stringify(customize))
            sessionStorage.removeItem('OnlineSmile')
        } else { alert("启用操作取消") }
    }
    else if (olhaved == true) {
        if (confirm("是否选择停用ID为" + $(e.target).parents(".sticker-item").data("id") + "的在线表情贴纸" + $(e.target).parents(".sticker-item").text())) {
            const indexToRemove = OnlineRawslists.findIndex((orl) => orl.id === selctedid); OnlineRawslists.splice(indexToRemove, 1);
            customize.olimglists.splice(customize.olimglists.indexOf(selctedid), 1);
            localStorage.setItem('onlineraws', JSON.stringify(OnlineRawslists))
            localStorage.setItem('StickerConf', JSON.stringify(customize))
            sessionStorage.removeItem('OnlineSmile')
        } else { alert("停用操作取消") }
    }
}).on("click", "#StickerPP-shop-dialog .StickerPP-pagination-item-button", function (e) {
    $(document).find('.stickerpp-shop_box').hide();
    let $dialog = $("#StickerPP-shop-dialog")[0];
    $("body").append(StickerPPDialogHtml);
    StickerPPLoadSticker($(e.target).data("id"));
}).on("click", "#StickerPP-shop-dialog .StickerPP-pagination-prev-next", function (e) {
    $(document).find('.stickerpp-shop_box').hide();
    let $dialog = $("#StickerPP-shop-dialog")[0];
    $("body").append(StickerPPDialogHtml);
    StickerPPLoadSticker($(e.target).data("id"));
}).on('click', '.stickerpp-close-shop', function (e) {
    $(document).find('.stickerpp-shop_box').hide();
});
// 表情菜单
const createContainer = function (textArea, qufen) {
    let $container = $(`<div class="stickerpp-container">
    <div class="stickerpp-menu" id="smilepndw${qufen}" style="text-align:left;">
    <input type= "file"  class="stickerpp-user-p" id="stickerpp-user-p${qufen}" accept="image/*" style="display:none;" >
    <input type="button" class="stickerpp-user-t" value="上传图片" ${KFstyle}>
    <input type="button" class="stickerpp-user-y" value="云同步">
    <input type="button" class="stickerpp-user-i" value="自定义">
    <input type="button" class="stickerpp-user-g" value="表情组设置">&nbsp;
    <span class="stickerpp-close-panel" title="表情增强插件，版本${defaultSConf.version}，理论支持所有存在纯文本模式且支持BBcode的支持图片外链的论坛。本次更新日志：${updatelog}" style="cursor: pointer;"><b>⑨</b></span>
    ${getSubMenuHtml()}<span class="stickerpp-close-panel">[-]</span>&nbsp;<input type="checkbox" class="realeditclick" id="realedit${qufen}" value="realedit" ${realeditcheck}>可视化编辑

    <div class="stickerpp-diy-panel" style="display:none">
    <input type="button" class="stickerpp-user-c" value="添加贴纸">&nbsp;
    <input type="button" class="stickerpp-user-r" value="导出贴纸">&nbsp;
    <input type="button" class="stickerpp-user-u" value="修改贴纸">&nbsp;
    <input type="button" class="stickerpp-user-d" value="删除贴纸">&nbsp;
    <input type="button" class="stickerpp-user-cfg" value="个性设置">
    <div class="stickerpp-conf-panel" style="display:none">
    <table><tr><td>
    <li><input type="text" class="conftext" id="kanbanimg${qufen}" value="">&nbsp;<input type="button" class="stickerpp-res-kanbanimg" value="默认">（看板娘图片URL）<input type="button" class="stickerpp-res-kanbanloc" value="重置看板娘位置"></li>
    <li><input type="number" class="conftext" id="kanbansize${qufen}" value="">&nbsp;<input type="button" class="stickerpp-res-kanbansize" value="默认">（看板娘/贴图预览大小）</li>
    <li><input type="text" class="conftext" id="onlineraw${qufen}" value="">&nbsp;<input type="button" class="stickerpp-res-onlineraw" value="默认">（在线贴纸仓库API）&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" class="stickerpp-res-all" value="全部初始化"></li>
    <li><input type="text" class="conftext" id="imgapi${qufen}" value="">&nbsp;<input type="button" class="stickerpp-res-imgapi" value="默认">（图片上传图床API）</li>
    <li><input type="text" class="conftext" id="olimglists${qufen}" disabled="true" value="">&nbsp;<input type="button" class="stickerpp-res-olimglists" value="默认">（已选在线贴纸ID数组）&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" class="stickerpp-conf-close" value="关闭列表"></li>
    <li><input type="checkbox" class="confbt" id="writeable${qufen}" value="writeable"><span style="cursor: help;color:red" title="请确定你知道你在做什么！在此修改（特别是增加！）已选在线贴纸组ID数组可能会发生不可预知的错误！">编辑ID数组【!】</span>
    <input type="checkbox" class="confbt" id="markdown${qufen}" value="markdown">使用Markdown取代BBcode&nbsp;
    <input type="checkbox" class="confbt" id="notauthed${qufen}" value="auth">显示未经验证的数据源</li>
    </td></tr></table></div></div>
    <div class="stickerpp-acc-panel" style="display:none">
    <input type="button" class="stickerpp-user-reg" value="注册">&nbsp;
    <input type="button" class="stickerpp-user-log" value="登录">&nbsp;
    <input type="button" class="stickerpp-user-img" value="绑定图床">&nbsp;
    <input type="button" class="stickerpp-user-ltc" value="上传云端">&nbsp;
    <input type="button" class="stickerpp-user-ctl" value="恢复本地">&nbsp;
    <input type="button" class="stickerpp-user-out" value="退出登录"></div>
    <div class="stickerpp-bqz-panel" style="display:none">
    <input type="button" class="stickerpp-user-loc" value="启用的本地表情">&nbsp;
    <input type="button" class="stickerpp-user-oln" value="浏览表情组商店">&nbsp;
    <input type="button" class="stickerpp-user-raw" value="商店数据源设置">&nbsp;
    <div class="stickerpp-loc-panel" style="display:none"><table><tr>
    <td><li><input type="checkbox" class="locbt" id="ng${qufen}0" value="0">AC娘</li></td>
    <td><li><input type="checkbox" class="locbt" id="ng${qufen}1" value="1">S1麻将脸</li></td>
    <td><li><input type="checkbox" class="locbt" id="ng${qufen}3" value="3">看板娘小B</li></td>
    <td><li><input type="checkbox" class="locbt" id="ng${qufen}4" value="4">微博贴吧</li></td>
    <td><li><input type="checkbox" class="locbt" id="ng${qufen}2" value="2">阿卡林</li></td></tr><tr>
    <td><li><input type="checkbox" class="locbt" id="ng${qufen}9" value="9">邦邦</li></td>
    <td><li><input type="checkbox" class="locbt" id="ng${qufen}6" value="6">LoveLive</li></td>
    <td><li><input type="checkbox" class="locbt" id="ng${qufen}8" value="8">公主链接R</li></td>
    <td><li><input type="checkbox" class="locbt" id="ng${qufen}7" value="7">少女歌剧</li></td>
    <td><li><input type="checkbox" class="locbt" id="ng${qufen}5" value="5">小红豆</li></td>
    <td><input type="button" class="stickerpp-loc-close"value="关闭列表" ></td></tr>
    </table></div></div></div>

    <div class="StickerPPHtmlEditerP" id="Htmlediterpannel${qufen}" style="display:none;text-align:left;width=100%" >
    <div class="StickerPPHtmlediterF" id="Htmlediter${qufen}">
        <button class="Heditm" data-edit="undo" title="撤销(Ctrl+Z)">↩️</button>
        <button class="Heditm" data-edit="redo" title="重做(Ctrl+Y)">↪️</button>
        <button class="Heditms" id="HEDurl" title="插入链接">🔗</button>
        <button class="Heditms" id="HEDimg" title="插入图片">🖼️</button>
        <button class="Heditms" id="HEDaudio" title="插入HTML5音频">🎵</button>
        <button class="Heditms" id="HEDvideo" title="插入HTML5视频">🎞️</button>
        <button class="Heditm" data-edit="quote" title="插入引用内容">💬</button>
        <button class="Heditm" data-edit="code" title="插入代码内容" >📄</button>
        <button class="Heditm" data-edit="hide" title="插入隐藏内容">💡</button>
        <button class="Heditm" data-edit="sell" title="插入出售内容">🪙</button>
        <button class="Heditm" data-edit="bold" title="粗体"><b>B</b></button>
        <button class="Heditm" data-edit="italic" title="斜体"><i><b>I</b></i></button>
        <button class="Heditm" data-edit="underline" title="下划线"><u><b>U</b></u></button>
        <button class="Heditm" data-edit="strikeThrough" title="删除线"><s><b>A</b></s></button>
        <button class="Heditm" data-edit="hr" title="插入水平线" ><b>一</b></button>
        <input  class="Heditms" type='color' onblur="document.execCommand('forecolor',false,this.value)" title="字体颜色">
        <input  class="Heditms" type='color' onblur="document.execCommand('backcolor',false,this.value)" title="背景颜色">
        <button class="Heditm" data-edit="justifyLeft" title="左对齐"><b>⤆</b></button>
        <button class="Heditm" data-edit="justifyCenter" title="居中"><b>⟺</b></button>
        <button class="Heditm" data-edit="justifyRight" title="右对齐"><b>⤇</b></button>
        <button class="Heditm" data-edit="Subscript" title="下标">X<b>,</b></button>
        <button class="Heditm" data-edit="Superscript" title="上标">X<b>'</b></button>
        <span title="字体大小设置">
        <button class="Heditm" data-edit="fontSize:1">s</button>
        <button class="Heditm" data-edit="fontSize:3">M</button>
        <button class="Heditm" data-edit="fontSize:5">L</button>
        <button class="Heditm" data-edit="fontSize:7"><b>L</b></button>
      </span>
        <button class="Heditm" data-edit="removeFormat" title="清除选中文本的格式"><b>⨯</b></button>
        
            
    </div>
    <div class="StickerPPHtmlEditer" id="Htmleditarea${qufen}" contenteditable="true" spellcheck="false" style="height: 300px;overflow:auto;background:white;border:1px dashed #000;outline:none;margin: 0px; height: 300px;margin: 0px; " ></div>

    </div>

    </div>`).insertBefore($(textArea));
    if (isKfMobile == true) {
        $(`<button class="btn btn-secondary upload-image-btn ml-1" title="上传图片" onclick="$('.stickerpp-user-p').click();">
            <i class="fa fa-picture-o" aria-hidden="true"></i>上传图片</button>`).insertAfter($("#smileDropdownBtn"));
    }
    else if (isKF == true) { $(`<a>&nbsp;</a><input type="button" class="stickerpp-user-pt" value="上传图片" onclick="$('.stickerpp-user-p').click();">`).insertAfter($('[name="Submit"][value!="全站搜索"]')); }
    if (realedit == true && rhview == false && isMQ == false) {
        let $realP = $container.find(`#Htmlediterpannel${qufen}`), $realPHE = $container.find(`#Htmleditarea${qufen}`);
        $realPHE[0].innerHTML = bb2html(textArea.value);
        if ($('#spp-reply-textarea').length > 0) {
            $realPHE[0].innerHTML = bb2html($('#spp-reply-textarea')[0].value);
        }
        $realP.show(); $('textarea').hide();$('#editor-button').hide();

    }
    else if (realedit == false && rhview == false) {
        let $realP = $container.find(`#Htmlediterpannel${qufen}`).hide(), $realPHE = $container.find(`#Htmleditarea${qufen}`);
        $realPHE[0].innerHTML = bb2html(textArea.innerHTML);
        if ($('#spp-reply-textarea').length > 0) {
            $realPHE[0].innerHTML = bb2html($('#spp-reply-textarea')[0].value);
        }
        $realP.show(); $realP.hide();
    }
    $container.on('click', '.stickerpp-sub-menu', function (e) {
        e.preventDefault();
        $container.find('.stickerpp-acc-panel').hide();
        $container.find('.stickerpp-bqz-panel').hide();
        let $this = $(this), key = $this.data('key');
        if (!key) return;
        $container.find('.stickerpp-sub-menu').removeClass('stickerpp-sub-menu-active');
        $this.addClass('stickerpp-sub-menu-active');
        $container.find('.stickerpp-smile-panel').hide();
        let $panel = $container.find(`.stickerpp-smile-panel[data-key="${key}"]`);
        if ($panel.length > 0) { $panel.show(); }
        else {
            $('#smilepndw' + qufen).append($(getSmilePanelHtml(key))).show();
            let $panels = $container.find(`.stickerpp-smile-panel[data-key="${key}"]`);
            $panels.show();
        }
    }).on('click', '.stickerpp-smile, .stickerpp-smile-text', function (e) {
        e.preventDefault();
        let $this = $(this), code = $this.data('code');
        if (rhview == false && realedit == true) {
            if (!code) { document.execCommand('insertImage', false, $this.attr('src')); }
            else { document.execCommand('insertText', false, code); }
        }
        else if (rhview == false && realedit == false) {
            if (customize.markdown == false) { if (!code) code = `[img]${$this.attr('src')}[/img]`; addCode(textArea, code); }
            else if (customize.markdown == true) { if (!code) code = `![](${$this.attr('src')})`; addCode(textArea, code); }
        }
        else if (rhview == true) {
            if (!code) code = `<img src="${$this.attr('src')}" border="0" alt="" style="max-width:400px"></img>`; addHCode(code);
        }
        if (/(Mobile|MIDP)/i.test(navigator.userAgent)) textArea.blur();
        else textArea.focus();
    }).on('mouseenter', '.stickerpp-smile', function () {
        $('.stickerpp-zoom-in').remove();
        showZoomInImage($(this));
    }).on('mouseleave', '.stickerpp-smile', function () {
        $('.stickerpp-zoom-in').remove();
    }).on('change', '.stickerpp-user-p', function (e) {
        e.preventDefault(); let file = this.files[0];
        if (file != null) {
            let formData = new FormData();
            formData.append('file', file);
            upimgfunc(formData, textArea);
        }
    }).on('click', '.stickerpp-user-t', function (e) {
        e.preventDefault();
        $('#stickerpp-user-p' + qufen).click();
    }).on('click', '.stickerpp-user-g', function (e) {
        e.preventDefault();
        $container.find('.stickerpp-smile-panel').hide();
        $container.find('.stickerpp-diy-panel').hide();
        $container.find('.stickerpp-acc-panel').hide();
        let $this = $(this);
        $container.find('.stickerpp-user-g').removeClass('stickerpp-user-g-active');
        $this.addClass('stickerpp-user-g-active');
        $container.find('.stickerpp-diy-panel').hide();
        let $panel = $container.find(`.stickerpp-bqz-panel`);
        $panel.show();
    }).on('click', '.stickerpp-user-i', function (e) {
        e.preventDefault();
        $container.find('.stickerpp-acc-panel').hide();
        $container.find('.stickerpp-bqz-panel').hide();
        let $this = $(this);
        $container.find('.stickerpp-user-i').removeClass('stickerpp-user-i-active');
        $this.addClass('stickerpp-user-i-active');
        $container.find('.stickerpp-diy-panel').hide();
        let $panel = $container.find(`.stickerpp-diy-panel`);
        $panel.show();
    }).on('click', '.stickerpp-user-y', function (e) {
        e.preventDefault();
        $container.find('.stickerpp-smile-panel').hide();
        $container.find('.stickerpp-diy-panel').hide();
        $container.find('.stickerpp-bqz-panel').hide();
        let $this = $(this);
        $container.find('.stickerpp-user-y').removeClass('stickerpp-user-y-active');
        $this.addClass('stickerpp-user-y-active');
        $container.find('.stickerpp-acc-panel').hide();
        let $panel = $container.find(`.stickerpp-acc-panel`);
        $panel.show();
    }).on('click', '.stickerpp-user-c', function (e) {
        e.preventDefault(); usercfunc();
    }).on('click', '.stickerpp-user-r', function (e) {
        e.preventDefault(); userrfunc();
    }).on('click', '.stickerpp-user-u', function (e) {
        e.preventDefault(); userufunc();
    }).on('click', '.stickerpp-user-d', function (e) {
        e.preventDefault(); userdfunc();
    }).on('click', '.stickerpp-user-ctl', function (e) {
        e.preventDefault();
        if (localStorage.logindata != null) { ctlfunc() }
        else { alert('未找到有效Token，请先登录！') };
    }).on('click', '.stickerpp-user-ltc', function (e) {
        e.preventDefault();
        if (localStorage.logindata != null) { ltcfunc() }
        else { alert('未找到有效Token，请先登录！') };
    }).on('click', '.stickerpp-user-log', function (e) {
        e.preventDefault();
        if (localStorage.logindata == null) { loginfunc() }
        else { alert('请勿重复登录！如需更换账号或Token过期请先登出再登录！') };
    }).on('click', '.stickerpp-user-img', function (e) {
        e.preventDefault();
        if (localStorage.logindata != null) { imgbindcheckfunc() }
        else { alert('请登录云同步账号后再进行绑定！') }
    }).on('click', '.stickerpp-user-reg', function (e) {
        e.preventDefault();
        if (localStorage.logindata == null) { regfunc() }
        else { alert("检测到您已登录！如需更换账号请先登出！"); }
    }).on('click', '.stickerpp-user-out', function (e) {
        e.preventDefault();
        localStorage.removeItem('logindata'); alert('已登出账号！');
    }).on('click', '.stickerpp-user-loc', function (e) {
        e.preventDefault();
        if (customize.lcimglists == false) { for (let i = 0; i < 10; i++) { $(['.locbt']["#ng" + qufen + i]).attr("checked", true); } }
        else if (customize.lcimglists != false) { let checklcg = customize.lcimglists; for (let i = 0; i < checklcg.length; i++) { $("#ng" + qufen + checklcg[i]).attr("checked", true); } }
        else { alert("发生错误") };
        $container.find('.stickerpp-diy-panel').hide();
        let $this = $(this);
        $container.find('.stickerpp-user-loc').removeClass('stickerpp-user-loc-active');
        $this.addClass('stickerpp-user-loc-active');
        $container.find('.stickerpp-loc-panel').hide();
        let $panel = $container.find(`.stickerpp-loc-panel`);
        $panel.show();
    }).on('click', '.stickerpp-user-oln', function (e) {
        e.preventDefault();
        StickerPPShowDialog();
    }).on('click', '.stickerpp-user-raw', function (e) {
        e.preventDefault();
        let theonlineraw = prompt("在线表情组商店数据仓库源设置，默认使用inari源", 'https://api.inari.site/?s=App.Sticker.');
        let safeornot = confirm("是否显示未经审核的表情贴纸组？");
        if (theonlineraw) customize.onlineraw = theonlineraw;
        customize.notauthed = safeornot;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
    }).on('click', '.stickerpp-user-cfg', function (e) {
        e.preventDefault();
        // 载入个性化设置状态
        $("#kanbanimg" + qufen).attr("value", customize.kanbanimg);
        $("#kanbansize" + qufen).attr("value", customize.kanbansize);
        $("#onlineraw" + qufen).attr("value", customize.onlineraw);
        $("#imgapi" + qufen).attr("value", customize.imgapi);
        $("#olimglists" + qufen).attr("value", customize.olimglists);
        $("#notauthed" + qufen).attr("checked", customize.notauthed);
        $("#markdown" + qufen).attr("checked", customize.markdown);
        let $panel = $container.find(`.stickerpp-conf-panel`);
        $panel.show();
    }).on('click', '.locbt', function (e) {
        let thenum = e.target.value, locimgs = customize.lcimglists;
        if (e.target.checked == false) { locimgs = locimgs.filter(item => { return item != thenum }) }
        else { locimgs.push(thenum); }
        customize.lcimglists = locimgs;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
        sessionStorage.removeItem('localSmile');
    }).on('click', '.stickerpp-res-kanbanimg', function () {
        customize.kanbanimg = defaultSConf.kanbanimg;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
        alert(resText);
    }).on('click', '.stickerpp-res-kanbansize', function () {
        customize.kanbansize = defaultSConf.kanbansize;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
        alert(resText);
    }).on('click', '.stickerpp-res-onlineraw', function () {
        customize.onlineraw = defaultSConf.onlineraw;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
        alert(resText);
    }).on('click', '.stickerpp-res-imgapi', function () {
        customize.imgapi = defaultSConf.imgapi;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
        alert(resText);
    }).on('click', '.stickerpp-res-olimglists', function () {
        customize.olimglists = defaultSConf.olimglists;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
        alert(resText);
    }).on('click', '.stickerpp-res-kanbanloc', function () {
        localStorage.setItem('imgpvpc', JSON.stringify(["5px", "100px"]));
        alert(resText);
    }).on('click', '.stickerpp-res-all', function () {
        let todefault = defaultSConf;
        todefault.lcimglists = customize.lcimglists;
        localStorage.setItem('StickerConf', JSON.stringify(todefault));
        localStorage.setItem('imgpvpc', JSON.stringify(["5px", "100px"]));
        sessionStorage.removeItem('localSmile'); sessionStorage.removeItem('OnlineSmile');
        alert("已重置，请刷新！");
    }).on('click', '.Heditm', function (e) {
        e.preventDefault();
        const cmd_val = this.getAttribute("data-edit").split(":");
        let CQSHcon = false;
        if (window.getSelection) {
            CQSHcon = window.getSelection().toString();
        }
        if (cmd_val[0] == 'hr') {
            document.execCommand("insertHTML", false, "<hr>");
        }
        else if (cmd_val[0] == 'code' || cmd_val[0] == 'quote') {
            if (CQSHcon == false) {
                document.execCommand("insertHTML", false, `<br><fieldset><legend>${cmd_val[0]}:</legend>此处输入${cmd_val[0]}内容</fieldset><br>`);
            }
            else {
                document.execCommand("insertHTML", false, `<br><fieldset><legend>${cmd_val[0]}:</legend>${CQSHcon}</fieldset><br>`);
            }
        }
        else if (cmd_val[0] == 'sell') {
            if (CQSHcon == false) {
                document.execCommand("insertHTML", false, `<br><fieldset><legend>${cmd_val[0]}=10</legend>此处输入${cmd_val[0]}内容</fieldset><br>`);
            }
            else {
                document.execCommand("insertHTML", false, `<br><fieldset><legend>${cmd_val[0]}=10</legend>${CQSHcon}</fieldset><br>`);
            }
        }
        else if (cmd_val[0] == 'hide') {
            if (CQSHcon == false) {
                document.execCommand("insertHTML", false, `<br><fieldset><legend>${cmd_val[0]}=300</legend>此处输入${cmd_val[0]}内容</fieldset><br>`);
            }
            else {
                document.execCommand("insertHTML", false, `<br><fieldset><legend>${cmd_val[0]}=300</legend>${CQSHcon}</fieldset><br>`);
            }
        }
        else { document.execCommand(cmd_val[0], false, cmd_val[1]); }
    }).on('click', '#HEDurl', function (e) {
        e.preventDefault(); let URLcon = false;
        if (window.getSelection) { URLcon = window.getSelection().toString(); }
        if (URLcon == false) {
            let HEDurl = prompt("请输入要插入的url", 'https://');
            if (HEDurl) {
                let HEDurlT = prompt("请输入插入的url的描述文字，否则默认使用url作为描述文字", '');
                if (HEDurlT) {
                    if (HEDurlT.length > 2) {
                        document.execCommand("insertHTML", false, '<a href="' + HEDurl + '">' + HEDurlT + '</a>');
                    } else { document.execCommand('CreateLink', HEDurl, HEDurl) }
                } else { document.execCommand('CreateLink', HEDurl, HEDurl) }
            }
        }
        else {
            let HEDurlTU = prompt("请输入要插入的url，否则默认使用选中文本作为url链接", '');
            if (HEDurlTU) {
                if (HEDurlTU.length > 2) {
                    console.log(HEDurlTU)
                    document.execCommand('CreateLink', URLcon, HEDurlTU)
                } else { document.execCommand('CreateLink', URLcon, URLcon) }
            } else { document.execCommand('CreateLink', URLcon, URLcon) }
        }
    }).on('click', '#HEDimg', function (e) {
        e.preventDefault();
        let HEDimg = prompt("请输入要插入的图片url", 'https://');
        document.execCommand("insertHTML", false, '<img src="' + HEDimg + '" border="0">');
    }).on('click', '#HEDaudio', function (e) {
        e.preventDefault();
        let HEDaudio = prompt('请输入HTML5音频实际地址：\n（可直接输入网易云音乐的单曲地址，喵拉将自动转换为外链地址）', 'https://');
        if (HEDaudio) {
            let matches = /^https?:\/\/music\.163\.com\/(?:#\/)?song\?id=(\d+)/i.exec(HEDaudio);
            if (matches) HEDaudio = `https://music.miaola.work/163/${matches[1]}.mp3`;
            matches = /^https?:\/\/www\.xiami\.com\/song\/(\w+)/i.exec(HEDaudio);
            if (matches) HEDaudio = `https://music.miaola.work/xiami/${matches[1]}.mp3`;
            document.execCommand("insertHTML", false, `<audio src="${HEDaudio}" controls="" preload="none" style="margin: 3px 0;">[你的浏览器不支持audio标签]</audio><br>`);
        }
    }).on('click', '#HEDvideo', function (e) {
        e.preventDefault();
        let HEDvideo = prompt('请输入HTML5视频实际地址：\n（可直接输入YouTube视频页面的地址，喵拉将自动转换为外链地址）', 'https://');
        if (HEDvideo) {
            let matches = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w\-]+)/i.exec(HEDvideo);
            if (matches) HEDvideo = `https://video.miaola.work/youtube/${matches[1]}`;
            matches = /^https?:\/\/youtu\.be\/([\w\-]+)$/i.exec(HEDvideo);
            if (matches) HEDvideo = `https://video.miaola.work/youtube/${matches[1]}`;
            document.execCommand("insertHTML", false, `<video src="${HEDvideo}" controls="" preload="none" style="margin: 3px 0;">[你的浏览器不支持video标签]</video><br>`);
        }
    }).on('click', '#notauthed' + qufen, function (e) {
        customize.notauthed = e.target.checked;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
    }).on('click', '#markdown' + qufen, function (e) {
        customize.markdown = e.target.checked;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
    }).on('click', '#writeable' + qufen, function (e) {
        e.target.checked ? $("#olimglists" + qufen).attr("disabled", false) : $("#olimglists" + qufen).attr("disabled", true);
    }).on('click', '#realedit' + qufen, function (e) {
        let $panel = $(`#Htmlediterpannel${qufen}`);
        if (rhview == false) {
            let $tempRHArea = $container.find(`#Htmleditarea${qufen}`);
            if (e.target.checked) {
                TeContent = bb2html(textArea.value);
                $tempRHArea[0].innerHTML = TeContent;
                if ($('#spp-reply-textarea').length > 0) {
                    let spptextarea = $('#spp-reply-textarea'), sppcontent = bb2html(spptextarea[0].value);
                    $tempRHArea[0].innerHTML = sppcontent;
                }
                $panel.show(); $('textarea').hide();$('#editor-button').hide(); customize.realedit = true, realedit = true;
                localStorage.setItem('StickerConf', JSON.stringify(customize));
            }
            else {
                if (realedits == false) {
                    realedits = true;
                    $('textarea').show();$('#editor-button').show();
                    customize.realedit = false;
                    localStorage.setItem('StickerConf', JSON.stringify(customize));
                }
                else {
                    $('textarea').show();$('#editor-button').show();
                    let HeContent = html2bb($tempRHArea[0].innerHTML);
                    textArea.innerHTML = HeContent;
                    textArea.innerText = HeContent;
                    textArea.value = HeContent;
                    if ($('#spp-reply-textarea').length > 0) {
                        let spptextarea = $('#spp-reply-textarea');
                        spptextarea[0].innerHTML = HeContent;
                        spptextarea[0].innerText = HeContent;
                        spptextarea[0].value = HeContent
                    }
                    $panel.hide(); customize.realedit = false, realedit = false;
                    localStorage.setItem('StickerConf', JSON.stringify(customize));
                }
            }
        }
        else if (rhview == true) {
            alert('检测到当前页面自带可视化编辑器！请使用自带的可视化编辑器！');
        }
    }).on('blur', '#Htmleditarea' + qufen, function (e) {
        let HeContent = html2bb(e.target.innerHTML);
        textArea.innerHTML = HeContent;
        textArea.innerText = HeContent;
        textArea.value = HeContent;
    }).on('keydown', '#Htmleditarea' + qufen, function (e) {
        if (e.keyCode === 13) {
            document.execCommand('insertHTML', false, '<br>&zwnj;');
            //e.preventDefault();
        }
    }).on('paste', '#Htmleditarea' + qufen, function (e) {
        let isimg=event.clipboardData.files;
        if(isimg.length>0)
        {event.preventDefault();
        const pd = event.clipboardData.items[0];
        if (!(/^image\/[jpeg|png|gif|jpg]/.test(pd.type))) { return; }
        const file = event.clipboardData.items[0].getAsFile()
        // 让文件名使用时间戳
        let name = JSON.stringify(new Date().getTime());
        const files = new File([file], name + "." + file.name.substr(file.name.lastIndexOf('.') + 1), {
            type: file.type, lastModified: file.lastModified,
        });
        let formData = new FormData(), reader = new FileReader(); formData.append('file', files);
        reader.readAsDataURL(files); upimgfunc(formData, textArea);}
        else;
    }).on('blur', '#kanbanimg' + qufen, function (e) {
        customize.kanbanimg = e.target.value;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
    }).on('blur', '#kanbansize' + qufen, function (e) {
        customize.kanbansize = e.target.value;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
    }).on('blur', '#onlineraw' + qufen, function (e) {
        customize.onlineraw = e.target.value;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
    }).on('blur', '#imgapi' + qufen, function (e) {
        customize.imgapi = e.target.value;
        localStorage.setItem('StickerConf', JSON.stringify(customize));
    }).on('blur', '#olimglists' + qufen, function (e) {
        e.target.value == "" ? TempLists = [] : TempList = qc(e.target.value.match(/\d+/g).map(o => +o));
        $.ajax({ url: customize.onlineraw + 'GetListR&page=1&perpage=1', type: 'POST', contentType: false, processData: false, })
            .done(data => {
                if (data.ret == 200) {
                    let ttotal = data.data, total = ttotal.total;
                    for (let i = 0; i < TempList.length; i++) { if (TempList[i] <= total) { get1stfunc(TempList[i]); } }
                } else { alert('发生' + data.ret + '错误，' + data.msg); }
            })
            .fail(data => { alert("未知错误，请打开控制台查看！"); console.log(data); });
    }).on('click', '.stickerpp-loc-close', function () {
        $container.find('.stickerpp-loc-panel').hide();
    }).on('click', '.stickerpp-conf-close', function () {
        $container.find('.stickerpp-conf-panel').hide();
    }).find('.stickerpp-close-panel').click(function () {
        $container.find('.stickerpp-smile-panel').hide();
        $container.find('.stickerpp-diy-panel').hide();
        $container.find('.stickerpp-acc-panel').hide();
        $container.find('.stickerpp-bqz-panel').hide();
    });
    // 文本区域直接上传图片并预览
    document.querySelector('textarea').addEventListener('paste', (event) => {
        let isfiles = event.clipboardData.files;
        if (isfiles.length > 0) {
            event.preventDefault();
            const pd = event.clipboardData.items[0];
            if (!(/^image\/[jpeg|png|gif|jpg]/.test(pd.type))) { return; }
            const file = event.clipboardData.items[0].getAsFile()
            // 让文件名使用时间戳
            let name = JSON.stringify(new Date().getTime());
            const files = new File([file], name + "." + file.name.substr(file.name.lastIndexOf('.') + 1), {
                type: file.type, lastModified: file.lastModified,
            });
            let formData = new FormData(), reader = new FileReader(); formData.append('file', files);
            reader.onload = function ({ target }) {
                setTimeout(() => { $(".stickerppkanban").attr('src', target.result) }, 400)
                setTimeout(() => {
                    if (isKfMobile == true) { $(".stickerppkanban").attr('src', 'https://sticker.inari.site/favicon.ico') }
                    else { $(".stickerppkanban").attr('src', customize.kanbanimg) }
                }, 4000)
            }
            reader.readAsDataURL(files); upimgfunc(formData, textArea);
        }
        else;
    });
};


/**
 * 方法功能区
 * @param textArea 文本框
 */
// 修复实时编辑模式下phpwind的回复某楼
let realedits = true,uupath = [];
const uploadfile=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAVCAYAAADGpvm7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMGSURBVFhH7ZkxduIwEIZ/71lsCl5OYJ8Ap6Gi3c6UcIAt9wCmjLttqWgwJ8An4FFg30U7Y0kgWTaBgEkRf+/pkcgjaTRI848TTxAY6J1f6nOgZ3oNdLWK4HkRVpXqeCXVCpHnIbph8d3cIz+5dfv66F5+/InmAMZZiLQUEGKPhU+du3kd+PlO2jyDHx7oCtt1AYQzvHOAGxxOz7uKQ45m3kaw4jz5oNMtsK+P93MYAv0iVKArrCISg2hFP5mofiNZXURBPatFRLbbc5o71vPmaBsu1zPsWhfZYW7asH+letSBnDfAkjIHsliO0/u/K0ffFocvnugCyyDA8Q8LiGxlGpK/tzjHQaENIkWpxnLLkwxxU9Vpw7/x72wjyhQhBcWqJOrqIkaW5IbdDOt4SV524y/2ZFuC3Ab02P3CTiGf0rKXPKnj4FQ79JAoBS0oEKb0k4nqT3L1O/WkIb/giJBk2sadQ9qGwjQlP6gvEZcZNblIaF5zLRd3jc758qTDTxN3fzVqrNl9z17a+r94okPMHJn28T6j41Ec0X1rd9hk9JFMMZEdBhNMKdLINnYKUfWwvJbqqp+5Ml8wJi/7pHvtYMwrH2AWLT2Iob2ARXWip/Q1jQP5ewPpoEblvuBKCvhkvpeg87vRAvs01Dw10OWRF3jDqCvR+SN6yoe+/czL8YpqCy5xz/mzbiqnatR834rln9nUy49CBdrHSEbAvvZ6sw4F3FhdSwuajvRQU+HEx1OPL4/1SU6m5mwlzO+C7gD4EhTrrawWDKrt+qoYPo7ay+HkrN0KRV/iiIcSioZAaTG0hUHb2mLRJiDUKSg2jvA6AqLtjLWlTWOs8tsSNN1Hzd2PKVKPiWGbjwzbNkX4kjrobYgMUCwDlWu4fGtc1TMh0pxKqEDnJRapBHnjurTiL7DnFEBFUWDktfjAJdLH5TawHUXWzIGbaYs//BbXsPP+jlFyKahMeqPeS46kkae5JG2+Vd7992gu9EmfkJY3BHXgTA9Vx0AbQ6BfxBDoFzH8z/AlAP8BmM5ocebFmOwAAAAASUVORK5CYII=`;
;
function postreplys(txta, txtb) {
    console.log('hi')
    if (typeof document.FORM != "undefined") {
        document.FORM.atc_content.focus();
        document.FORM.atc_content.innerHtml = '[quote]' + txta + '[/quote]\r\n';
        document.FORM.diy_guanjianci.value = txtb;
    }
}
$(document).on('click', "a[title='回复此楼']", function (e) {
    let rpstr=e.target.getAttribute("onclick");
    rpstr=rpstr.replace(/postreply\('*([^\'\"]*)','[^\'\"]*'\);/g, '$1');
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<fieldset><legend>quote:</legend>${rpstr}</fieldset><br>`;
}).on('click', "a[title='多重回复']", function () {
    if (realedit == true) { realedits = false; }
    $('textarea').show(); $('.StickerPPHtmlEditerP').hide();
}).on("change", "#attachment_1", function (e) {
    let FileData = e.target.files[0];
    if (!/image\/\w+/.test(FileData.type)) {uupath[0]=uploadfile;}
    else {
        let upreader = new FileReader();
        upreader.readAsDataURL(FileData);
        upreader.onload = function (e) {
            uupath[0]=this.result;
        }
    }
}).on("change", "#attachment_2", function (e) {
    let FileData = e.target.files[0];
    if (!/image\/\w+/.test(FileData.type)) {uupath[1]=uploadfile;}
    else {
        let upreader = new FileReader();
        upreader.readAsDataURL(FileData);
        upreader.onload = function (e) {
            uupath[1]=this.result;
        }
    }
}).on("change", "#attachment_3", function (e) {
    let FileData = e.target.files[0];
    if (!/image\/\w+/.test(FileData.type)) {uupath[2]=uploadfile;}
    else {
        let upreader = new FileReader();
        upreader.readAsDataURL(FileData);
        upreader.onload = function (e) {
            uupath[2]=this.result;
        }
    }
}).on("change", "#attachment_4", function (e) {
    let FileData = e.target.files[0];
    if (!/image\/\w+/.test(FileData.type)) {uupath[3]=uploadfile;}
    else {
        let upreader = new FileReader();
        upreader.readAsDataURL(FileData);
        upreader.onload = function (e) {
            uupath[3]=this.result;
        }
    }
}).on("change", "#attachment_5", function (e) {
    let FileData = e.target.files[0];
    if (!/image\/\w+/.test(FileData.type)) {uupath[4]=uploadfile;}
    else {
        let upreader = new FileReader();
        upreader.readAsDataURL(FileData);
        upreader.onload = function (e) {
            uupath[4]=this.result;
        }
    }
}).on("change", "#attachment_6", function (e) {
    let FileData = e.target.files[0];
    if (!/image\/\w+/.test(FileData.type)) {uupath[5]=uploadfile;}
    else {
        let upreader = new FileReader();
        upreader.readAsDataURL(FileData);
        upreader.onload = function (e) {
            uupath[5]=this.result;
        }
    }
}).on("change", "#attachment_7", function (e) {
    let FileData = e.target.files[0];
    if (!/image\/\w+/.test(FileData.type)) {uupath[6]=uploadfile;}
    else {
        let upreader = new FileReader();
        upreader.readAsDataURL(FileData);
        upreader.onload = function (e) {
            uupath[6]=this.result;
        }
    }
}).on("change", "#attachment_8", function (e) {
    let FileData = e.target.files[0];
    if (!/image\/\w+/.test(FileData.type)) {uupath[7]=uploadfile;}
    else {
        let upreader = new FileReader();
        upreader.readAsDataURL(FileData);
        upreader.onload = function (e) {
            uupath[7]=this.result;
        }
    }
}).on("change", "#attachment_9", function (e) {
    let FileData = e.target.files[0];
    if (!/image\/\w+/.test(FileData.type)) {uupath[8]=uploadfile;}
    else {
        let upreader = new FileReader();
        upreader.readAsDataURL(FileData);
        upreader.onload = function (e) {
            uupath[8]=this.result;
        }
    }
}).on("change", "#attachment_10", function (e) {
    let FileData = e.target.files[0];
    if (!/image\/\w+/.test(FileData.type)) {uupath[9]=uploadfile;}
    else {
        let upreader = new FileReader();
        upreader.readAsDataURL(FileData);
        upreader.onload = function (e) {
            uupath[9]=this.result;
        }
    }
}).on("click", "#att_span1 .abtn", function (e) {
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<img src="${uupath[0]}" type="upload_1" width="240">`;
}).on("click", "#att_span2 .abtn", function (e) {
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<img src="${uupath[1]}" type="upload_2" width="240">`;
}).on("click", "#att_span3 .abtn", function (e) {
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<img src="${uupath[2]}" type="upload_3" width="240">`;
}).on("click", "#att_span4 .abtn", function (e) {
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<img src="${uupath[3]}" type="upload_4" width="240">`;
}).on("click", "#att_span5 .abtn", function (e) {
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<img src="${uupath[4]}" type="upload_5" width="240">`;
}).on("click", "#att_span6 .abtn", function (e) {
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<img src="${uupath[5]}" type="upload_6" width="240">`;
}).on("click", "#att_span7 .abtn", function (e) {
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<img src="${uupath[6]}" type="upload_7" width="240">`;
}).on("click", "#att_span8 .abtn", function (e) {
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<img src="${uupath[7]}" type="upload_8" width="240">`;
}).on("click", "#att_span9 .abtn", function (e) {
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<img src="${uupath[8]}" type="upload_9" width="240">`;
}).on("click", "#att_span10 .abtn", function (e) {
    $('.StickerPPHtmlEditer')[0].innerHTML+=`<img src="${uupath[9]}" type="upload_10" width="240">`;
});

// html2bb&bb2html
function html2bb(str) {
    str = str.replace(/<img[^>]*smile=\"(\d+)\"[^>]*>/ig, '[s:$1]');
    str = str.replace(/<img[^>]*type=\"(attachment|upload)\_(\d+)\"[^>]*>/ig, '[$1=$2]');
    code_htm = new Array();
    code_num = 0;
    str = str.replace(/(\r\n|\n|\r)/ig, '');
    str = str.replace(/<p[^>\/]*\/>/ig, '\n');
    str = str.replace(/\son[\w]{3,16}\s?=\s*([\'\"]).+?\1/ig, '');
    str = str.replace(/<fieldset><legend>(Quote|code):<\/legend>(.+?)<\/fieldset>/ig, '[$1]$2[/$1]');
    str = str.replace(/<fieldset><legend>(sell|hide)=(.+?)<\/legend>(.+?)<\/fieldset>/ig, '[$1=$2]$3[/$1]');
    str = str.replace(/<(audio|video)[^>]*src=[\'\"\s]*([^\'\"]*)[^>]*>(.+?)<\/(audio|video)>/ig, '[$1]$2[/$1]');
    str = str.replace(/<(audio|video) src=[\'\"\s]*([^\'\"]*) controls="" preload="none" style="margin: 3px 0;">\[你的浏览器不支持(audio|video)标签\]<\/(audio|video)>/ig, '[$1]$2[/$1]');
    str = str.replace(/<hr[^>]*>/ig, '[hr]');
    str = str.replace(/<(sub|sup|u|strike|b|i|pre)>/ig, '[$1]');
    str = str.replace(/<\/(sub|sup|u|strike|b|i|pre)>/ig, '[/$1]');
    str = str.replace(/<(\/)?strong>/ig, '[$1b]');
    str = str.replace(/<(\/)?em>/ig, '[$1i]');
    str = str.replace(/<(\/)?blockquote([^>]*)>/ig, '[$1blockquote]');
    str = str.replace(/<img[^>]*src=[\'\"\s]*([^\'\"]+)[^>]*>/ig, '[img]' + '$1' + '[/img]');
    str = str.replace(/<a[^>]*href=[\'\"\s]*([^\'\"]*)[^>]*>(.+?)<\/a>/ig, '[url=$1]' + '$2' + '[/url]');
    str = str.replace(/<h([1-6]+)([^>]*)>(.*?)<\/h\1>/ig, function ($1, $2, $3, $4) { return h($3, $4, $2); });
    str = searchtag('table', str, 'table', 1);
    str = searchtag('font', str, 'Font', 1);
    str = searchtag('div', str, 'dsc', 1);
    str = searchtag('p', str, 'p', 1);
    str = searchtag('span', str, 'dsc', 1);
    str = searchtag('ol', str, 'list', 1);
    str = searchtag('ul', str, 'list', 1);
    for (i in code_htm) {
        str = str.replace("[\twind_phpcode_" + i + "\t]", code_htm[i]);
    }
    str = str.replace(/&nbsp;/ig, ' ');
    str = str.replace(/<br[^>]*>/ig, '\n');
    str = str.replace(/<[^>]*?>/ig, '');
    str = str.replace(/&amp;/ig, '&');
    str = str.replace(/&quot;/ig, '"');
    str = str.replace(/&lt;/ig, '<');
    str = str.replace(/&gt;/ig, '>');
    return str;
}
function bb2html(str) {
    code_htm = new Array();
    code_num = 0;
    str = str.replace(/&(?!(#[0-9]+|[a-z]+);)/ig, '&amp;');
    str = str.replace(/</ig, '&lt;');
    str = str.replace(/>/ig, '&gt;');
    str = str.replace(/\n/ig, '<br />');
    str = str.replace(/\[(quote|code)\](.+?)\[\/(quote|code)\]/ig, '<fieldset><legend>$1:</legend>$2</fieldset>');
    str = str.replace(/\[(sell|hide)=(.+?)\](.+?)\[\/(sell|hide)\]/ig, '<fieldset><legend>$1=$2</legend>$3</fieldset>');
    str = str.replace(/\[(audio|video)\](.+?)\[\/(audio|video)\]/ig, '<$1 src="$2" controls="" preload="none" style="margin: 3px 0;">[你的浏览器不支持$1标签]</$1>');
    str = str.replace(/\[hr\]/ig, '<hr />');
    str = str.replace(/\[\/(size|color|font|backcolor)\]/ig, '</font>');
    str = str.replace(/\[(sub|sup|u|i|strike|b|blockquote|li)\]/ig, '<$1>');
    str = str.replace(/\[(quote|code)\]/ig, '<fieldset><legend>$1:</legend>');
    str = str.replace(/\[\/(quote|code)\]/ig, '</fieldset>');
    str = str.replace(/\[\/(sub|sup|u|i|strike|b|blockquote|li)\]/ig, '</$1>');
    str = str.replace(/\[size=(\d+?)\]/ig, '<font size="$1">');
    str = str.replace(/\[color=([^\[\<]+?)\]/ig, '<font color="$1">');
    str = str.replace(/\[backcolor=([^\[\<]+?)\]/ig, '<font style="background-color:$1">');
    str = str.replace(/\[font=([^\[\<]+?)\]/ig, '<font face="$1">');
    str = str.replace(/\[list=(a|A|1)\](.+?)\[\/list\]/ig, '<ol type="$1">$2</ol>');
    str = str.replace(/\[(\/)?list\]/ig, '<$1ul>');
    str = str.replace(/\[(attachment|upload)=(\d+)\]/ig, function ($1, $2, $3) { return attpath($3, $2); });
    str = str.replace(/\[s:(\d+)\]/ig, function ($1, $2) { return smilepath($2); });
    str = str.replace(/\[img\]([^\[]*)\[\/img\]/ig, '<img src="$1" border="0" />');
    str = str.replace(/\[url=([^\]]+)\]([^\[]+)\[\/url\]/ig, '<a href="$1">' + '$2' + '</a>');
    str = searchtag('table', str, 'tableshow', 2);
    str = str.replace(/\[\/align\]/ig, '</p>');
    str = str.replace(/\[(\/)?h([1-6])\]/ig, '<$1h$2>');
    str = str.replace(/\[align=(left|center|right|justify)\]/ig, '<p align="$1">');
    for (i in code_htm) {
        str = str.replace("[\twind_phpcode_" + i + "\t]", code_htm[i]);
    }
    return str;
}
// 杂项
function attpath(attid, type) {
    let path = '', upath = false;
    if (type == 'attachment' && IsElement('atturl_' + attid)) {
        path = getObj('atturl_' + attid).innerHTML;
    }
    else if (type == 'upload' && IsElement('attachment_' + attid)) {
        let FileData = $('#attachment_' + attid)[0].files[0];
        if (!/image\/\w+/.test(FileData.type)) {
            path='';upath=false;
        }
        else {
            path = uupath[attid-1];upath=true;
            
        }
        //result.innerHTML = '<img src="'+this.result+'" alt=""/>';
    }
    if (!path) {
        return '[' + type + '=' + attid + ']';
    } 
    else {
        if (!path.match(/\.(jpg|gif|png|bmp|jpeg)$/ig)&&upath==false) {
            path = imgpath + '/' + stylepath + '/file/zip.gif';
        }
        let img = imgmaxwh(path, 320);
        if (img.width == 0) {
            return '<img src="' + path + '" type="' + type + '_' + attid + '" width="' + "240" + '" />';
        }
        else { return '<img src="' + path + '" type="' + type + '_' + attid + '" width="' + img.width + '" />'; }
    }
}
function imgmaxwh(url,maxwh) {
	var img = new Image();
	img.src = url;
	if (img.width>maxwh || img.width>maxwh) {
		img.width = (img.width/img.height)>1 ? maxwh : maxwh*img.width/img.height;
	}
	return img;
}
function smilepath(NewCode) {
    if (isKF) {
        let NewCodes = NewCode - 9;
        let kfImgPath = typeof imgpath !== 'undefined' ? imgpath : '';
        if (isKfMobile) kfImgPath = Info.imgPath;
        if (NewCode < 19) {
            return '<img src="/' + kfImgPath + '/post/smile/em/em0' + NewCodes + '.gif' + '" smile="' + NewCode + '" />';
        }
        else {
            return '<img src="/' + kfImgPath + '/post/smile/em/em' + NewCodes + '.gif' + '" smile="' + NewCode + '" />';
        }
    }
    else {
        return '<img src="' + imgpath + '/post/smile/smallface/face' + NewCode + '.gif' + '" smile="' + NewCode + '" />';
    }
}
function h(style, code, size) {
    size = 7 - size;
    code = '[size=' + size + '][b]' + code + '[/b][/size]';
    return p(style, code);
}
function p(style, code) {
    if (style.indexOf('align=') != -1) {
        style = findvalue(style, 'align=');
        code = '[align=' + style + ']' + code + '[/align]';
    } else {
        code += "\n";
    }
    return code;
}
function dsc(style, code) {
    var styles = [
        ['align', 1, 'align='],
        ['align', 1, 'text-align:'],
        ['backcolor', 2, 'background-color:'],
        ['color', 2, 'color:'],
        ['font', 1, 'font-family:'],
        ['b', 0, 'font-weight:', 'bold'],
        ['i', 0, 'font-style:', 'italic'],
        ['u', 0, 'text-decoration:', 'underline'],
        ['strike', 0, 'text-decoration:', 'line-through']
    ];

    style = style.toLowerCase();
    for (var i = 0; i < styles.length; i++) {
        var begin = style.indexOf(styles[i][2]);
        if (begin == -1) {
            continue;
        }
        var value = findvalue(style, styles[i][2]);
        if (styles[i][1] == 2 && value.indexOf('rgb') != -1) {
            value = WYSIWYD._colorToRgb(value);
        }
        if (styles[i][1] == 0) {
            if (value == styles[i][3]) {
                code = '[' + styles[i][0] + ']' + code + '[/' + styles[i][0] + ']';
            }
        } else {
            code = '[' + styles[i][0] + '=' + value + ']' + code + '[/' + styles[i][0] + ']';
        }
        style = style.replace(styles[i][2], '');
    }

    return code;
}
function searchtag(tagname, str, action, type) {
    if (type == 2) {
        var tag = ['[', ']'];
    } else {
        var tag = ['<', '>'];
    }
    var head = tag[0] + tagname;
    var head_len = head.length;
    var foot = tag[0] + '/' + tagname + tag[1];
    var foot_len = foot.length;
    var strpos = 0;

    do {
        var strlower = str.toLowerCase();
        var begin = strlower.indexOf(head, strpos);
        if (begin == -1) {
            break;
        }
        var strlen = str.length;

        for (var i = begin + head_len; i < strlen; i++) {
            if (str.charAt(i) == tag[1]) break;
        }
        if (i >= strlen) break;

        var firsttag = i;
        var style = str.substr(begin + head_len, firsttag - begin - head_len);

        var end = strlower.indexOf(foot, firsttag);
        if (end == -1) break;

        var nexttag = strlower.indexOf(head, firsttag);
        while (nexttag != -1 && end != -1) {
            if (nexttag > end) break;
            end = strlower.indexOf(foot, end + foot_len);
            nexttag = strlower.indexOf(head, nexttag + head_len);
        }
        if (end == -1) {
            strpos = firsttag;
            continue;
        }

        firsttag++;
        var findstr = str.substr(firsttag, end - firsttag);
        str = str.substr(0, begin) + eval(action)(style, findstr, tagname) + str.substr(end + foot_len);
        strpos = begin;

    } while (begin != -1);

    return str;
}
function tableshow(style, str) {
    if (style.substr(0, 1) == '=') {
        var width = style.substr(1);
    } else {
        var width = '100%';
    }
    str = str.replace(/\[td=(\d{1,2}),(\d{1,2})(,(\d{1,3}%?))?\]/ig, '<td colspan="$1" rowspan="$2" width="$4">');
    str = str.replace(/\[(tr|td)\]/ig, '<$1>');
    str = str.replace(/\[\/(tr|td)\]/ig, '</$1>');

    return '<table width=' + width + ' class="t" cellspacing=0>' + str + '</table>';
}
function findvalue(style, find) {
    var firstpos = style.indexOf(find) + find.length;
    var len = style.length;
    var start = 0;
    for (var i = firstpos; i < len; i++) {
        var t_char = style.charAt(i);
        if (start == 0) {
            if (t_char == '"' || t_char == "'") {
                start = i + 1;
            } else if (t_char != ' ') {
                start = i;
            }
            continue;
        }
        if (t_char == '"' || t_char == "'" || t_char == ';') {
            break;
        }
    }
    return style.substr(start, i - start);
}
function table(style, str) {

    str = str.replace(/<tr([^>]*)>/ig, '[tr]');
    str = str.replace(/<\/tr>/ig, '[/tr]');
    str = searchtag('td', str, 'td', 1);
    str = searchtag('th', str, 'td', 1);

    var styles = ['width=', 'width:'];
    style = style.toLowerCase();

    var s = '';
    for (i in styles) {
        if (style.indexOf(styles[i]) == -1) {
            continue;
        }
        s = '=' + findvalue(style, styles[i]);
        break;
    }
    return '[table' + s + ']' + str + '[/table]';
}
function td(style, str) {
    if (style == '') {
        return '[td]' + str + '[/td]';
    }

    var colspan = 1;
    var rowspan = 1;
    var width = '';
    var value;

    if (style.indexOf('colspan=') != -1) {
        value = findvalue(style, 'colspan=');
        if (value > 1) colspan = value;
    }
    if (style.indexOf('rowspan=') != -1) {
        value = findvalue(style, 'rowspan=');
        if (value > 1) rowspan = value;
    }
    if (style.indexOf('width=') != -1) {
        width = findvalue(style, 'width=');
    }
    if (width == '') {
        return (colspan == 1 && rowspan == 1 ? '[td]' : '[td=' + colspan + ',' + rowspan + ']') + str + '[/td]';
    } else {
        return '[td=' + colspan + ',' + rowspan + ',' + width + ']' + str + '[/td]';
    }
}
function list(type, code, tagname) {
    code = code.replace(/<(\/)?li>/ig, '[$1li]');
    if (tagname == 'ul') {
        return '[list]' + code + '[/list]';
    }
    if (type && type.indexOf('type=') != '-1') {
        type = findvalue(type, 'type=');
        if (type != 'a' && type != 'A' && type != '1') {
            type = '1';
        }
        return '[list=' + type + ']' + code + '[/list]';
    } else {
        return '[list=1]' + code + '[/list]';
    }
}
function Font(style, str) {
    var styles = new Array();

    styles = { 'size': 'size=', 'color': 'color=', 'font': 'face=', 'backcolor': 'background-color:' };
    style = style.toLowerCase();

    for (st in styles) {
        var begin = style.indexOf(styles[st]);
        if (begin == -1) {
            continue;
        }
        var value = findvalue(style, styles[st]);
        if (in_array(st, ['backcolor', 'color']) && value.indexOf('rgb') != -1) {
            value = WYSIWYD._colorToRgb(value);
        }
        str = '[' + st + '=' + value + ']' + str + '[/' + st + ']';
    }
    return str;
}
// CURD方法
function usercfunc() {
    let userimgc = prompt("请输入要添加的贴纸的URL，添加多个请用半角,隔开贴纸URL（添加后刷新页面生效）", "https://sticker.inari.site/inari.png");
    if (!userimgc) return; let userimgcmt = userimgc.split(','); let addList = [];
    for (let mt = 0; mt < userimgcmt.length; mt++) {
        //含http/https协议前缀的完整图片url，请确保未开启防盗链
        if (/(http:\/\/|https:\/\/).*.(png|jpg|jpeg|gif|webp|bmp|tif)+.*$/i.test(userimgcmt[mt])) { addList.push(userimgcmt[mt]); }
        //任意无协议前缀的图片url，默认增加https协议前缀
        else if (/[a-zA-Z0-9\-\.]+\.+[a-zA-Z]+\/.*.(png|jpg|jpeg|gif|webp|bmp|tif)+.*$/i.test(userimgcmt[mt])) { addList.push('https://' + userimgcmt[mt]); }
        //由sticker.inari.site托管的用户贴纸组
        else if (/[A-Za-z0-9\_\/]+\/+[0-9\/]+.(png|jpg|jpeg|gif|webp)$/i.test(userimgcmt[mt])) { addList.push('https://sticker.inari.site/usr/' + userimgcmt[mt]); }
    } if (addList.length < userimgcmt.length) { alert('含有非法输入，请检查是否有图片url错误'); }
    if (addList.length > 0) {
        let userSmileList = [];
        if (localStorage.userimgst) {
            try { userSmileList = JSON.parse(localStorage.userimgst); }
            catch (ex) { console.log(ex); userSmileList = []; }
        }
        userSmileList = [...userSmileList, ...addList];
        localStorage.setItem('userimgst', JSON.stringify(userSmileList));
        alert('贴纸已添加'); location.reload();
    }
}
function userufunc() {
    let userimgu = prompt("请输入要替换的贴纸的序号", "1");
    if (/[0-9]$/i.test(userimgu)) {
        let userimgst = localStorage.userimgst, UserSmileList = JSON.parse(userimgst);
        if (userimgu > UserSmileList.length) { alert('序号超出贴纸数，请检查'); }
        else if (userimgu == 0) { alert('非法输入，请检查！'); } else if (userimgu <= UserSmileList.length) {
            let usreplace = prompt("请输入用于替换的图片url", "https://sticker.inari.site/inari.png"), j = userimgu;
            if (/(http:\/\/|https:\/\/).*.(png|jpg|jpeg|gif|webp|bmp|tif)+.*$/i.test(usreplace)) {
                if (confirm('确定替换序号为' + userimgu + '的贴纸吗？这是最后一次确认！')) {
                    UserSmileList[j - 1] = usreplace; localStorage.setItem('userimgst', JSON.stringify(UserSmileList));
                    alert('已替换指定序号的贴纸'); location.reload();
                }
            }
            else if (usreplace == null) { } else if (usreplace == 0) { alert('非法输入，请检查！'); } else { alert('非法输入，请检查！'); }
        }
        else if (userimgu == null) { } else { alert('非法输入，请检查！'); }
    }
}
function userrfunc() {
    if (UserSmileList != "https://sticker.inari.site/null.jpg") { prompt("自定义表情贴纸已导出，请复制", UserSmileList) }
    else { alert("自定义表情贴纸为空！"); }
}
function userdfunc() {
    if (confirm('确定删除自定义表情贴纸吗？')) {
        if (confirm('【确定】清空自定义贴纸，【取消】删除指定贴纸。')) {
            if (confirm('确定【清空自定义贴纸】吗？这是【最后一次】确认')) {
                localStorage.removeItem('userimgst');
                alert('已清空自定义贴纸'); location.reload();
            }
        }
        else {
            let userimgd = prompt("请输入要删除的贴纸的序号", "1");
            if (/[0-9]$/i.test(userimgd)) {
                let userimgst = localStorage.userimgst, UserSmileList = JSON.parse(userimgst);
                if (userimgd > UserSmileList.length) { alert('序号超出贴纸数，请检查'); }
                else if (userimgd == 0) { alert('非法输入，请检查！'); }
                else if (userimgd <= UserSmileList.length) {
                    if (confirm('确定删除【序号为' + userimgd + '的贴纸】吗？这是【最后一次】确认！')) {
                        for (let i = userimgd; i <= UserSmileList.length; i++) { UserSmileList[i - 1] = UserSmileList[i]; }
                        UserSmileList.pop(); localStorage.setItem('userimgst', JSON.stringify(UserSmileList));
                        alert('已删除指定序号的贴纸！'); location.reload();
                    }
                }
                else { alert('非法输入，请检查！') }
            } else if (userimgd == null) { } else { alert('非法输入，请检查！') }
        }
    }
}
// 表情商店方法
const StickerPPShowDialog = function () {
    let $dialog = $("#StickerPP-shop-dialog")[0];
    $("body").append(StickerPPDialogHtml);
    StickerPPLoadSticker(1);
}
const StickerPPLoadSticker = function (thePage) {
    let success = function (data) {
        loadStickerList(data.data.items);
        loadStickerListPagination(data.data);
    };
    let onlineRaw = customize.onlineraw;
    let authornot;
    customize.notauthed == false ? authornot = "GetList" : authornot = "GetListR";
    let PageRequest = new XMLHttpRequest();
    PageRequest.open('POST', onlineRaw + authornot + '&page=' + thePage + '&perpage=20', true);
    PageRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    PageRequest.send('name=teswe&ee=ef');
    PageRequest.onreadystatechange = function () {
        if (PageRequest.readyState == 4 && PageRequest.status == 200) {
            let pagejson = PageRequest.responseText;
            let pageload = JSON.parse(pagejson);
            if (pageload.ret == 200) {
                success(pageload);
            }
            else { alert('发生异常！' + pageload.msg); }
        }
        else if (PageRequest.readyState == 4 && PageRequest.status != 200) {
            alert('发生错误！错误状态码：' + PageRequest.status)
        }
    }
}
const loadStickerList = function (items) {
    let $root = $("#StickerPP-shop-dialog .StickerPP-list-content");
    $root.empty();
    $.each(items, function (_, o) {
        let content = JSON.parse(o.content);
        let $node = $(StickerPPItemHtml).prop("title", content.desc).data("id", o.id).data("content", o.content)
            .find("img").prop("src", content.cover).end()
            .find(".sticker-item-name").text(o.title).end();
        $root.append($node);
    });
}
const loadStickerListPagination = function (data) {
    let total = Math.ceil(data.total / 20), page = data.page, $root = $("#StickerPP-shop-dialog .StickerPP-list-pagination");
    if (page != 1) {
        $root.append($(StickerPPPaginationItemHtml).data("id", 1).text("回首页"));
        $root.append($(prevNextPageHtml).data("id", page - 1).text("上一页"))
    }
    if (total < 12 || page < 7) {
        for (let i = 1; i < page; ++i) {
            let id = i, $node = $(StickerPPPaginationItemHtml).data("id", id).text(id);
            $root.append($node);
        }
        let $node1 = $(StickerPPNowPageHtml).data("id", page).text(page);
        $root.append($node1);
        for (let i = page; i < total; ++i) {
            let id = i + 1, $node = $(StickerPPPaginationItemHtml).data("id", id).text(id);
            $root.append($node);
        }
    }
    else if (total > 11 && page + 5 < total) {
        for (let i = page - 5; i < page; ++i) {
            let id = i, $node = $(StickerPPPaginationItemHtml).data("id", id).text(id);
            $root.append($node);
        }
        let $node1 = $(StickerPPNowPageHtml).data("id", page).text(page);
        $root.append($node1);
        for (let i = page; i < page + 5; ++i) {
            let id = i + 1, $node = $(StickerPPPaginationItemHtml).data("id", id).text(id);
            $root.append($node);
        }
    }
    else if (total > 11 && page + 6 > total) {
        for (let i = total - 10; i < page; ++i) {
            let id = i, $node = $(StickerPPPaginationItemHtml).data("id", id).text(id);
            $root.append($node);
        }
        let $node1 = $(StickerPPNowPageHtml).data("id", page).text(page);
        $root.append($node1);
        for (let i = page; i < total; ++i) {
            let id = i + 1, $node = $(StickerPPPaginationItemHtml).data("id", id).text(id);
            $root.append($node);
        }
    }
    if (page != total) {
        $root.append($(prevNextPageHtml).data("id", page + 1).text("下一页"));
        $root.append($(StickerPPPaginationItemHtml).data("id", total).text("去末页"));
    }
}
// 注册&登录方法
function loginfunc() {
    let username = prompt("用户名", 'username');
    if (username != null && username.length <= 50) {
        let password = prompt("密码", 'password')
        if (password != null && password.length >= 6 && password.length <= 20) {
            let loginRequest = new XMLHttpRequest();
            loginRequest.open('POST', 'https://api.inari.site/?s=App.User_User.Login&username=' + username + '&password=' + password, true);
            loginRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            loginRequest.send('name=teswe&ee=ef'); loginRequest.onreadystatechange = function () {
                if (loginRequest.readyState == 4 && loginRequest.status == 200) {
                    let loginjson = loginRequest.responseText, login = JSON.parse(loginjson);
                    if (login.ret == 200) {
                        let logindata = login.data; if (logindata.is_login == true) {
                            localStorage.setItem('logindata', JSON.stringify([logindata.user_id, logindata.token]));
                            imgbindcheckfunc()
                        }
                        else if (logindata.is_login == false) { alert('Oops！用户名或密码错误！请检查！') }
                    }
                    else { alert('Oops！' + login.ret + '错误！' + login.msg) }
                }
            }
        }
        else { password == null ? alert('取消登录！') : alert('密码' + lengtherrText + '6-20位'); }
    }
    else { username == null ? alert('取消登录！') : alert('用户名' + lengtherrText + '1-50位'); }
}
function regfunc() {
    let regname = prompt("用户名，1-50位，只支持英文、数字和有限的特殊符号如@_", 'username');
    if (regname.length >= 1 && regname.length <= 20) {
        let regpswd1 = prompt("输入6-20位密码，只支持英文、数字和有限的特殊符号如@_", 'password');
        let regpswd2 = prompt("确认密码", 'password'); if (regpswd1.length >= 6 && regpswd1.length <= 20) {
            if (regpswd1 == regpswd2) {
                let regRequest = new XMLHttpRequest(); regRequest.open('POST', 'https://api.inari.site/?s=App.User_User.Register&username=' + regname + '&password=' + regpswd2, true);
                regRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); regRequest.send('name=teswe&ee=ef'); regRequest.onreadystatechange = function () {
                    if (regRequest.readyState == 4 && regRequest.status == 200) {
                        let regjson = regRequest.responseText; let reg = JSON.parse(regjson); if (reg.ret == 200) {
                            let loginRequest = new XMLHttpRequest();
                            loginRequest.open('POST', 'https://api.inari.site/?s=App.User_User.Login&username=' + regname + '&password=' + regpswd2, true);
                            loginRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); loginRequest.send('name=teswe&ee=ef'); loginRequest.onreadystatechange = function () {
                                if (loginRequest.status === 200 && loginRequest.readyState === 4) {
                                    let loginjson = loginRequest.responseText; let login = JSON.parse(loginjson); let logindata = login.data;
                                    localStorage.setItem('logindata', JSON.stringify([logindata.user_id, logindata.token]));
                                    if (confirm('是否绑定up.inari.site图床账号？【确定】绑定【取消】则不绑定，上传图片将使用游客上传')) { imgbindfunc() }
                                    else { alert(notbindText); }
                                }
                            }
                        } else if (reg.ret != 200) { alert('Oops！' + reg.msg + '注册失败！返回码：' + reg.ret); }
                    }
                    else if (regRequest.readyState == 4 && regRequest.status != 200) { alert('用户名或密码不合规，只支持英文、数字和有限的特殊符号如@_'); }
                }
            }
            else { alert("两次密码不一致，注册操作已取消！"); }
        } else { alert("密码长度不合规，须在6-20位范围内，注册操作已取消！") }
    }
    else { alert("用户名长度不合规，须在1-50位范围内，注册操作已取消！"); }
}
// 绑定检测&图床绑定方法
function imgbindcheckfunc() {
    let tokenList = JSON.parse(localStorage.logindata), syncid = tokenList[0], synctoken = tokenList[1],
        getokenRequest = new XMLHttpRequest();
    getokenRequest.open('POST', 'https://api.inari.site/?s=App.User_User.Tutoken&user_id=' + syncid + '&token=' + synctoken, true);
    getokenRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    getokenRequest.send('name=teswe&ee=ef'); getokenRequest.onreadystatechange = function () {
        if (getokenRequest.readyState == 4 && getokenRequest.status == 200) {
            let getokentext = getokenRequest.responseText, getokenjson = JSON.parse(getokentext);
            if (getokenjson.ret == 200) {
                let tkdata = getokenjson.data, gtoken = tkdata.tutoken;
                if (gtoken != "") {
                    localStorage.setItem('logindata', JSON.stringify([syncid, synctoken, gtoken]));
                    alert('检测到您已绑定图床账号！上传图片将使用绑定的图床账号！');
                }
                else {
                    if (confirm('检测到没有绑定图床账号，是否绑定？不绑定则上传图片将使用游客上传！')) { imgbindfunc() }
                    else { alert(notbindText) }
                }
            } else { alert('检测是否绑定了图床账号失败！返回码：' + getokenjson.ret); }
        } else if (getokenRequest.readyState == 4 && getokenRequest.status != 200) { alert('异常的请求！状态码：' + getokenRequest.status); }
    }
}
function imgbindfunc() {
    let inariuser = prompt("inari图床账号邮箱", 'example@example.mail'), inaripass = prompt("inari图床账号密码", 'password'), formData = '{ "email":"' + inariuser + '" , "password":"' + inaripass + '" }';
    $.ajax({ url: imgapi + 'tokens', type: 'POST', dataType: 'json', data: formData, contentType: "application/json", processData: false, })
        .done(data => {
            if (data.status == true) {
                let tokenTList = JSON.parse(localStorage.logindata), synctid = tokenTList[0], syncttoken = tokenTList[1];
                let tokendata = data.data, token = tokendata.token, tokenarray = [synctid, syncttoken, token];
                localStorage.setItem('logindata', JSON.stringify(tokenarray)); let tokenRequest = new XMLHttpRequest();
                tokenRequest.open('POST', 'https://api.inari.site/?s=App.User_User.tupdate&user_id=' + syncid + '&token=' + synctoken + '&tupdate=' + token, true);
                tokenRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                tokenRequest.send('name=teswe&ee=ef'); tokenRequest.onreadystatechange = function () {
                    if (tokenRequest.readyState == 4 && tokenRequest.status == 200) {
                        let tokentext = tokenRequest.responseText, tokenjson = JSON.parse(tokentext);
                        if (tokenjson.ret == 200) { alert("已绑定图床账号！") } else { alert('图床账号绑定失败！' + tokenjson.msg) }
                    } else if (tokenRequest.readyState == 4 && tokenRequest.status != 200) {
                        alert('图床账号绑定失败！异常请求状态码：' + tokenRequest.status)
                    }
                }
            } else if (data.status == false) { alert(data.message) }
        })
        .fail(data => { alert('Oops！图床账号绑定失败！可能是服务器错误或网络问题！') });
}
// 上载&同步方法
function ltcfunc() {
    let tokenList = JSON.parse(localStorage.logindata), syncid = tokenList[0], synctoken = tokenList[1];
    if (confirm('确定同步【本地数据到云端】吗？这是最后一次确认！')) {
        let userimgst = localStorage.userimgst;
        if (userimgst != null) {
            let UserSmileList = JSON.parse(userimgst), upRequest = new XMLHttpRequest();
            upRequest.open('POST', 'https://api.inari.site/?s=App.User_User.picsupdate&user_id=' + syncid + '&token=' + synctoken + '&picsdata=' + UserSmileList, true);
            upRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            upRequest.send('name=teswe&ee=ef'); upRequest.onreadystatechange = function () {
                if (upRequest.readyState == 4 && upRequest.status == 200) {
                    let upjson = upRequest.responseText, upload = JSON.parse(upjson);
                    if (upload.ret == 200) { alert("已同步本地数据到云端！"); }
                    else { alert('Token已失效，请重新登录！'); }
                }
                else if (upRequest.readyState == 4 && upRequest.status != 200) {
                    alert('发生错误！错误状态码：' + upRequest.status);
                }
            }
        }
        else { alert('本地数据为空！同步到云端操作已取消！'); }
    }
}
function ctlfunc() {
    let tokendata = localStorage.logindata, tokenList = JSON.parse(tokendata);
    let syncid = tokenList[0], synctoken = tokenList[1];
    let dlRequest = new XMLHttpRequest();
    dlRequest.open('POST', 'https://api.inari.site/?s=App.User_User.picsdata&user_id=' + syncid + '&token=' + synctoken, true);
    dlRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    dlRequest.send('name=teswe&ee=ef');
    dlRequest.onreadystatechange = function () {
        if (dlRequest.readyState == 4 && dlRequest.status == 200) {
            let dljson = dlRequest.responseText, download = JSON.parse(dljson);
            if (download.ret == 200) {
                if (confirm('确定同步【云端数据到本地】吗？这是最后一次确认！')) {
                    let dldata = download.data, dlpicsList = dldata.picsdata; if (dlpicsList != "") {
                        localStorage.setItem('userimgst', JSON.stringify(dlpicsList.split(',')));
                        alert("已同步云端数据到本地！"); location.reload();
                    }
                    else { alert("云端数据为空！同步到本地操作已取消！"); }
                }
            }
            else { alert('Token已失效，请重新登录！'); }
        }
        else if (dlRequest.readyState == 4 && dlRequest.status != 200) {
            alert('发生错误！错误状态码：' + dlRequest.status)
        }
    }
}
// 上传图片方法
function upimgfunc(formData, textArea) {
    if(!textArea)textArea=$('textarea')[0];
    let authdata = localStorage.logindata;
    if (authdata == null) {
        $.ajax({ url: imgapi + 'upload', type: 'POST', dataType: 'json', data: formData, contentType: false, processData: false, })
            .done(data => {
                if (data.status == true) {
                    let inaridata = data.data, inarilinks = inaridata.links;
                    setTimeout(() => { alert(guestupimgText); }, 1000);
                    if (rhview == false && realedit == true) {
                        document.execCommand('insertImage', false, inarilinks.url);
                    }
                    else if (rhview == false && realedit == false) {
                        if (customize.markdown == false) { addCode(textArea, inarilinks.bbcode); }
                        else if (customize.markdown == true) { addCode(textArea, `![](${inarilinks.url})`); }
                    }
                    else if (rhview == false && realedit == true) {
                        addHCode(`<img src="${inarilinks.url}" border="0" alt="" style="max-width:400px"></img>`);
                    }
                }
                else if (data.status == false) {
                    alert(data.message);
                }
                else { alert('发生未知错误，' + data); }
            })
            .fail(data => { alert(imguperrText + data); });
    }
    else {
        let authList = JSON.parse(authdata); if (authList.length == 2) {
            $.ajax({ url: imgapi + 'upload', type: 'POST', dataType: 'json', data: formData, contentType: false, processData: false, })
                .done(data => {
                    if (data.status == true) {
                        let inaridata = data.data, inarilinks = inaridata.links;
                        if (rhview == false && realedit == true) {
                            document.execCommand('insertImage', false, inarilinks.url);
                        }
                        else if (rhview == false && realedit == false) {
                            if (customize.markdown == false) { addCode(textArea, inarilinks.bbcode); }
                            else if (customize.markdown == true) { addCode(textArea, `![](${inarilinks.url})`); }
                        }
                        else if (rhview == false && realedit == true) {
                            addHCode(`<img src="${inarilinks.url}" border="0" alt="" style="max-width:400px"></img>`);
                        }
                        if (!localStorage.Alertless) {
                            alert(guestupimgText); localStorage.setItem('Alertless', true);
                        }
                    } else if (data.status == false) { alert(data.message); } else { alert('发生未知错误，' + data); }
                })
                .fail(data => { alert(imguperrText + data); });
        } else if (authList.length == 3) {
            $.ajax({
                url: imgapi + 'upload', type: 'POST', dataType: 'json', data: formData, contentType: false, processData: false,
                //设置Header的token
                beforeSend: function (xhr) { xhr.setRequestHeader("Authorization", "Bearer " + authList[2]); }
            })
                .done(data => {
                    if (data.status == true) {
                        let inaridata = data.data, inarilinks = inaridata.links;
                        if (rhview == false && realedit == true) {
                            document.execCommand('insertImage', false, inarilinks.url);
                        }
                        else if (rhview == false && realedit == false) {
                            if (customize.markdown == false) { addCode(textArea, inarilinks.bbcode); }
                            else if (customize.markdown == true) { addCode(textArea, `![](${inarilinks.url})`); }
                        }
                        else if (rhview == false && realedit == true) {
                            addHCode(`<img src="${inarilinks.url}" border="0" alt="" style="max-width:400px"></img>`);
                        }
                    }
                    else if (data.status == false) { alert(data.message); } else { alert('发生未知错误，' + data); }
                })
                .fail(data => { alert(imguperrText + data); });
        }
    }
}
// 单个在线贴纸获取方法
function get1stfunc(e) {
    $.ajax({ url: customize.onlineraw + 'Get&id=' + e, type: 'POST', contentType: false, processData: false, })
        .done(data => {
            if (data.ret == 200) {
                let sigstk = data.data, thestkc = sigstk.content;
                FinalList.push(e); FinalRaw.push(JSON.parse(thestkc)); customize.olimglists = FinalList;
                localStorage.setItem('onlineraws', JSON.stringify(FinalRaw));
                localStorage.setItem('StickerConf', JSON.stringify(customize));
                sessionStorage.removeItem('OnlineSmile');
            }
            else { console.log(data.ret + '错误，' + data.msg); }
        })
        .fail(data => { console.log(data); });
}
// 数组去重
function qc(arr) {
    let s1 = new Set(arr); return Array.from(s1);
}
// 看板娘可拖拽,会记录拖拽位置
function drag(obj) {
    obj.onmousedown = function (event) {
        obj.setCapture && obj.setCapture(); event = event || window.event;
        let cleft = obj.style.left, ctop = obj.style.top, ol = event.clientX - obj.offsetLeft, ot = event.clientY - obj.offsetTop;
        document.onmousemove = function (event) {
            event = event || window.event; let left = event.clientX - ol, top = event.clientY - ot;
            obj.style.left = left + "px"; obj.style.top = top + "px";
        };
        document.onmouseup = function () {
            document.onmousemove = null; document.onmouseup = null;
            obj.releaseCapture && obj.releaseCapture(); let vleft = obj.style.left, vtop = obj.style.top;
            if (cleft == vleft && vtop == ctop) {
                let $textAreas = $("textarea");
                if (!$textAreas.length) return;
                if ($textAreas.length == 1) { $('.stickerpp-user-p').click(); }
                else { alert(kanbanerrText) }
            }
            else { localStorage.setItem('imgpvpc', JSON.stringify([vleft, vtop])); };
        }; return false;
    };
};


/**
 * 添加CSS
 */
const appendCss = function () {
    $('head').append(`
<style>
  .stickerpp-container { padding: 5px; vertical-align: middle; font: 12px/1.7em "sans-serif"; }
  .stickerpp-menu { margin-bottom: 5px; }
  .stickerpp-sub-menu { margin: 0 5px; text-decoration: none; border-bottom: 2px solid transparent; }
  .stickerpp-sub-menu:hover, .stickerpp-sub-menu:focus { text-decoration: none; border-color: deeppink; }
  a.stickerpp-sub-menu-active { color: black }
  .stickerpp-smile-panel { display: none; height: 136px; padding: 5px 3px; overflow-y: auto; border-top: 1px solid #ddd; }
  .stickerpp-smile-panel[data-key="Shortcut"] { height: auto; }
  .stickerpp-smile-panel[data-key="Markdown"] { height: auto; }
  .stickerpp-smile { display: inline-block; max-width: 60px; max-height: 60px; cursor: pointer; }
  .stickerpp-smile-text { display: inline-block; padding: 3px 5px; }
  .stickerpp-smile-text:hover { color: #fff !important; background-color: #2b2b2b; text-decoration: none; }
  .stickerpp-close-panel { cursor: pointer; }
  .stickerpp-zoom-in {
    position: absolute; max-width: 150px; max-height: 150px; background-color: #fcfcfc; border: 3px solid rgba(242, 242, 242, 0.6);
    border-radius: 2px; box-shadow: 0 0 3px rgb(102, 102, 102);
  }
  .stickerpp-shop_box sheader {height: 42px;background: rgb(49, 49, 49);display: block;font-size: 100%;margin: 0px;padding: 0px;color: rgb(115, 115, 115);font-family: "Helvetica Neue", Helvetica, arial, sans-serif;line-height: 1.231;}
  .stickerpp-shop_box sheader logo{float: left;margin: 25px 2px 0px 30px;font-size: 150%;padding: 0px;display: block;margin-block-start: 0.67em;margin-block-end: 0.67em;margin-inline-start: 0px;margin-inline-end: 0px;color:#fff;}
  .stickerpp-shop_box sheader span { float: right; margin: 25px 2px 0px 30px;font-size: 150%;padding: 0px;display: block;margin-block-start: 0.67em;margin-block-end: 0.67em;margin-inline-start: 0px;margin-inline-end: 0px;color:#fff;}
  .stickerpp-shop_nav { text-align: right; margin-top: 5px; margin-bottom: -5px; }
  .stickerpp-shop_main fieldset { border: 1px solid #ccccff; padding: 0 6px 6px; }
  .stickerpp-shop_main legend { font-weight: bold; }
  .StickerPP-list-content {display: block;margin-block-start: 0em;margin-block-end: 1em;margin-inline-start: 0px;margin-inline-end: 0px;padding-inline-start: 40px;list-style-type: disc;line-height: 20px;background-color: #fcfcfc}
  .sticker-item-img {text-align: center;}
  .stickerpp-shop_main input[type="color"] { height: 18px; width: 30px; padding: 0; }
  .stickerpp-shop_tips { color: #51d; text-decoration: none; cursor: help; }
  .stickerpp-shop_tips:hover { color: #ff0000; }
  #pdConfigDialog .stickerpp-shop_main { overflow-x: hidden; white-space: nowrap; }
  .stickerpp-shop_panel { display: inline-block; width: 400px; vertical-align: top; }
  .stickerpp-shop_panel + .stickerpp-shop_panel { margin-left: 5px; }
  .stickerpp-shop_btns { background-color: #fcfcfc; text-align: right; padding: 5px; }
  .stickerpp-shop_btns input, .stickerpp-shop_btns button { vertical-align: middle; }
  .stickerpp-shop_btns button { min-width: 64px; }
  .StickerPP-pagination-item-button {border-style: none;display: inline-block; text-align: center; margin: 5px;}
  .StickerPP-pagination-nowpage-button {    border: 1px solid #e5e5e5;color: #00b84f;min-width: 30px;display: inline-block; text-align: center; margin: 5px;}
  .StickerPP-pagination-prev-next {border-style: none;display: inline-block; text-align: center; margin: 5px;}
  .sticker-pages {background-color: #fcfcfc;padding: 8px 0 6px 10px;position: relative;color: #707072;font-size: 10px;margin: 0;text-align: center;display: inline-block;width: 100%; }
  .stickerpp-shop_footer {background-color: #f7f7fc;border-top: 1px solid #e6e6e6;padding: 8px 0 6px 10px;position: relative;color: #707072;font-size: 10px;margin: 0;}
  .stickerpp-shop_footer a{color: #707072;font-size: 10px;}
  .pd_custom_script_header { margin: 7px 0; padding: 5px; background-color: #e8e8e8; border-radius: 5px; }
  .pd_custom_script_content { display: none; width: 750px; height: 350px; white-space: pre; }
  .Heditm { border-style: none;display: inline-block; text-align: center;width: 26px;height: 20px;}
  .Heditms { border-style: none;display: inline-block; text-align: center;width: 26px;height: 20px;}
  .StickerPPHtmlEditer img {max-width:500px}
  </style>`);
    if (isKfMobile == false && isMobile == false) {
        $('head').append(`<style>
  .stickerpp-shop_box {
    position: fixed;display: none; z-index: 1002;
    -webkit-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); -moz-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);max-width: 1000px;
    left:0 !important;right:0 !important;margin:auto;}
  .stickerpp-shop_main { background-color: #fcfcfc; padding: 0 10px; font-size: 12px; line-height: 24px; height: 450px;max-height: 450px;}
  .sticker-item {    display: inline-block;margin: 0 60px 26px 0;vertical-align: top;width: 128px;}
  .sticker-item-name {    color: #737373;font-size: 12px;line-height: 1.2;max-height: 38.2px;text-align: center;word-break: break-word;-webkit-line-clamp: 2;-webkit-box-orient: vertical;display: -webkit-box;overflow: hidden;width: 120px}
</style>`);
    } else if (isKfMobile == true || isMobile == true) {
        $('head').append(`<style>
  #readPage .stickerpp-container, #writeMessagePage .stickerpp-container { margin-top: -10px; }
  .stickerpp-shop_box {
    position: fixed;display: none; z-index: 1002;
    -webkit-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); -moz-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);max-width: 400px;
    left:0 !important;right:0 !important;top:50px !important;margin:auto;}
  .stickerpp-shop_main { background-color: #fcfcfc; padding: 0 10px; font-size: 12px; line-height: 24px; height: 520px;max-height: 600px;}
  .sticker-item { display: inline-block;margin: 0 10px 22px 0;vertical-align: top;width: 72px;}
  .sticker-item-name {    color: #737373;font-size: 12px;line-height: 1.2;max-height: 38.2px;text-align: center;word-break: break-word;-webkit-line-clamp: 2;-webkit-box-orient: vertical;display: -webkit-box;overflow: hidden;width: 72px}
</style>`);
    }

};


/**
 * 初始化
 */
const init = function () {
    let $textAreas = $("textarea");
    if (!$textAreas.length) return;
    appendCss();
    $textAreas.each(function (i) { createContainer(this, i); });
};
if (loadcustom == false) {
    localStorage.setItem('imgpvpc', JSON.stringify(["5px", "100px"]));
    alert('首次使用，部署默认设置。您可以在【自定义】->【个性设置】中完成个性化设置！');
    customize.lcimglists = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    localStorage.setItem('StickerConf', JSON.stringify(customize));
    localStorage.removeItem('onlineraws'); localStorage.removeItem('Alertless'); sessionStorage.removeItem('localSmile'); sessionStorage.removeItem('OnlineSmile');
    alert('当前表情贴纸组为默认设置，您可以在【表情组设置->启用的本地表情组/表情组商店】中选择要启用的表情组！');
};
let rhview = false, $realtimeView;
if ($("iframe[id='e_iframe'],iframe[name='iframe']").length > 0) {
    $realtimeView = $("iframe[id*='iframe'],iframe[name='iframe']")[0].contentWindow.document, rhview = true;
}
init();

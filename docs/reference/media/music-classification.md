# 音乐文件分类与翻译方案

## 📊 统计信息

- **原始文件数**: 49 个（包含重复格式）
- **去重后文件数**: 25 个
- **删除文件数**: 24 个（重复的 ogg 文件）
- **分类数量**: 6 个

---

## 📂 分类详情

### 1. 主菜单音乐 (mainmenu) - 1 个

| 英文原名 | 中文翻译 | 格式 | 说明 |
|---------|---------|------|------|
| maintheme | 主菜单主题 | mp3 | 游戏主界面背景音乐 |

### 2. 战争音乐 (battle) - 5 个

| 英文原名 | 中文翻译 | 格式 | 说明 |
|---------|---------|------|------|
| battleoflepanto | 勒班陀之战 | mp3 | 著名海战背景音乐 |
| battleofbreitenfeld | 布莱滕菲尔德之战 | mp3 | 著名陆战背景音乐 |
| event_war_battleofbreitenfeld | 事件战争_布莱滕菲尔德之战 | ogg | 战争事件音乐 |
| war_offtowar | 战争_开战 | ogg | 战争开始音乐 |
| rideforthvictoriously | 凯旋进军 | mp3 | 战争胜利音乐 |

### 3. 时代音乐 (era) - 5 个

| 英文原名 | 中文翻译 | 格式 | 说明 |
|---------|---------|------|------|
| theageofdiscovery | 发现时代 | mp3 | 发现时代背景音乐 |
| mood_discovery | 发现时代_探索心情 | ogg | 探索时的氛围音乐 |
| discovery | 发现 | mp3 | 发现新地区音乐 |
| mood_landinsight | 陆地洞察心情 | ogg | 陆地探索氛围音乐 |
| landinsight | 陆地洞察 | mp3 | 陆地发现音乐 |

### 4. 事件音乐 (event) - 3 个

| 英文原名 | 中文翻译 | 格式 | 说明 |
|---------|---------|------|------|
| theendofanera_endcredits | 时代终结_片尾曲 | mp3 | 游戏结束/时代终结音乐 |
| moodevent_thesnowiscoming | 事件心情_积雪将至 | ogg | 冬季事件氛围音乐 |
| thesnowiscoming | 积雪将至 | mp3 | 冬季来临音乐 |

### 5. 场景音乐 (scene) - 6 个

| 英文原名 | 中文翻译 | 格式 | 说明 |
|---------|---------|------|------|
| instreets | 街头 | mp3 | 城市街头背景音乐 |
| nighttime | 夜晚 | mp3 | 夜间场景音乐 |
| openseas | 开阔海域 | mp3 | 海洋探索音乐 |
| thesoundofsummer | 夏日之声 | mp3 | 夏季氛围音乐 |
| kingsinthenorth | 北境诸王 | mp3 | 北方地区场景音乐 |

### 6. 宫廷音乐 (court) - 5 个

| 英文原名 | 中文翻译 | 格式 | 说明 |
|---------|---------|------|------|
| kingscourt | 国王宫廷 | ogg | 宫廷场景音乐 |
| mykingdom | 我的王国 | ogg | 王国管理音乐 |
| machiavelli | 马基雅维利 | ogg | 政治策略音乐 |
| dehominisdignitate | 人类尊严 | ogg | 宗教/哲学音乐 |
| thestonemasons | 石匠 | ogg | 建筑建造音乐 |

---

## 🔧 处理步骤

### 1. 删除重复文件

保留 mp3 格式，删除 ogg 重复文件：

**已删除的重复文件 (24个)**：
- rideforthvictoriously.ogg → 保留 mp3
- nighttime.ogg → 保留 mp3
- amongthepoor.ogg → 已无对应 mp3，需保留
- mood_landinsight.ogg → 保留 ogg（无 mp3 版本）
- theageofdiscovery.ogg → 保留 mp3
- eire.ogg → 需要单独处理（无 mp3 版本）
- theendofanera_endcredits.ogg → 保留 mp3
- dehominisdignitate.ogg → 保留 ogg（无 mp3 版本）
- thestonemasons.ogg → 保留 ogg（无 mp3 版本）
- kingscourt.ogg → 保留 ogg（无 mp3 版本）
- instreets.ogg → 保留 mp3
- openseas.ogg → 保留 mp3
- thesoundofsummer.ogg → 保留 mp3
- battleoflepanto.ogg → 保留 mp3
- thestageisset.ogg → 需要单独处理
- battleofbreitenfeld.ogg → 保留 mp3
- kingsinthenorth.ogg → 保留 mp3
- mood_discovery.ogg → 保留 ogg（无 mp3 版本）
- mykingdom.ogg → 保留 ogg（无 mp3 版本）
- thestageisset.ogg → 保留 mp3
- moodevent_thesnowiscoming.ogg → 保留 ogg（无 mp3 版本）
- war_offtowar.ogg → 保留 ogg（无 mp3 版本）
- maintheme.ogg → 保留 mp3
- commerceinthepeninsula.ogg → 保留 ogg（无 mp3 版本）
- machiavelli.ogg → 保留 ogg（无 mp3 版本）

### 2. 分类整理

创建子文件夹并移动文件：

```
music/
├── mainmenu/          # 主菜单音乐
│   └── 主菜单主题.mp3
├── battle/            # 战争音乐
│   ├── 勒班陀之战.mp3
│   ├── 布莱滕菲尔德之战.mp3
│   ├── 事件战争_布莱滕菲尔德之战.mp3
│   ├── 战争_开战.mp3
│   └── 凯旋进军.mp3
├── era/               # 时代音乐
│   ├── 发现时代.mp3
│   ├── 发现时代_探索心情.mp3
│   ├── 发现.mp3
│   ├── 陆地洞察心情.mp3
│   └── 陆地洞察.mp3
├── event/             # 事件音乐
│   ├── 时代终结_片尾曲.mp3
│   ├── 事件心情_积雪将至.mp3
│   └── 积雪将至.mp3
├── scene/             # 场景音乐
│   ├── 街头.mp3
│   ├── 夜晚.mp3
│   ├── 开阔海域.mp3
│   ├── 夏日之声.mp3
│   └── 北境诸王.mp3
├── court/             # 宫廷音乐
│   ├── 国王宫廷.mp3
│   ├── 我的王国.mp3
│   ├── 马基雅维利.mp3
│   ├── 人类尊严.mp3
│   └── 石匠.mp3
└── unused/            # 未使用音乐
    ├── 在穷人中.mp3
    ├── 爱尔兰.mp3
    ├── 舞台已备.mp3
    └── 半岛贸易.mp3
```

---

## 📝 需要处理的音乐文件

### 需要翻译的文件

1. `amongthepoor.mp3` → 在穷人中.mp3
2. `eire.mp3` → 爱尔兰.mp3
3. `thestageisset.mp3` → 舞台已备.mp3
4. `commerceinthepeninsula.mp3` → 半岛贸易.mp3

### 需要移动到子文件夹的文件

**mainmenu/**
- maintheme.mp3 → 主菜单主题.mp3

**battle/**
- battleoflepanto.mp3 → 勒班陀之战.mp3
- battleofbreitenfeld.mp3 → 布莱滕菲尔德之战.mp3
- event_war_battleofbreitenfeld.ogg → 事件战争_布莱滕菲尔德之战.mp3
- war_offtowar.ogg → 战争_开战.mp3
- rideforthvictoriously.mp3 → 凯旋进军.mp3
- commerceinthepeninsula.mp3 → 半岛贸易.mp3

**era/**
- theageofdiscovery.mp3 → 发现时代.mp3
- mood_discovery.ogg → 发现时代_探索心情.mp3
- discovery.mp3 → 发现.mp3
- mood_landinsight.ogg → 陆地洞察心情.mp3
- landinsight.mp3 → 陆地洞察.mp3

**event/**
- theendofanera_endcredits.mp3 → 时代终结_片尾曲.mp3
- moodevent_thesnowiscoming.ogg → 事件心情_积雪将至.mp3
- thesnowiscoming.mp3 → 积雪将至.mp3

**scene/**
- instreets.mp3 → 街头.mp3
- nighttime.mp3 → 夜晚.mp3
- openseas.mp3 → 开阔海域.mp3
- thesoundofsummer.mp3 → 夏日之声.mp3
- kingsinthenorth.mp3 → 北境诸王.mp3
- eire.mp3 → 爱尔兰.mp3

**court/**
- kingscourt.ogg → 国王宫廷.mp3
- mykingdom.ogg → 我的王国.mp3
- machiavelli.ogg → 马基雅维利.mp3
- dehominisdignitate.ogg → 人类尊严.mp3
- thestonemasons.ogg → 石匠.mp3

**unused/**
- amongthepoor.mp3 → 在穷人中.mp3
- thestageisset.mp3 → 舞台已备.mp3

---

## 🎯 最终文件列表

### 主菜单音乐 (1个)
- 主菜单主题.mp3

### 战争音乐 (6个)
- 勒班陀之战.mp3
- 布莱滕菲尔德之战.mp3
- 事件战争_布莱滕菲尔德之战.mp3
- 战争_开战.mp3
- 凯旋进军.mp3
- 半岛贸易.mp3

### 时代音乐 (5个)
- 发现时代.mp3
- 发现时代_探索心情.mp3
- 发现.mp3
- 陆地洞察心情.mp3
- 陆地洞察.mp3

### 事件音乐 (3个)
- 时代终结_片尾曲.mp3
- 事件心情_积雪将至.mp3
- 积雪将至.mp3

### 场景音乐 (6个)
- 街头.mp3
- 夜晚.mp3
- 开阔海域.mp3
- 夏日之声.mp3
- 北境诸王.mp3
- 爱尔兰.mp3

### 宫廷音乐 (5个)
- 国王宫廷.mp3
- 我的王国.mp3
- 马基雅维利.mp3
- 人类尊严.mp3
- 石匠.mp3

### 未使用音乐 (2个)
- 在穷人中.mp3
- 舞台已备.mp3

---

## ✅ 总计

- **总文件数**: 28 个（去重后）
- **分类数量**: 6 个（mainmenu、battle、era、event、scene、court、unused）
- **删除文件数**: 21 个（重复文件）

---

## 📌 注意事项

1. **格式保留**: mp3 和 ogg 格式都保留，根据实际可用性决定
2. **文件大小**: 部分文件可能较大，需要考虑存储空间
3. **使用频率**: 根据 songs.txt 中的触发条件决定使用频率
4. **音乐时长**: 不同音乐的时长可能不同，需要考虑循环播放

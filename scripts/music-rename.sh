#!/bin/bash

# 音乐文件重命名脚本 - 按照中文翻译

cd /workspace/projects/client/assets/audio/music

# 删除重复文件（保留 mp3，删除 ogg）
rm -f rideforthvictoriously.ogg
rm -f nighttime.ogg
rm -f amongthepoor.ogg
rm -f mood_landinsight.ogg
rm -f theageofdiscovery.ogg
rm -f eire.ogg
rm -f theendofanera_endcredits.ogg
rm -f dehominisdignitate.ogg
rm -f thestonemasons.ogg
rm -f kingscourt.ogg
rm -f instreets.ogg
rm -f openseas.ogg
rm -f thesoundofsummer.ogg
rm -f battleoflepanto.ogg
rm -f thestageisset.ogg
rm -f battleofbreitenfeld.ogg
rm -f kingsinthenorth.ogg
rm -f mood_discovery.ogg
rm -f mykingdom.ogg
rm -f thestageisset.ogg
rm -f theageofdiscovery.mp3
rm -f theendofanera_endcredits.mp3
rm -f kingscourt.mp3
rm -f kingsinthenorth.ogg
rm -f event_war_battleofbreitenfeld.ogg
rm -f moodevent_thesnowiscoming.ogg
rm -f war_offtowar.ogg
rm -f thesoundofsummer.ogg
rm -f maintheme.ogg
rm -f commerceinthepeninsula.ogg
rm -f machiavelli.ogg
rm -f instreets.mp3
rm -f mykingdom.mp3
rm -f machiavelli.mp3
rm -f commerceinthepeninsula.mp3

# 重命名主菜单音乐
mv maintheme.mp3 主菜单主题.mp3

# 重命名战争音乐
mv battleoflepanto.mp3 勒班陀之战.mp3
mv battleofbreitenfeld.mp3 布莱滕菲尔德之战.mp3
mv war_offtowar.mp3 战争_开战.mp3
mv rideforthvictoriously.mp3 凯旋进军.mp3
mv commerceinthepeninsula.mp3 半岛贸易.mp3

# 重命名时代音乐
mv theageofdiscovery.mp3 发现时代.mp3
mv mood_discovery.ogg 发现时代_探索心情.mp3
mv mood_landinsight.ogg 陆地洞察心情.mp3
mv discovery.mp3 发现.mp3
mv landinsight.mp3 陆地洞察.mp3
mv thesnowiscoming.mp3 积雪将至.mp3
mv moodevent_thesnowiscoming.ogg 事件心情_积雪将至.mp3

# 重命名事件音乐
mv theendofanera_endcredits.mp3 时代终结_片尾曲.mp3
mv event_war_battleofbreitenfeld.ogg 事件战争_布莱滕菲尔德之战.mp3

# 重命名场景音乐
mv instreets.mp3 街头.mp3
 nighttime.mp3 夜晚.mp3
mv openseas.mp3 开阔海域.mp3
mv openseas.ogg 开阔海域.ogg
mv thesoundofsummer.mp3 夏日之声.mp3
mv thesoundofsummer.ogg 夏日之声.ogg
mv kingsinthenorth.mp3 北境诸王.mp3

# 重命名宫廷音乐
mv kingscourt.ogg 国王宫廷.ogg
mv mykingdom.ogg 我的王国.ogg
mv machiavelli.ogg 马基雅维利.ogg
mv dehominisdignitate.ogg 人类尊严.ogg
mv thestonemasons.ogg 石匠.ogg

# 重命名戏剧音乐
mv thestageisset.mp3 舞台已备.mp3
mv thestageisset.ogg 舞台已备.ogg

echo "音乐文件重命名完成！"

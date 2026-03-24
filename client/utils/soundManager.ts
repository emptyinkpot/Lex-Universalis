import { Audio } from 'expo-av';

/**
 * 音效类型定义
 */
export type SoundCategory =
  | 'ui'
  | 'economy'
  | 'diplomatic'
  | 'voice'
  | 'battle'
  | 'ambient'
  | 'building'
  | 'event'
  | 'government'
  | 'interface'
  | 'military'
  | 'prestige'
  | 'religion'
  | 'tab'
  | 'technology'
  | 'trade'
  | 'unit'
  | 'music';

/**
 * UI 音效列表
 */
export const UI_SOUNDS = {
  BUTTON_CLICK: '通用按钮点击',
  OK_BUTTON_CLICK: '确认按钮点击',
  BACK_BUTTON_CLICK: '返回按钮点击',
  PAUSE: '暂停',
} as const;

/**
 * 经济音效列表
 */
export const ECONOMY_SOUNDS = {
  EARN_GOLD: '获得金币',
  LOSE_GOLD: '失去金币',
} as const;

/**
 * 外交音效列表
 */
export const DIPLOMATIC_SOUNDS = {
  PEACE_OFFER: '和平提议',
  PEACE_OFFER_LOW: '和平提议低',
  PEACE_OFFER_ACCEPTED: '和平提议接受',
  DECLARE_WAR: '宣战',
} as const;

/**
 * 语音/事件音效列表
 */
export const VOICE_SOUNDS = {
  START_GAME: '开始游戏',
  NEW_POPE_SELECTED: '新教皇当选',
  HRE_ELECTION: '神罗皇帝竞选',
  HEIR_GAINED: '继承人获得',
  HEIR_DIED: '继承人死亡',
  STABILITY_INCREASE: '稳定性上升',
  STABILITY_DECREASE: '稳定性下降',
  CHINESE_EMPIRE: '中华帝国界面',
  CHAT_MESSAGE: '聊天消息接收',
  MULTIPLAYER_WHISPER: '多人私聊',
} as const;

/**
 * 战斗音效列表
 */
export const BATTLE_SOUNDS = {
  CANNON_SHOT_1: '火炮射击01',
  CANNON_SHOT_2: '火炮射击02',
  MUSKET_SHOT_1: '滑膛枪射击01',
  MUSKET_SHOT_2: '滑膛枪射击02',
  MUSKET_SHOT_3: '滑膛枪射击03',
  MUSKET_SHOT_4: '滑膛枪射击04',
  SWORD_ATTACK_1: '剑击01',
  SWORD_ATTACK_2: '剑击02',
  SWORD_ATTACK_3: '剑击03',
  SWORD_ATTACK_4: '剑击04',
} as const;

/**
 * 建筑音效列表
 */
export const BUILDING_SOUNDS = {
  BUILDING_COMPLETE: '建筑完成',
  BUILD_ARMY: '建造军队',
  BUILD_BUILDING: '建造建筑',
  BUILD_NAVY: '建造海军',
  CONSTRUCTION_BEGIN: '开始建造',
  UNIT_PRODUCTION_BEGIN: '开始生产单位',
} as const;

/**
 * 事件音效列表
 */
export const EVENT_SOUNDS = {
  AGE_OF_ABSOLUTISM: '专制时代',
  AGE_OF_DISCOVERY: '发现时代',
  AGE_OF_REFORMATION: '宗教改革时代',
  AGE_OF_REVOLUTIONS: '革命时代',
  MISSION_COMPLETE: '任务完成',
  MISSION_FAIL: '任务失败',
  NEW_MONARCH: '新君主',
} as const;

/**
 * 军事音效列表
 */
export const MILITARY_SOUNDS = {
  RECRUIT_GENERAL: '招募将军',
  RECRUIT_ADMIRAL: '招募海军上将',
  RECRUIT_CONQUISTADOR: '招募征服者',
  RECRUIT_EXPLORER: '招募探险家',
  CALL_TO_ARMS: '收到战争号召',
  WAR_DECLARED: '收到宣战',
  SPY_SUCCESS: '间谍成功',
  SPY_FAILURE: '间谍失败',
} as const;

/**
 * 声望音效列表
 */
export const PRESTIGE_SOUNDS = {
  GAIN_PRESTIGE: '获得声望',
  LOSE_PRESTIGE: '失去声望',
} as const;

/**
 * 科技音效列表
 */
export const TECHNOLOGY_SOUNDS = {
  TECH_ADVANCE: '科技进步',
  PURCHASE_TECHNOLOGY: '购买新技术',
  BUY_IDEA: '购买新思想',
  DECIDE_IDEA_GROUP: '决定思想组',
} as const;

/**
 * 背景音乐列表
 */
export const MUSIC_SOUNDS = {
  MAIN_MENU: '主菜单',
  BATTLE: '战斗',
  VICTORY: '胜利',
  DEFEAT: '失败',
  PEACE: '和平',
  EXPLORATION: '探索',
} as const;

/**
 * 音效管理器配置
 */
interface SoundManagerConfig {
  volume?: number;
  playInBackground?: boolean;
}

/**
 * 音效管理器类
 */
class SoundManager {
  private config: {
    volume: number;
    playInBackground: boolean;
  };
  private loadedSounds: Map<string, Audio.Sound>;
  private isInitialized: boolean = false;

  constructor(config: SoundManagerConfig = {}) {
    this.config = {
      volume: config.volume ?? 1.0,
      playInBackground: config.playInBackground ?? false,
    };
    this.loadedSounds = new Map();
  }

  /**
   * 初始化音频系统
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: this.config.playInBackground,
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
      console.log('音效系统初始化成功');
    } catch (error) {
      console.error('音效系统初始化失败', error);
      throw error;
    }
  }

  /**
   * 播放音效
   * @param category 音效类别
   * @param soundName 音效名称（不带.wav后缀）
   * @param volume 音量（0.0 - 1.0），默认使用全局音量
   */
  async play(
    category: SoundCategory,
    soundName: string,
    volume?: number
  ): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const soundKey = `${category}/${soundName}`;
    let soundObject = this.loadedSounds.get(soundKey);

    try {
      // 如果音效未加载，则加载
      if (!soundObject) {
        soundObject = new Audio.Sound();
        await soundObject.loadAsync(
          require(`@/assets/audio/${category}/${soundName}.wav`)
        );
        this.loadedSounds.set(soundKey, soundObject);

        // 设置播放完成回调，自动释放资源
        soundObject.setOnPlaybackStatusUpdate((status: any) => {
          if (status.isLoaded && status.didJustFinish) {
            // 保留缓存的音效，不立即释放（提高重复播放性能）
            // 如果内存紧张，可以在这里调用 unloadAsync()
          }
        });
      }

      // 播放音效
      await soundObject.setStatusAsync({
        shouldPlay: true,
        volume: volume ?? this.config.volume,
      });

      console.log(`播放音效: ${soundKey}`);
    } catch (error) {
      console.error(`音效播放失败: ${soundKey}`, error);
      // 播放失败时，移除缓存
      if (soundObject) {
        this.loadedSounds.delete(soundKey);
        await soundObject.unloadAsync().catch(() => {});
      }
      throw error;
    }
  }

  /**
   * 停止指定音效
   * @param category 音效类别
   * @param soundName 音效名称
   */
  async stop(category: SoundCategory, soundName: string): Promise<void> {
    const soundKey = `${category}/${soundName}`;
    const soundObject = this.loadedSounds.get(soundKey);

    if (soundObject) {
      try {
        await soundObject.stopAsync();
      } catch (error) {
        console.error(`音效停止失败: ${soundKey}`, error);
      }
    }
  }

  /**
   * 停止所有音效
   */
  async stopAll(): Promise<void> {
    const stopPromises = Array.from(this.loadedSounds.values()).map(
      async (sound) => {
        try {
          await sound.stopAsync();
        } catch (error) {
          console.error('音效停止失败', error);
        }
      }
    );
    await Promise.all(stopPromises);
  }

  /**
   * 释放指定音效资源
   * @param category 音效类别
   * @param soundName 音效名称
   */
  async unload(category: SoundCategory, soundName: string): Promise<void> {
    const soundKey = `${category}/${soundName}`;
    const soundObject = this.loadedSounds.get(soundKey);

    if (soundObject) {
      try {
        await soundObject.unloadAsync();
        this.loadedSounds.delete(soundKey);
        console.log(`音效资源释放: ${soundKey}`);
      } catch (error) {
        console.error(`音效资源释放失败: ${soundKey}`, error);
      }
    }
  }

  /**
   * 释放所有音效资源
   */
  async unloadAll(): Promise<void> {
    const unloadPromises = Array.from(this.loadedSounds.values()).map(
      async (sound) => {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.error('音效资源释放失败', error);
        }
      }
    );
    await Promise.all(unloadPromises);
    this.loadedSounds.clear();
    console.log('所有音效资源已释放');
  }

  /**
   * 设置全局音量
   * @param volume 音量（0.0 - 1.0）
   */
  async setVolume(volume: number): Promise<void> {
    this.config.volume = Math.max(0, Math.min(1, volume));

    // 更新所有已加载音效的音量
    const setVolumePromises = Array.from(this.loadedSounds.values()).map(
      async (sound) => {
        try {
          await sound.setVolumeAsync(this.config.volume);
        } catch (error) {
          console.error('音效音量设置失败', error);
        }
      }
    );
    await Promise.all(setVolumePromises);
  }

  /**
   * 获取当前全局音量
   */
  getVolume(): number {
    return this.config.volume;
  }

  /**
   * 获取已加载的音效数量
   */
  getLoadedSoundsCount(): number {
    return this.loadedSounds.size;
  }
}

// 创建全局音效管理器实例
export const soundManager = new SoundManager();

/**
 * 便捷函数：播放音效
 * @param category 音效类别
 * @param soundName 音效名称
 * @param volume 音量（可选）
 */
export async function playSound(
  category: SoundCategory,
  soundName: string,
  volume?: number
): Promise<void> {
  return soundManager.play(category, soundName, volume);
}

/**
 * 便捷函数：播放 UI 音效
 */
export async function playUISound(soundName: string, volume?: number): Promise<void> {
  return playSound('ui', soundName, volume);
}

/**
 * 便捷函数：播放经济音效
 */
export async function playEconomySound(soundName: string, volume?: number): Promise<void> {
  return playSound('economy', soundName, volume);
}

/**
 * 便捷函数：播放外交音效
 */
export async function playDiplomaticSound(soundName: string, volume?: number): Promise<void> {
  return playSound('diplomatic', soundName, volume);
}

/**
 * 便捷函数：播放语音/事件音效
 */
export async function playVoiceSound(soundName: string, volume?: number): Promise<void> {
  return playSound('voice', soundName, volume);
}

/**
 * 便捷函数：播放战斗音效
 */
export async function playBattleSound(soundName: string, volume?: number): Promise<void> {
  return playSound('battle', soundName, volume);
}

/**
 * 便捷函数：播放建筑音效
 */
export async function playBuildingSound(soundName: string, volume?: number): Promise<void> {
  return playSound('building', soundName, volume);
}

/**
 * 便捷函数：播放事件音效
 */
export async function playEventSound(soundName: string, volume?: number): Promise<void> {
  return playSound('event', soundName, volume);
}

/**
 * 便捷函数：播放军事音效
 */
export async function playMilitarySound(soundName: string, volume?: number): Promise<void> {
  return playSound('military', soundName, volume);
}

/**
 * 便捷函数：播放环境音效
 */
export async function playAmbientSound(soundName: string, volume?: number): Promise<void> {
  return playSound('ambient', soundName, volume);
}

/**
 * 便捷函数：播放科技音效
 */
export async function playTechnologySound(soundName: string, volume?: number): Promise<void> {
  return playSound('technology', soundName, volume);
}

/**
 * 便捷函数：播放声望音效
 */
export async function playPrestigeSound(soundName: string, volume?: number): Promise<void> {
  return playSound('prestige', soundName, volume);
}

/**
 * 便捷函数：播放单位音效
 */
export async function playUnitSound(soundName: string, volume?: number): Promise<void> {
  return playSound('unit', soundName, volume);
}

/**
 * 便捷函数：播放界面音效
 */
export async function playInterfaceSound(soundName: string, volume?: number): Promise<void> {
  return playSound('interface', soundName, volume);
}

/**
 * 便捷函数：播放政府音效
 */
export async function playGovernmentSound(soundName: string, volume?: number): Promise<void> {
  return playSound('government', soundName, volume);
}

/**
 * 便捷函数：播放宗教音效
 */
export async function playReligionSound(soundName: string, volume?: number): Promise<void> {
  return playSound('religion', soundName, volume);
}

/**
 * 便捷函数：播放标签音效
 */
export async function playTabSound(soundName: string, volume?: number): Promise<void> {
  return playSound('tab', soundName, volume);
}

/**
 * 便捷函数：播放贸易音效
 */
export async function playTradeSound(soundName: string, volume?: number): Promise<void> {
  return playSound('trade', soundName, volume);
}

/**
 * 便捷函数：播放背景音乐
 */
export async function playMusicSound(soundName: string, volume?: number): Promise<void> {
  return playSound('music', soundName, volume);
}

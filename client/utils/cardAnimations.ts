/* eslint-disable react-hooks/immutability */
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

// 卡牌动画类型
export enum CardAnimationType {
  PLAY = 'play', // 打出
  DRAW = 'draw', // 抽牌
  HOVER = 'hover', // 悬停
  SELECT = 'select', // 选中
  ATTACK = 'attack', // 攻击
  DAMAGE = 'damage', // 受伤
  DEATH = 'death', // 死亡
  HIGHLIGHT = 'highlight', // 高亮
  FAN_LAYOUT = 'fan', // 扇形布局
}

// 扇形布局配置
export interface FanLayoutConfig {
  radius: number; // 扇形半径
  angleRange: number; // 扇形角度范围（度）
  cardSpacing: number; // 卡牌间距
  fanHeight: number; // 扇形高度偏移
  cardWidth: number; // 卡牌宽度
  cardHeight: number; // 卡牌高度
}

// 卡牌位置和旋转信息
export interface CardTransform {
  x: number;
  y: number;
  rotation: number; // 旋转角度（度）
  scale: number;
  zIndex: number;
}

// 计算扇形布局（严格按照月圆之夜Unity算法，并正确映射Unity坐标系到React Native）
export function calculateFanLayout(
  index: number,
  totalCards: number,
  config: FanLayoutConfig
): CardTransform {
  if (totalCards <= 1) {
    return {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: index,
    };
  }

  // ===== Unity坐标系与React Native坐标系差异 =====
  // Unity 3D：
  //   - X轴：右为正
  //   - Y轴：上为正
  //   - Z轴：前为正（朝向屏幕外）
  // React Native 2D：
  //   - X轴：右为正（相同）
  //   - Y轴：下为正（相反！）
  //   - 旋转：正值顺时针，负值逆时针
  // 
  // 映射关系：
  //   - Unity Y轴旋转 → React Native Z轴旋转（2D平面旋转）
  //   - Unity X轴 → React Native X轴（相同）
  //   - Unity Z轴（深度）→ React Native Y轴（但方向相反）
  //   - Unity Y轴（高度）→ React Native -Y轴（因为Y轴向下为正）
  
  // 1. 计算插值参数t (0到1)
  const t = index / Math.max(1, totalCards - 1);

  // 2. 应用卡牌间距调整
  const adjustedT = t * (1 - config.cardSpacing) + config.cardSpacing * 0.5;

  // 3. Unity角度转换：角度范围的一半转为弧度
  // 左边卡牌是负角度，右边卡牌是正角度
  const halfAngleDeg = config.angleRange / 2;
  const startAngleDeg = -halfAngleDeg;  // 起始角度（左，-30度）
  const endAngleDeg = halfAngleDeg;     // 结束角度（右，+30度）
  
  const startAngleRad = startAngleDeg * (Math.PI / 180);
  const endAngleRad = endAngleDeg * (Math.PI / 180);
  
  // 4. Unity的Vector3.Slerp在X-Z平面上
  // Unity: Vector3.forward = (0, 0, 1)
  // 旋转后：X = sin(angle), Z = cos(angle)
  const startDirectionX = Math.sin(startAngleRad);
  const startDirectionZ = Math.cos(startAngleRad);
  const endDirectionX = Math.sin(endAngleRad);
  const endDirectionZ = Math.cos(endAngleRad);
  
  // 球形线性插值（Vector3.Slerp）
  const theta = endAngleRad - startAngleRad;
  const sinTheta = Math.sin(theta);
  
  let x: number;
  let z: number;
  
  if (Math.abs(sinTheta) < 0.001) {
    // 角度很小时使用线性插值
    x = startDirectionX + adjustedT * (endDirectionX - startDirectionX);
    z = startDirectionZ + adjustedT * (endDirectionZ - startDirectionZ);
  } else {
    // 球形线性插值
    const weight1 = Math.sin((1 - adjustedT) * theta) / sinTheta;
    const weight2 = Math.sin(adjustedT * theta) / sinTheta;
    
    x = weight1 * startDirectionX + weight2 * endDirectionX;
    z = weight1 * startDirectionZ + weight2 * endDirectionZ;
  }
  
  // 5. 计算位置：中心点 + 方向 * 半径
  const posX = x * config.radius;
  const posZ = z * config.radius; // Unity Z轴（深度）

  // 6. 坐标系映射（扇形向上展开，物理位置反转，完全对称）
  // 圆心在容器底部中央
  // 扇形向上展开，0度角指向正上方
  //
  // 物理位置反转：index=0在右边，index=4在左边
  // 角度不变：左边负角度，右边正角度
  //
  // 移除线性倾斜，保持完全对称
  // X轴：-sin(angle) * radius（反转水平方向）
  // Y轴：-cos(angle) * radius（向上偏移，取反因为Y轴向下为正）

  const rnX = -posX; // 反转X轴，物理位置反转
  const rnY = -posZ; // -cos(angle) * radius，向上偏移

  // 移除线性倾斜，保持扇形完全对称
  // 向下移动整个扇形，让它位置更低
  const fanOffset = 150; // 向下移动50px
  const finalY = rnY + fanOffset; // 添加固定偏移，让扇形位置更低
  
  // 8. 计算旋转：卡牌面向中心点（Quaternion.LookRotation）
  // Unity: lookDirection = (fanCenter - position).normalized
  //      rotation.y = atan2(lookDirection.x, lookDirection.z)
  // 
  // 在2D中，面向中心点的角度：
  // Unity中：从位置看向原点(0,0,0)，方向是 (-posX, 0, -posZ)
  // 角度计算：atan2(x, z) 在Unity中表示Y轴旋转角度
  //
  // React Native中：
  // - atan2(y, x) 表示从X轴正方向到点的角度（弧度）
  // - 转换为角度：angle * 180 / Math.PI
  // - 注意：React Native的旋转正值是顺时针，Unity是逆时针
  
  const lookAngleRad = Math.atan2(posX, posZ); // atan2(x, z)
  let lookAngleDeg = lookAngleRad * (180 / Math.PI);
  
  // Unity的Y轴旋转 → React Native的旋转
  // Unity中正角度是逆时针，React Native中正角度是顺时针
  // 所以需要取反
  lookAngleDeg = -lookAngleDeg;
  
  // 9. 添加倾斜效果（Unity: rotation *= Quaternion.Euler(0, 0, tiltAngle)）
  // Unity的Z轴旋转 → React Native的Z轴旋转（但可能需要调整方向）
  const tiltAngle = -15 + adjustedT * 30; // 从-15度到+15度
  
  // 最终旋转 = 面向中心的角度 + 倾斜角度
  const rotation = lookAngleDeg + tiltAngle;
  
  // 10. z-index：从左到右递增
  const zIndex = index;

  // 调试输出（仅开发环境）
  if (__DEV__) {
    console.log(`[FanLayout] Card ${index}:`, {
      t,
      adjustedT,
      x: rnX.toFixed(2),
      y: finalY.toFixed(2),
      rotation: rotation.toFixed(2),
      zIndex,
    });
  }

  return {
    x: rnX,
    y: finalY,
    rotation,
    scale: 1,
    zIndex,
  };
}

// 卡牌动画控制器
export function useCardAnimation() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotationX = useSharedValue(0);
  const rotationY = useSharedValue(0);

  // 设置扇形布局动画
  const setFanLayout = (
    index: number,
    totalCards: number,
    config: FanLayoutConfig,
    duration: number = 400
  ) => {
    const transform = calculateFanLayout(index, totalCards, config);

    // 位置动画
    translateX.value = withTiming(transform.x, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withTiming(transform.y, {
      duration,
      easing: Easing.out(Easing.cubic),
    });

    // 旋转动画
    rotation.value = withTiming(transform.rotation, {
      duration,
      easing: Easing.out(Easing.cubic),
    });

    // 缩放动画
    scale.value = withTiming(transform.scale, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  };

  // 抽牌动画（模拟 Unity 的 DrawAnimation）
  const playDrawAnimation = (
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number },
    onComplete?: () => void,
    duration: number = 500
  ) => {
    // 阶段1：从牌堆弹出（放大）
    scale.value = withSpring(1.2, { damping: 12, stiffness: 200 });

    setTimeout(() => {
      // 阶段2：移动到抽卡位置
      translateX.value = withTiming(startPosition.x, {
        duration: duration * 0.4,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      });
      translateY.value = withTiming(startPosition.y, {
        duration: duration * 0.4,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      });

      setTimeout(() => {
        // 阶段3：翻转（模拟卡牌翻转）
        rotationY.value = withTiming(180, {
          duration: duration * 0.3,
          easing: Easing.sin,
        });

        setTimeout(() => {
          // 阶段4：移动到手牌位置
          translateX.value = withTiming(endPosition.x, {
            duration: duration * 0.4,
            easing: Easing.inOut(Easing.cubic),
          });
          translateY.value = withTiming(endPosition.y, {
            duration: duration * 0.4,
            easing: Easing.inOut(Easing.cubic),
          });

          // 同时翻转回来
          rotationY.value = withTiming(0, {
            duration: duration * 0.4,
            easing: Easing.sin,
          });

          // 恢复缩放
          scale.value = withSpring(1, { damping: 15, stiffness: 200 });

          if (onComplete) {
            setTimeout(() => {
              runOnJS(onComplete)();
            }, duration * 0.4);
          }
        }, duration * 0.3);
      }, duration * 0.4);
    }, 0);
  };

  // 悬停动画（模拟月圆之夜的 Hover）
  const playHoverAnimation = (
    isHovered: boolean,
    fanTransform: CardTransform | null = null,
    duration: number = 300,
    onZIndexChange?: (zIndex: number) => void // 回调通知 z-index 变化
  ) => {
    if (isHovered && fanTransform) {
      // 悬停时：上浮、放大、面向玩家
      const liftAmount = 40;
      translateX.value = withTiming(fanTransform.x, {
        duration,
        easing: Easing.out(Easing.quad),
      });
      translateY.value = withTiming(fanTransform.y - liftAmount, {
        duration,
        easing: Easing.out(Easing.quad),
      });
      scale.value = withSpring(1.2, { damping: 15, stiffness: 200 });
      rotation.value = withTiming(0, { // 面向玩家
        duration,
        easing: Easing.out(Easing.quad),
      });
      
      // 提升到最上层
      if (onZIndexChange) {
        onZIndexChange(999);
      }
    } else if (fanTransform) {
      // 恢复到扇形位置
      translateX.value = withTiming(fanTransform.x, {
        duration,
        easing: Easing.out(Easing.quad),
      });
      translateY.value = withTiming(fanTransform.y, {
        duration,
        easing: Easing.out(Easing.quad),
      });
      scale.value = withTiming(fanTransform.scale, {
        duration,
        easing: Easing.out(Easing.quad),
      });
      rotation.value = withTiming(fanTransform.rotation, {
        duration,
        easing: Easing.out(Easing.quad),
      });
      
      // 恢复原始 z-index
      if (onZIndexChange) {
        onZIndexChange(fanTransform.zIndex);
      }
    }
  };

  // 攻击动画（模拟 Unity 的 Attack）
  const playAttackAnimation = (
    targetPosition: { x: number; y: number },
    onComplete?: () => void,
    duration: number = 600
  ) => {
    // 阶段1：飞向目标
    translateX.value = withTiming(targetPosition.x, {
      duration,
      easing: Easing.in(Easing.cubic),
    });
    translateY.value = withTiming(targetPosition.y, {
      duration,
      easing: Easing.in(Easing.cubic),
    });

    // 旋转朝向目标
    const angle = Math.atan2(
      targetPosition.y - translateY.value,
      targetPosition.x - translateX.value
    );
    rotation.value = withTiming(angle * (180 / Math.PI), {
      duration,
      easing: Easing.out(Easing.quad),
    });

    // 缩放变化（接近目标时变小）
    scale.value = withTiming(0.6, {
      duration: duration * 0.8,
      easing: Easing.in(Easing.cubic),
    });

    // 阶段2：命中后回调
    if (onComplete) {
      setTimeout(() => {
        runOnJS(onComplete)();
      }, duration);
    }
  };

  // 受伤动画（模拟 Unity 的 Damage）
  const playDamageAnimation = (
    onComplete?: () => void,
    duration: number = 400
  ) => {
    // 震动效果
    translateX.value = withSpring(-15, { damping: 8, stiffness: 400 });
    translateY.value = withSpring(15, { damping: 8, stiffness: 400 });

    // 缩放抖动
    scale.value = withSpring(0.9, { damping: 8, stiffness: 400 });

    // 旋转抖动
    rotation.value = withTiming(-10, {
      duration: duration * 0.25,
      easing: Easing.out(Easing.quad),
    });

    setTimeout(() => {
      // 恢复
      translateX.value = withTiming(0, { duration: duration * 0.25 });
      translateY.value = withTiming(0, { duration: duration * 0.25 });
      scale.value = withSpring(1.05, { damping: 10, stiffness: 300 });
      rotation.value = withTiming(10, { duration: duration * 0.25 });

      setTimeout(() => {
        // 完全恢复
        scale.value = withSpring(1, { damping: 12, stiffness: 250 });
        rotation.value = withTiming(0, { duration: duration * 0.25 });

        if (onComplete) {
          runOnJS(onComplete)();
        }
      }, duration * 0.25);
    }, duration * 0.25);
  };

  // 死亡动画（模拟 Unity 的 Death）
  const playDeathAnimation = (
    onComplete?: () => void,
    duration: number = 600
  ) => {
    // 淡出
    opacity.value = withTiming(0, {
      duration,
      easing: Easing.in(Easing.cubic),
    });

    // 缩小
    scale.value = withTiming(0, {
      duration,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    });

    // 旋转
    rotation.value = withTiming(180, {
      duration,
      easing: Easing.in(Easing.cubic),
    });

    // 下沉
    translateY.value = withTiming(100, {
      duration,
      easing: Easing.in(Easing.cubic),
    });

    if (onComplete) {
      setTimeout(() => {
        runOnJS(onComplete)();
      }, duration);
    }
  };

  // 选中动画
  const playSelectAnimation = (
    isSelected: boolean,
    duration: number = 300
  ) => {
    if (isSelected) {
      translateY.value = withSpring(-10, { damping: 15, stiffness: 200 });
      scale.value = withSpring(1.05, { damping: 15, stiffness: 200 });
    } else {
      translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  };

  // 获取动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
        { rotateX: `${rotationX.value}deg` },
        { rotateY: `${rotationY.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  // 重置动画
  const reset = (duration: number = 300) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    opacity.value = withTiming(1, { duration });
    rotation.value = withTiming(0, { duration });
    translateX.value = withTiming(0, { duration });
    translateY.value = withTiming(0, { duration });
    rotationX.value = withTiming(0, { duration });
    rotationY.value = withTiming(0, { duration });
  };

  return {
    setFanLayout,
    playDrawAnimation,
    playHoverAnimation,
    playSelectAnimation,
    playAttackAnimation,
    playDamageAnimation,
    playDeathAnimation,
    reset,
    animatedStyle,
  };
}

// 贝塞尔曲线计算（用于平滑移动）
export function calculateBezierPoint(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): { x: number; y: number } {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;

  return {
    x: uu * p0.x + 2 * u * t * p1.x + tt * p2.x,
    y: uu * p0.y + 2 * u * t * p1.y + tt * p2.y,
  };
}

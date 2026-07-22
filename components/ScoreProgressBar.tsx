import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

/**
 * ScoreProgressBar
 * pro_box33.riv(Rive) 대체용 점수 진행 바.
 *
 * 원본 값 매핑:
 * - 너비         : 220px
 * - 높이         : 40px
 * - 값 범위      : 0~100 (score / maxScore * 100)
 * - 애니메이션   : 600ms, 0 → 목표 비율
 */

type ScoreProgressBarProps = {
  score: number;
  maxScore: number;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  duration?: number;
  style?: ViewStyle;
};

export default function ScoreProgressBar({
  score,
  maxScore,
  width = 220,
  height = 40,
  color = '#7cbd7e',
  backgroundColor = '#e0e0e0',
  duration = 600,
  style,
}: ScoreProgressBarProps) {
  const progress = useSharedValue(0);
  const target = Math.min(Math.max(score / Math.max(maxScore, 1), 0), 1);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(target, {
      duration,
      easing: Easing.out(Easing.ease),
    });
    return () => cancelAnimation(progress);
  }, [target, duration]);

  const fillStyle = useAnimatedStyle(() => ({
    width: progress.value * width,
  }));

  return (
    <View
      style={[
        styles.track,
        { width, height, backgroundColor, borderRadius: height / 2 },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { height, backgroundColor: color, borderRadius: height / 2 },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
  fill: {},
});

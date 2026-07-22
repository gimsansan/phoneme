/**
 * 음원 재생 버튼 — 파동 애니메이션 포함
 *
 * 터치 시 TTS 발화 + 동심원 파동 효과를 표시합니다.
 * 유니버설 디자인: 최소 터치 영역 72x72dp.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';

// ─── 타입 ───────────────────────────────────────────────────

interface SoundWaveButtonProps {
  /** 재생 중 여부 */
  isPlaying: boolean;
  /** 버튼 터치 콜백 */
  onPress: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 단계별 색상 */
  color?: string;
  /** 버튼 크기 */
  size?: number;
}

// ─── 파동 링 컴포넌트 ──────────────────────────────────────

function WaveRing({
  isPlaying,
  delay,
  color,
  size,
}: {
  isPlaying: boolean;
  delay: number;
  color: string;
  size: number;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 2.2,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.4,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
      opacityAnim.setValue(0.4);
      animation.start();
      return () => animation.stop();
    } else {
      scaleAnim.setValue(1);
      opacityAnim.setValue(0);
    }
  }, [isPlaying]);

  return (
    <Animated.View
      style={[
        styles.waveRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────

export default function SoundWaveButton({
  isPlaying,
  onPress,
  disabled = false,
  color = COLORS.hearingAccent,
  size = 88,
}: SoundWaveButtonProps) {
  const pressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 재생 중 부드러운 맥박 효과
  useEffect(() => {
    if (isPlaying) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      {/* 파동 링 3개 */}
      <WaveRing isPlaying={isPlaying} delay={0} color={color} size={size} />
      <WaveRing isPlaying={isPlaying} delay={400} color={color} size={size} />
      <WaveRing isPlaying={isPlaying} delay={800} color={color} size={size} />

      {/* 메인 버튼 */}
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityLabel={isPlaying ? '소리 재생 중' : '소리 재생'}
        accessibilityRole="button"
        style={styles.pressable}
      >
        <Animated.View
          style={[
            styles.button,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: disabled ? COLORS.hearingTextMuted : color,
              transform: [
                { scale: Animated.multiply(pressAnim, pulseAnim) },
              ],
            },
          ]}
        >
          <Ionicons
            name={isPlaying ? 'volume-high' : 'play'}
            size={size * 0.4}
            color="#FFFFFF"
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  pressable: {
    position: 'absolute',
    zIndex: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  waveRing: {
    position: 'absolute',
    borderWidth: 2.5,
  },
});

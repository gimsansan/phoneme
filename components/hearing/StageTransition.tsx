/**
 * 단계 전환 카드 — 다음 단계 소개 + 격려 메시지
 *
 * 단계 사이 페이드 인 오버레이로 표시됩니다.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { STAGE_META, type TestStage } from '../../constants/hearingTestWords';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── 타입 ───────────────────────────────────────────────────

interface StageTransitionProps {
  /** 전환할 단계 */
  stage: TestStage;
  /** "시작하기" 버튼 콜백 */
  onStart: () => void;
}

// ─── 단계별 색상 맵 ─────────────────────────────────────────

const STAGE_COLORS: Record<TestStage, string> = {
  1: COLORS.hearingStage1,
  2: COLORS.hearingStage2,
  3: COLORS.hearingStage3,
};

const STAGE_BG_COLORS: Record<TestStage, string> = {
  1: COLORS.hearingStage1Light,
  2: COLORS.hearingStage2Light,
  3: COLORS.hearingStage3Light,
};

// ─── 컴포넌트 ───────────────────────────────────────────────

export default function StageTransition({
  stage,
  onStart,
}: StageTransitionProps) {
  const meta = STAGE_META[stage];
  const stageColor = STAGE_COLORS[stage];
  const bgColor = STAGE_BG_COLORS[stage];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [stage]);

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // 페이드 아웃 후 콜백
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onStart();
    });
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: bgColor,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* 단계 뱃지 */}
        <View style={[styles.badge, { backgroundColor: stageColor }]}>
          <Text style={styles.badgeText}>{stage}단계</Text>
        </View>

        {/* 이모지 */}
        <Text style={styles.emoji}>{meta.emoji}</Text>

        {/* 제목 */}
        <Text style={[styles.title, { color: stageColor }]}>{meta.title}</Text>
        <Text style={styles.subtitle}>{meta.subtitle}</Text>

        {/* 설명 */}
        <Text style={styles.description}>{meta.description}</Text>

        {/* 주파수 정보 */}
        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <Text style={styles.infoLabel}>타겟 주파수</Text>
            <Text style={[styles.infoValue, { color: stageColor }]}>
              {meta.targetHz}
            </Text>
          </View>
          <View style={styles.infoChip}>
            <Text style={styles.infoLabel}>문항 수</Text>
            <Text style={[styles.infoValue, { color: stageColor }]}>
              {meta.questionCount}문제
            </Text>
          </View>
        </View>

        {/* 시작 버튼 */}
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            { backgroundColor: stageColor },
            pressed && styles.startButtonPressed,
          ]}
          onPress={handleStart}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.hearingOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    paddingHorizontal: 24,
  },
  card: {
    width: SCREEN_WIDTH - 48,
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.hearingTextMuted,
    fontWeight: '500',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: COLORS.hearingTextBody,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoChip: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.hearingTextMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  startButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 3,
  },
  startButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

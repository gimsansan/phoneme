/**
 * 결과 프로필 카드 — 감성 네이밍 + 글래스모피즘 스타일
 *
 * 테스트 결과의 감성 프로필을 시각적으로 표현합니다.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import type { HearingProfile } from '../../constants/hearingProfiles';

// ─── 타입 ───────────────────────────────────────────────────

interface ProfileCardProps {
  /** 매칭된 프로필 */
  profile: HearingProfile;
  /** 전체 정답률 */
  overallPercentage: number;
  /** 애니메이션 여부 */
  animated?: boolean;
}

// ─── 컴포넌트 ───────────────────────────────────────────────

export default function ProfileCard({
  profile,
  overallPercentage,
  animated = true,
}: ProfileCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    }
  }, [animated]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* 배경 그라데이션 효과 (글래스모피즘) */}
      <View
        style={[
          styles.glassOverlay,
          { backgroundColor: profile.color + '15' },
        ]}
      />

      {/* 이모지 */}
      <Text style={styles.emoji}>{profile.emoji}</Text>

      {/* 프로필 이름 */}
      <Text style={[styles.name, { color: profile.color }]}>
        {profile.name}
      </Text>

      {/* 정답률 뱃지 */}
      <View style={[styles.percentBadge, { backgroundColor: profile.color + '20' }]}>
        <Text style={[styles.percentText, { color: profile.color }]}>
          전체 정답률 {overallPercentage}%
        </Text>
      </View>

      {/* 설명 */}
      <Text style={styles.description}>{profile.description}</Text>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 권유형 피드백 */}
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationIcon}>💡</Text>
        <Text style={styles.recommendationText}>{profile.recommendation}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    // 글래스모피즘 그림자
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    // 테두리
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  emoji: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  percentBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  percentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
  },
  recommendationIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 1,
  },
  recommendationText: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    lineHeight: 24,
  },
});

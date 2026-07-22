/**
 * 면책 조항 배너 — 접이식 디자인
 *
 * "본 서비스는 의료적 진단을 대신하지 않습니다" 면책 표시.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// Android LayoutAnimation 활성화 (New Architecture에서는 no-op 경고 발생하여 제거)
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// ─── 타입 ───────────────────────────────────────────────────

interface DisclaimerBannerProps {
  /** 컴팩트 모드 (접은 상태로 시작) */
  compact?: boolean;
}

// ─── 면책 텍스트 ────────────────────────────────────────────

const DISCLAIMER_TITLE = '📋 안내 사항';
const DISCLAIMER_TEXT =
  '본 서비스는 청능 훈련 참고용이며, 의료적 진단을 대신할 수 없습니다. ' +
  '정확한 청력 평가 및 치료를 위해서는 반드시 이비인후과 전문의와 상담하시기 바랍니다.';

// ─── 컴포넌트 ───────────────────────────────────────────────

export default function DisclaimerBanner({
  compact = true,
}: DisclaimerBannerProps) {
  const [expanded, setExpanded] = useState(!compact);
  const rotateAnim = useRef(new Animated.Value(compact ? 0 : 1)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);

    Animated.timing(rotateAnim, {
      toValue: nextExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.header}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel="면책 조항 보기"
      >
        <View style={styles.headerLeft}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={COLORS.hearingTextMuted}
          />
          <Text style={styles.headerText}>{DISCLAIMER_TITLE}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons
            name="chevron-down"
            size={18}
            color={COLORS.hearingTextMuted}
          />
        </Animated.View>
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          <Text style={styles.bodyText}>{DISCLAIMER_TEXT}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.hearingBorder,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.hearingTextMuted,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 0,
  },
  bodyText: {
    fontSize: 13,
    color: COLORS.hearingTextMuted,
    lineHeight: 20,
  },
});

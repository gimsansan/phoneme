/**
 * 청능 훈련 홈 화면
 *
 * 서비스 소개, CTA 버튼, 이전 결과 요약, 면책 조항을 표시합니다.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../../constants/colors';
import { STAGE_META, TOTAL_QUESTIONS } from '../../../constants/hearingTestWords';
import { useHearingTest } from '../../../context/HearingTestContext';
import { useHearingTestStorage } from '../../../hooks/useHearingTestStorage';
import DisclaimerBanner from '../../../components/hearing/DisclaimerBanner';

// ─── 단계 프리뷰 카드 ──────────────────────────────────────

function StagePreviewCard({
  stage,
  color,
}: {
  stage: 1 | 2 | 3;
  color: string;
}) {
  const meta = STAGE_META[stage];
  return (
    <View style={[styles.stageCard, { borderLeftColor: color }]}>
      <View style={styles.stageCardHeader}>
        <Text style={styles.stageEmoji}>{meta.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.stageTitle, { color }]}>
            {stage}단계 · {meta.title}
          </Text>
          <Text style={styles.stageDesc}>{meta.questionCount}문항 · {meta.speakerLabel}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── 이전 결과 요약 카드 ────────────────────────────────────

function LatestResultCard({
  profile,
  percentage,
  date,
}: {
  profile: { name: string; emoji: string; color: string };
  percentage: number;
  date: string;
}) {
  const dateStr = new Date(date).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Ionicons name="time-outline" size={16} color={COLORS.hearingTextMuted} />
        <Text style={styles.resultDate}>최근 결과 · {dateStr}</Text>
      </View>
      <View style={styles.resultBody}>
        <Text style={styles.resultEmoji}>{profile.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.resultName, { color: profile.color }]}>
            {profile.name}
          </Text>
          <Text style={styles.resultPercent}>정답률 {percentage}%</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.hearingTextMuted}
        />
      </View>
    </View>
  );
}

// ─── 메인 화면 ──────────────────────────────────────────────

export default function HearingHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { startTest } = useHearingTest();
  const { latestResult } = useHearingTestStorage();

  const handleStartTest = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startTest();
    router.push('/(tabs)/sound_grt/hearing-test' as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>👂</Text>
          <Text style={styles.headerTitle}>청능 훈련</Text>
          <Text style={styles.headerSubtitle}>
            한국어 음소 데이터 기반{'\n'}맞춤형 청취 프로필 분석
          </Text>
        </View>

        {/* 테스트 소개 */}
        <View style={styles.introSection}>
          <Text style={styles.sectionTitle}>3단계 청능 테스트</Text>
          <Text style={styles.introText}>
            총 {TOTAL_QUESTIONS}문항의 간단한 테스트로{'\n'}
            나의 청취 프로필을 확인해보세요.
          </Text>

          {/* 단계 프리뷰 */}
          <StagePreviewCard stage={1} color={COLORS.hearingStage1} />
          <StagePreviewCard stage={2} color={COLORS.hearingStage2} />
          <StagePreviewCard stage={3} color={COLORS.hearingStage3} />
        </View>

        {/* 이전 결과 */}
        {latestResult && (
          <View style={styles.section}>
            <LatestResultCard
              profile={latestResult.result.profile}
              percentage={latestResult.result.overallPercentage}
              date={latestResult.savedAt}
            />
          </View>
        )}

        {/* CTA 버튼 */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
          onPress={handleStartTest}
        >
          <Ionicons name="headset-outline" size={24} color="#FFFFFF" />
          <Text style={styles.ctaText}>청능 테스트 시작하기</Text>
        </Pressable>

        {/* 소요 시간 안내 */}
        <Text style={styles.timeHint}>
          ⏱ 약 3~5분 소요 · 조용한 환경에서 이어폰 착용을 권장합니다
        </Text>

        {/* TTS 사운드 디버그 버튼 (임시) */}
        <Pressable
          style={{ paddingVertical: 12, alignItems: 'center' }}
          onPress={() => router.push('/tts-test' as any)}
        >
          <Text style={{ color: COLORS.hearingTextMuted, fontSize: 14, textDecorationLine: 'underline' }}>
            🛠 소리가 안 나시나요? TTS 테스트 화면 가기
          </Text>
        </Pressable>

        {/* 면책 조항 */}
        <View style={styles.disclaimerWrap}>
          <DisclaimerBanner compact />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.hearingBg,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // 헤더
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.hearingTextTitle,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.hearingTextBody,
    textAlign: 'center',
    lineHeight: 24,
  },

  // 소개 섹션
  introSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.hearingTextTitle,
    marginBottom: 6,
  },
  introText: {
    fontSize: 15,
    color: COLORS.hearingTextBody,
    lineHeight: 22,
    marginBottom: 16,
  },

  // 단계 카드
  stageCard: {
    backgroundColor: COLORS.hearingCardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  stageCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stageEmoji: {
    fontSize: 28,
  },
  stageTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  stageDesc: {
    fontSize: 13,
    color: COLORS.hearingTextMuted,
    marginTop: 2,
  },

  // 이전 결과
  section: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  resultCard: {
    backgroundColor: COLORS.hearingCardBg,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  resultDate: {
    fontSize: 12,
    color: COLORS.hearingTextMuted,
  },
  resultBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultEmoji: {
    fontSize: 36,
  },
  resultName: {
    fontSize: 17,
    fontWeight: '700',
  },
  resultPercent: {
    fontSize: 13,
    color: COLORS.hearingTextMuted,
    marginTop: 2,
  },

  // CTA
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.hearingAccent,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 18,
    borderRadius: 18,
    elevation: 4,
    shadowColor: COLORS.hearingAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ctaButtonPressed: {
    backgroundColor: COLORS.hearingAccentDark,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // 시간 힌트
  timeHint: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.hearingTextMuted,
    marginTop: 14,
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  // 면책 조항
  disclaimerWrap: {
    marginTop: 4,
  },
});

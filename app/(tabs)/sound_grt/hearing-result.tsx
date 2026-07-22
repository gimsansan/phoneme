/**
 * 청능 테스트 결과 리포트 화면
 *
 * 감성 프로필 카드 + 방사형 차트 + 단계별 점수 + 권유형 피드백
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../../constants/colors';
import { STAGE_META, type TestStage } from '../../../constants/hearingTestWords';
import { useHearingTest } from '../../../context/HearingTestContext';
import { useHearingTestStorage } from '../../../hooks/useHearingTestStorage';
import RadarChart from '../../../components/hearing/RadarChart';
import ProfileCard from '../../../components/hearing/ProfileCard';
import DisclaimerBanner from '../../../components/hearing/DisclaimerBanner';

// ─── 단계별 색상 ────────────────────────────────────────────

const STAGE_COLORS: Record<TestStage, string> = {
  1: COLORS.hearingStage1,
  2: COLORS.hearingStage2,
  3: COLORS.hearingStage3,
};

// ─── 단계별 점수 행 ─────────────────────────────────────────

function StageScoreRow({
  stage,
  correct,
  total,
  percentage,
}: {
  stage: TestStage;
  correct: number;
  total: number;
  percentage: number;
}) {
  const meta = STAGE_META[stage];
  const color = STAGE_COLORS[stage];

  return (
    <View style={scoreStyles.row}>
      <View style={scoreStyles.left}>
        <View style={[scoreStyles.dot, { backgroundColor: color }]} />
        <View>
          <Text style={scoreStyles.title}>
            {stage}단계 · {meta.title}
          </Text>
          <Text style={scoreStyles.sub}>
            {meta.targetHz}
          </Text>
        </View>
      </View>
      <View style={scoreStyles.right}>
        <Text style={[scoreStyles.percent, { color }]}>{percentage}%</Text>
        <Text style={scoreStyles.fraction}>
          {correct}/{total}
        </Text>
      </View>
    </View>
  );
}

const scoreStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.hearingTextTitle,
  },
  sub: {
    fontSize: 12,
    color: COLORS.hearingTextMuted,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  percent: {
    fontSize: 20,
    fontWeight: '800',
  },
  fraction: {
    fontSize: 12,
    color: COLORS.hearingTextMuted,
    marginTop: 1,
  },
});

// ─── 메인 화면 ──────────────────────────────────────────────

export default function HearingResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, resetTest, startTest } = useHearingTest();
  const { saveResult } = useHearingTestStorage();

  const { result } = state;

  // 결과 자동 저장
  useEffect(() => {
    if (result) {
      saveResult(result);
    }
  }, [result]);

  if (!result) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.emptyText}>결과를 불러오는 중...</Text>
      </View>
    );
  }

  const { profile, bandScores, stageScores, overallPercentage } = result;

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetTest();
    startTest();
    router.replace('/(tabs)/sound_grt/hearing-test' as any);
  };

  const handleGoHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetTest();
    router.replace('/(tabs)/sound_grt' as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>나의 청취 프로필</Text>
          <Text style={styles.headerSubtitle}>
            테스트 결과를 분석했어요
          </Text>
        </View>

        {/* 프로필 카드 */}
        <ProfileCard
          profile={profile}
          overallPercentage={overallPercentage}
        />

        {/* 방사형 차트 */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>주파수 대역별 분석</Text>
          <View style={styles.chartContainer}>
            <RadarChart
              data={bandScores}
              fillColorStart={profile.color}
              fillColorEnd={profile.colorEnd}
            />
          </View>
        </View>

        {/* 단계별 상세 점수 */}
        <View style={styles.scoreSection}>
          <Text style={styles.sectionTitle}>단계별 상세 결과</Text>
          <View style={styles.scoreCard}>
            <StageScoreRow
              stage={1}
              correct={stageScores[1].correct}
              total={stageScores[1].total}
              percentage={stageScores[1].percentage}
            />
            <StageScoreRow
              stage={2}
              correct={stageScores[2].correct}
              total={stageScores[2].total}
              percentage={stageScores[2].percentage}
            />
            <StageScoreRow
              stage={3}
              correct={stageScores[3].correct}
              total={stageScores[3].total}
              percentage={stageScores[3].percentage}
            />
          </View>
        </View>

        {/* 액션 버튼 */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: profile.color },
              pressed && styles.buttonPressed,
            ]}
            onPress={handleRetry}
          >
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryText}>다시 테스트하기</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.homeButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleGoHome}
          >
            <Ionicons name="home-outline" size={20} color={COLORS.hearingTextBody} />
            <Text style={styles.homeText}>홈으로</Text>
          </Pressable>
        </View>

        {/* 면책 조항 */}
        <View style={styles.disclaimerWrap}>
          <DisclaimerBanner compact={false} />
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.hearingTextMuted,
    marginTop: 100,
  },

  // 헤더
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.hearingTextTitle,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.hearingTextBody,
  },

  // 차트
  chartSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.hearingTextTitle,
    marginBottom: 12,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.hearingCardBg,
    borderRadius: 20,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  // 점수
  scoreSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  scoreCard: {
    backgroundColor: COLORS.hearingCardBg,
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  // 액션 버튼
  actions: {
    marginTop: 28,
    paddingHorizontal: 20,
    gap: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 3,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.hearingCardBg,
    borderWidth: 1,
    borderColor: COLORS.hearingBorder,
  },
  homeText: {
    color: COLORS.hearingTextBody,
    fontSize: 17,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  // 면책
  disclaimerWrap: {
    marginTop: 24,
  },
});

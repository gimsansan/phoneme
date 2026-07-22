/**
 * 3단계 청능 테스트 실행 화면
 *
 * 단계별 문제 출제 → 음원 재생 → 4지선다 선택 → 피드백 → 다음 문제
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../../constants/colors';
import { STAGE_META, TOTAL_QUESTIONS, type TestStage } from '../../../constants/hearingTestWords';
import { useHearingTest } from '../../../context/HearingTestContext';
import { speakWord, stopSpeaking } from '../../../services/speechService';
import type { TestAnswer } from '../../../services/hearingTestEngine';
import SoundWaveButton from '../../../components/hearing/SoundWaveButton';
import StageTransition from '../../../components/hearing/StageTransition';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── 단계별 색상 ────────────────────────────────────────────

const STAGE_COLORS: Record<TestStage, string> = {
  1: COLORS.hearingStage1,
  2: COLORS.hearingStage2,
  3: COLORS.hearingStage3,
};

const STAGE_BG: Record<TestStage, string> = {
  1: COLORS.hearingStage1Light,
  2: COLORS.hearingStage2Light,
  3: COLORS.hearingStage3Light,
};

// ─── 진행률 바 ──────────────────────────────────────────────

function ProgressBar({
  current,
  total,
  color,
}: {
  current: number;
  total: number;
  color: string;
}) {
  const progress = total > 0 ? current / total : 0;

  return (
    <View style={progressStyles.container}>
      <View style={progressStyles.track}>
        <View
          style={[
            progressStyles.fill,
            { width: `${progress * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={progressStyles.text}>
        {current} / {total}
      </Text>
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.hearingTextMuted,
    minWidth: 42,
    textAlign: 'right',
  },
});

// ─── 선택지 버튼 ────────────────────────────────────────────

function ChoiceButton({
  word,
  onPress,
  disabled,
  isCorrect,
  isSelected,
  stageColor,
}: {
  word: string;
  onPress: () => void;
  disabled: boolean;
  isCorrect: boolean | null;
  isSelected: boolean;
  stageColor: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  let bgColor: string = COLORS.hearingCardBg;
  let borderColor: string = COLORS.hearingBorder;
  let textColor: string = COLORS.hearingTextTitle;

  if (isSelected && isCorrect === true) {
    bgColor = COLORS.hearingCorrectBg;
    borderColor = COLORS.hearingCorrect;
    textColor = COLORS.hearingCorrect;
  } else if (isSelected && isCorrect === false) {
    bgColor = COLORS.hearingWrongBg;
    borderColor = COLORS.hearingWrong;
    textColor = COLORS.hearingWrong;
  } else if (isCorrect === true && !isSelected) {
    // 오답 선택 시 정답 표시
    bgColor = COLORS.hearingCorrectBg;
    borderColor = COLORS.hearingCorrect;
    textColor = COLORS.hearingCorrect;
  }

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[
          choiceStyles.button,
          { backgroundColor: bgColor, borderColor },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityLabel={`선택지: ${word}`}
        accessibilityRole="button"
      >
        <Text style={[choiceStyles.text, { color: textColor }]}>{word}</Text>
        {isSelected && isCorrect === true && (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.hearingCorrect} />
        )}
        {isSelected && isCorrect === false && (
          <Ionicons name="close-circle" size={24} color={COLORS.hearingWrong} />
        )}
      </Pressable>
    </Animated.View>
  );
}

const choiceStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    minHeight: 64,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  text: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

// ─── 메인 화면 ──────────────────────────────────────────────

export default function HearingTestScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    state,
    answerQuestion,
    nextQuestion,
    dismissStageTransition,
    resetTest,
    setAudioPlaying,
  } = useHearingTest();

  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const {
    currentStage,
    currentQuestionIndex,
    questions,
    isAudioPlaying,
    hasAnswered,
    showStageTransition,
    isTestComplete,
  } = state;

  const currentQuestion = questions[currentQuestionIndex];
  const stageColor = STAGE_COLORS[currentStage];
  const stageBg = STAGE_BG[currentStage];
  const stageMeta = STAGE_META[currentStage];

  // 테스트 완료 시 결과 화면으로 이동
  useEffect(() => {
    if (isTestComplete) {
      router.replace('/(tabs)/sound_grt/hearing-result' as any);
    }
  }, [isTestComplete]);

  // 새 문제 시작 시 타이머 리셋
  useEffect(() => {
    setQuestionStartTime(Date.now());
    setSelectedWordId(null);
    setShowCorrectAnswer(false);
    fadeAnim.setValue(1);
  }, [currentQuestionIndex]);

  // ─── 음원 재생 ──────────────────────────────────────────

  const handlePlaySound = useCallback(async () => {
    if (!currentQuestion || isAudioPlaying) {
      console.log('⚠️ [버튼 무시] 재생 중이거나 문제가 없음');
      return;
    }

    console.log(`👉 [버튼 터치] 문제 ID: ${currentQuestion.id}, 정답: ${currentQuestion.correctWord.word}`);
    setAudioPlaying(true);
    try {
      await speakWord(
        currentQuestion.correctWord.word,
        currentQuestion.correctWord.speakerGender,
      );
    } catch (error) {
      console.error('TTS 재생 오류:', error);
    } finally {
      setAudioPlaying(false);
    }
  }, [currentQuestion, isAudioPlaying]);

  // ─── 답변 선택 ──────────────────────────────────────────

  const handleSelectChoice = useCallback(
    (wordId: string) => {
      if (hasAnswered || !currentQuestion) return;

      const selectedWord = currentQuestion.choices.find((c) => c.id === wordId);
      if (!selectedWord) return;

      const isCorrect = wordId === currentQuestion.correctWord.id;
      setSelectedWordId(wordId);
      setShowCorrectAnswer(true);

      // 햅틱 피드백
      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      stopSpeaking();

      const answer: TestAnswer = {
        questionId: currentQuestion.id,
        correctWordId: currentQuestion.correctWord.id,
        selectedWordId: wordId,
        isCorrect,
        responseTimeMs: Date.now() - questionStartTime,
        stage: currentQuestion.stage,
      };

      answerQuestion(answer);

      // 1.2초 후 다음 문제로
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          nextQuestion();
          fadeAnim.setValue(1);
        });
      }, 1200);
    },
    [hasAnswered, currentQuestion, questionStartTime],
  );

  // ─── 나가기 확인 ────────────────────────────────────────

  const handleExit = () => {
    Alert.alert(
      '테스트 종료',
      '테스트를 중단하시겠습니까?\n현재까지의 결과는 저장되지 않습니다.',
      [
        { text: '계속하기', style: 'cancel' },
        {
          text: '종료',
          style: 'destructive',
          onPress: () => {
            stopSpeaking();
            resetTest();
            router.back();
          },
        },
      ],
    );
  };

  if (!currentQuestion) return null;

  // 현재 단계 내 문제 번호 계산
  const stageQuestions = questions.filter((q) => q.stage === currentStage);
  const stageQuestionIndex =
    stageQuestions.findIndex((q) => q.id === currentQuestion.id) + 1;

  return (
    <View style={[styles.container, { backgroundColor: stageBg, paddingTop: insets.top }]}>
      {/* 상단 바 */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.exitButton}
          onPress={handleExit}
          accessibilityLabel="테스트 종료"
        >
          <Ionicons name="close" size={24} color={COLORS.hearingTextMuted} />
        </Pressable>

        <View style={styles.stageBadge}>
          <View style={[styles.stageDot, { backgroundColor: stageColor }]} />
          <Text style={[styles.stageLabel, { color: stageColor }]}>
            {currentStage}단계 · {stageMeta.title}
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* 진행률 */}
      <ProgressBar
        current={currentQuestionIndex + 1}
        total={questions.length}
        color={stageColor}
      />

      {/* 문제 영역 */}
      <Animated.View style={[styles.questionArea, { opacity: fadeAnim }]}>
        {/* 안내 텍스트 */}
        <Text style={styles.instruction}>
          소리를 듣고 맞는 단어를 골라주세요
        </Text>

        {/* 재생 버튼 */}
        <View style={styles.playArea}>
          <SoundWaveButton
            isPlaying={isAudioPlaying}
            onPress={handlePlaySound}
            disabled={hasAnswered}
            color={stageColor}
          />
          <Text style={styles.playHint}>
            {isAudioPlaying ? '재생 중...' : '터치하여 소리 듣기'}
          </Text>
        </View>

        {/* 4지선다 */}
        <View style={styles.choicesGrid}>
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedWordId === choice.id;
            let isCorrectDisplay: boolean | null = null;

            if (showCorrectAnswer) {
              if (choice.id === currentQuestion.correctWord.id) {
                isCorrectDisplay = true;
              } else if (isSelected) {
                isCorrectDisplay = false;
              }
            }

            return (
              <ChoiceButton
                key={choice.id}
                word={choice.word}
                onPress={() => handleSelectChoice(choice.id)}
                disabled={hasAnswered}
                isCorrect={isCorrectDisplay}
                isSelected={isSelected}
                stageColor={stageColor}
              />
            );
          })}
        </View>

        {/* 피드백 메시지 */}
        {hasAnswered && (
          <View style={styles.feedbackRow}>
            <Text
              style={[
                styles.feedbackText,
                {
                  color: state.lastAnswerCorrect
                    ? COLORS.hearingCorrect
                    : COLORS.hearingWrong,
                },
              ]}
            >
              {state.lastAnswerCorrect
                ? '✅ 정답이에요!'
                : `❌ 정답은 "${currentQuestion.correctWord.word}" 이에요`}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* 단계 전환 오버레이 */}
      {showStageTransition && (
        <StageTransition
          stage={currentStage}
          onStart={dismissStageTransition}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // 상단 바
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageLabel: {
    fontSize: 13,
    fontWeight: '600',
  },

  // 문제 영역
  questionArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  instruction: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.hearingTextBody,
    textAlign: 'center',
    marginBottom: 8,
  },

  // 재생 버튼
  playArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  playHint: {
    fontSize: 14,
    color: COLORS.hearingTextMuted,
    marginTop: -8,
  },

  // 선택지
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginTop: 8,
  },

  // 피드백
  feedbackRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  feedbackText: {
    fontSize: 17,
    fontWeight: '700',
  },
});

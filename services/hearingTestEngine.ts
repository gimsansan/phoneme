/**
 * 청능 훈련 MVP — 테스트 로직 엔진
 *
 * 3단계 테스트의 문제 생성, 정답 판정, 점수 집계, 프로필 매칭을 담당합니다.
 */

import {
  WORDS_BY_STAGE,
  STAGE_META,
  type HearingTestWord,
  type TestStage,
} from '../constants/hearingTestWords';
import { matchProfile, type HearingProfile } from '../constants/hearingProfiles';

// ─── 타입 정의 ──────────────────────────────────────────────

export interface TestQuestion {
  /** 고유 문제 ID */
  id: string;
  /** 정답 단어 */
  correctWord: HearingTestWord;
  /** 보기 4개 (정답 포함, 셔플됨) */
  choices: HearingTestWord[];
  /** 소속 단계 */
  stage: TestStage;
}

export interface TestAnswer {
  /** 문제 ID */
  questionId: string;
  /** 정답 단어 */
  correctWordId: string;
  /** 선택한 단어 */
  selectedWordId: string;
  /** 정답 여부 */
  isCorrect: boolean;
  /** 응답 시간 (ms) */
  responseTimeMs: number;
  /** 소속 단계 */
  stage: TestStage;
}

export interface StageScore {
  /** 정답 수 */
  correct: number;
  /** 전체 문제 수 */
  total: number;
  /** 정답률 (0~100) */
  percentage: number;
}

export interface TestResult {
  /** 단계별 점수 */
  stageScores: Record<TestStage, StageScore>;
  /** 대역별 점수 (0~100) */
  bandScores: { low: number; mid: number; high: number };
  /** 매칭된 감성 프로필 */
  profile: HearingProfile;
  /** 전체 정답률 */
  overallPercentage: number;
  /** 테스트 완료 시각 */
  completedAt: string;
  /** 답변 목록 */
  answers: TestAnswer[];
}

// ─── 문제 생성 ──────────────────────────────────────────────

/**
 * Fisher-Yates 셔플
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 특정 단계의 문제 목록을 생성합니다.
 *
 * @param stage - 테스트 단계 (1, 2, 3)
 * @returns 생성된 문제 배열
 */
export function generateStageQuestions(stage: TestStage): TestQuestion[] {
  const words = WORDS_BY_STAGE[stage];
  const meta = STAGE_META[stage];
  const questionCount = meta.questionCount;

  // 해당 단계 단어를 셔플하여 questionCount만큼 선택
  const selectedWords = shuffle(words).slice(0, questionCount);

  return selectedWords.map((correctWord, index) => {
    // 오답 후보: 같은 단계의 다른 단어 중 3개 선택
    const distractors = shuffle(
      words.filter((w) => w.id !== correctWord.id),
    ).slice(0, 3);

    // 보기 4개를 셔플
    const choices = shuffle([correctWord, ...distractors]);

    return {
      id: `${stage}-q${index}`,
      correctWord,
      choices,
      stage,
    };
  });
}

/**
 * 전체 3단계 문제를 한 번에 생성합니다.
 *
 * @returns 단계 순서대로 정렬된 전체 문제 배열
 */
export function generateAllQuestions(): TestQuestion[] {
  return [
    ...generateStageQuestions(1),
    ...generateStageQuestions(2),
    ...generateStageQuestions(3),
  ];
}

// ─── 점수 계산 ──────────────────────────────────────────────

/**
 * 답변 목록을 기반으로 단계별 점수를 계산합니다.
 */
export function calculateStageScores(
  answers: TestAnswer[],
): Record<TestStage, StageScore> {
  const stages: TestStage[] = [1, 2, 3];
  const scores = {} as Record<TestStage, StageScore>;

  for (const stage of stages) {
    const stageAnswers = answers.filter((a) => a.stage === stage);
    const correct = stageAnswers.filter((a) => a.isCorrect).length;
    const total = stageAnswers.length;

    scores[stage] = {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }

  return scores;
}

/**
 * 단계별 점수를 주파수 대역별 점수로 변환합니다.
 *
 * - Stage 1 점수 → low (저주파수)
 * - Stage 2 점수 → mid (중주파수)
 * - Stage 3 점수 → high (고주파수)
 */
export function calculateBandScores(
  stageScores: Record<TestStage, StageScore>,
): { low: number; mid: number; high: number } {
  return {
    low: stageScores[1].percentage,
    mid: stageScores[2].percentage,
    high: stageScores[3].percentage,
  };
}

/**
 * 전체 테스트 결과를 생성합니다.
 */
export function calculateTestResult(answers: TestAnswer[]): TestResult {
  const stageScores = calculateStageScores(answers);
  const bandScores = calculateBandScores(stageScores);
  const profile = matchProfile(bandScores);

  const totalCorrect = answers.filter((a) => a.isCorrect).length;
  const overallPercentage =
    answers.length > 0 ? Math.round((totalCorrect / answers.length) * 100) : 0;

  return {
    stageScores,
    bandScores,
    profile,
    overallPercentage,
    completedAt: new Date().toISOString(),
    answers,
  };
}

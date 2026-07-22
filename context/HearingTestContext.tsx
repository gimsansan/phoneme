/**
 * 청능 훈련 MVP — 테스트 세션 상태 관리 Context
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import {
  generateAllQuestions,
  calculateTestResult,
  type TestQuestion,
  type TestAnswer,
  type TestResult,
} from '../services/hearingTestEngine';
import type { TestStage } from '../constants/hearingTestWords';

// ─── 상태 타입 ──────────────────────────────────────────────

export interface HearingTestState {
  /** 테스트 활성 여부 */
  isTestActive: boolean;
  /** 현재 단계 (1, 2, 3) */
  currentStage: TestStage;
  /** 현재 문제 인덱스 (전체 기준) */
  currentQuestionIndex: number;
  /** 전체 문제 목록 */
  questions: TestQuestion[];
  /** 기록된 답변 */
  answers: TestAnswer[];
  /** 단계 전환 중 여부 */
  showStageTransition: boolean;
  /** 테스트 완료 여부 */
  isTestComplete: boolean;
  /** 테스트 결과 */
  result: TestResult | null;
  /** 오디오 재생 중 여부 */
  isAudioPlaying: boolean;
  /** 현재 문제에 답변했는지 */
  hasAnswered: boolean;
  /** 마지막 답변이 정답이었는지 */
  lastAnswerCorrect: boolean | null;
}

const initialState: HearingTestState = {
  isTestActive: false,
  currentStage: 1,
  currentQuestionIndex: 0,
  questions: [],
  answers: [],
  showStageTransition: false,
  isTestComplete: false,
  result: null,
  isAudioPlaying: false,
  hasAnswered: false,
  lastAnswerCorrect: null,
};

// ─── 액션 타입 ──────────────────────────────────────────────

type HearingTestAction =
  | { type: 'START_TEST' }
  | { type: 'ANSWER_QUESTION'; payload: TestAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SHOW_STAGE_TRANSITION'; payload: TestStage }
  | { type: 'DISMISS_STAGE_TRANSITION' }
  | { type: 'COMPLETE_TEST' }
  | { type: 'RESET_TEST' }
  | { type: 'SET_AUDIO_PLAYING'; payload: boolean };

// ─── 리듀서 ─────────────────────────────────────────────────

function hearingTestReducer(
  state: HearingTestState,
  action: HearingTestAction,
): HearingTestState {
  switch (action.type) {
    case 'START_TEST': {
      const questions = generateAllQuestions();
      return {
        ...initialState,
        isTestActive: true,
        questions,
        currentStage: 1,
        showStageTransition: true, // 1단계 소개부터 시작
      };
    }

    case 'ANSWER_QUESTION': {
      return {
        ...state,
        answers: [...state.answers, action.payload],
        hasAnswered: true,
        lastAnswerCorrect: action.payload.isCorrect,
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1;

      // 모든 문제 완료
      if (nextIndex >= state.questions.length) {
        const result = calculateTestResult(state.answers);
        return {
          ...state,
          isTestComplete: true,
          result,
          hasAnswered: false,
          lastAnswerCorrect: null,
        };
      }

      const nextQuestion = state.questions[nextIndex];
      const nextStage = nextQuestion.stage;

      // 단계 전환 감지
      if (nextStage !== state.currentStage) {
        return {
          ...state,
          currentQuestionIndex: nextIndex,
          currentStage: nextStage,
          showStageTransition: true,
          hasAnswered: false,
          lastAnswerCorrect: null,
        };
      }

      return {
        ...state,
        currentQuestionIndex: nextIndex,
        hasAnswered: false,
        lastAnswerCorrect: null,
      };
    }

    case 'SHOW_STAGE_TRANSITION':
      return {
        ...state,
        showStageTransition: true,
        currentStage: action.payload,
      };

    case 'DISMISS_STAGE_TRANSITION':
      return {
        ...state,
        showStageTransition: false,
      };

    case 'COMPLETE_TEST': {
      const result = calculateTestResult(state.answers);
      return {
        ...state,
        isTestComplete: true,
        result,
      };
    }

    case 'RESET_TEST':
      return { ...initialState };

    case 'SET_AUDIO_PLAYING':
      return {
        ...state,
        isAudioPlaying: action.payload,
      };

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────

interface HearingTestContextValue {
  state: HearingTestState;
  startTest: () => void;
  answerQuestion: (answer: TestAnswer) => void;
  nextQuestion: () => void;
  dismissStageTransition: () => void;
  completeTest: () => void;
  resetTest: () => void;
  setAudioPlaying: (playing: boolean) => void;
}

const HearingTestContext = createContext<HearingTestContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────

export function HearingTestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(hearingTestReducer, initialState);

  const startTest = useCallback(() => {
    dispatch({ type: 'START_TEST' });
  }, []);

  const answerQuestion = useCallback((answer: TestAnswer) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: answer });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const dismissStageTransition = useCallback(() => {
    dispatch({ type: 'DISMISS_STAGE_TRANSITION' });
  }, []);

  const completeTest = useCallback(() => {
    dispatch({ type: 'COMPLETE_TEST' });
  }, []);

  const resetTest = useCallback(() => {
    dispatch({ type: 'RESET_TEST' });
  }, []);

  const setAudioPlaying = useCallback((playing: boolean) => {
    dispatch({ type: 'SET_AUDIO_PLAYING', payload: playing });
  }, []);

  return (
    <HearingTestContext.Provider
      value={{
        state,
        startTest,
        answerQuestion,
        nextQuestion,
        dismissStageTransition,
        completeTest,
        resetTest,
        setAudioPlaying,
      }}
    >
      {children}
    </HearingTestContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────

export function useHearingTest(): HearingTestContextValue {
  const context = useContext(HearingTestContext);
  if (!context) {
    throw new Error(
      'useHearingTest must be used within a HearingTestProvider',
    );
  }
  return context;
}

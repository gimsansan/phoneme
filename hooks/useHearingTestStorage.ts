/**
 * 청능 훈련 MVP — 결과 저장/불러오기 훅
 *
 * AsyncStorage를 사용하여 테스트 결과 히스토리를 로컬에 저장합니다.
 */

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TestResult } from '../services/hearingTestEngine';

// ─── 저장 키 ────────────────────────────────────────────────

const STORAGE_KEY = '@hearing_test_results';
const MAX_HISTORY = 20; // 최대 저장 건수

// ─── 저장 타입 ──────────────────────────────────────────────

export interface StoredResult {
  /** 저장 ID */
  id: string;
  /** 테스트 결과 */
  result: TestResult;
  /** 저장 시각 */
  savedAt: string;
}

// ─── 훅 ─────────────────────────────────────────────────────

export function useHearingTestStorage() {
  const [history, setHistory] = useState<StoredResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드
  useEffect(() => {
    loadHistory();
  }, []);

  /**
   * 저장된 결과 히스토리를 불러옵니다.
   */
  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredResult[] = JSON.parse(raw);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('[HearingTestStorage] 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 새 테스트 결과를 저장합니다.
   */
  const saveResult = useCallback(
    async (result: TestResult): Promise<StoredResult> => {
      const stored: StoredResult = {
        id: `result-${Date.now()}`,
        result,
        savedAt: new Date().toISOString(),
      };

      try {
        const updated = [stored, ...history].slice(0, MAX_HISTORY);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setHistory(updated);
      } catch (error) {
        console.error('[HearingTestStorage] 저장 실패:', error);
      }

      return stored;
    },
    [history],
  );

  /**
   * 특정 결과를 삭제합니다.
   */
  const deleteResult = useCallback(
    async (id: string) => {
      try {
        const updated = history.filter((r) => r.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setHistory(updated);
      } catch (error) {
        console.error('[HearingTestStorage] 삭제 실패:', error);
      }
    },
    [history],
  );

  /**
   * 모든 결과를 삭제합니다.
   */
  const clearAll = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error('[HearingTestStorage] 전체 삭제 실패:', error);
    }
  }, []);

  /** 가장 최근 결과 */
  const latestResult = history.length > 0 ? history[0] : null;

  return {
    history,
    latestResult,
    isLoading,
    saveResult,
    deleteResult,
    clearAll,
    reload: loadHistory,
  };
}

/**
 * 청능 훈련 MVP — TTS 음성 서비스
 *
 * expo-speech를 래핑하여 한국어 TTS를 제공합니다.
 * 단계별 화자 성별(남성/여성)과 발화 속도를 제어합니다.
 */

import * as Speech from 'expo-speech';
import type { SpeakerGender } from '../constants/hearingTestWords';

// ─── 설정 상수 ──────────────────────────────────────────────

/** TTS 발화 속도 (0.5 = 느리게, 1.0 = 보통) */
const SPEECH_RATE_NORMAL = 0.85;
const SPEECH_RATE_SLOW = 0.65;

/** 한국어 locale */
const LOCALE_KO = 'ko-KR';

// ─── 공개 API ───────────────────────────────────────────────

/**
 * 단어를 TTS로 발화합니다.
 *
 * @param word - 발화할 단어
 * @param gender - 권장 화자 성별 (TTS 엔진에 따라 지원 여부 다름)
 * @param slow - true면 느린 속도로 발화
 * @returns 발화 완료 시 resolve되는 Promise
 */
export function speakWord(
  word: string,
  gender: SpeakerGender = 'male',
  slow: boolean = false,
): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이전 발화 중이면 중단
    Speech.stop();

    const rate = slow ? SPEECH_RATE_SLOW : SPEECH_RATE_NORMAL;
    const pitch = gender === 'female' ? 1.3 : 0.9;

    console.log(`\n🔊 [TTS 재생 시작] 단어: "${word}" | 성별: ${gender} | 속도: ${rate} | 피치: ${pitch}`);

    Speech.speak(word, {
      language: LOCALE_KO,
      rate,
      pitch,
      onDone: () => {
        console.log(`✅ [TTS 재생 완료] 단어: "${word}"`);
        resolve();
      },
      onError: (error) => {
        console.error(`❌ [TTS 재생 에러] 단어: "${word}" - `, error);
        reject(error);
      },
      onStopped: () => {
        console.log(`⏹️ [TTS 재생 중단됨] 단어: "${word}"`);
        resolve();
      },
    });
  });
}

/**
 * 현재 발화를 중단합니다.
 */
export function stopSpeaking(): void {
  Speech.stop();
}

/**
 * TTS가 현재 발화 중인지 확인합니다.
 */
export async function isSpeaking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}

/**
 * 사용 가능한 한국어 음성 목록을 반환합니다.
 * (디바이스에 따라 다를 수 있음)
 */
export async function getAvailableKoreanVoices() {
  const voices = await Speech.getAvailableVoicesAsync();
  return voices.filter(
    (v) => v.language?.startsWith('ko') || v.language?.startsWith('KO'),
  );
}

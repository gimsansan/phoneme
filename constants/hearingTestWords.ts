/**
 * 청능 훈련 MVP — 3단계 테스트용 핵심 단어 DB (39선)
 *
 * 논문 검증 주파수 데이터 기반:
 * - 1단계: 비음/유음 (ㄴ, ㅁ, ㄹ) — 240~280Hz 저주파수
 * - 2단계: 파열음 (ㄱ, ㅂ, ㄷ) — 모음 조합별 중주파수 가변
 * - 3단계: 마찰음/파찰음 (ㅅ, ㅆ, ㅈ, ㅊ, ㅌ) — 3,500~7,000Hz+ 고주파수
 */

// ─── 타입 정의 ──────────────────────────────────────────────

export type FrequencyBand = 'low' | 'mid' | 'high';

export type ConsonantType =
  | '비음'       // ㄴ, ㅁ
  | '유음'       // ㄹ
  | '파열음'     // ㄱ, ㅂ, ㄷ
  | '마찰음'     // ㅅ, ㅆ
  | '파찰음'     // ㅈ, ㅊ
  | '기식파열음'; // ㅌ

export type SpeakerGender = 'male' | 'female' | 'mixed';
export type TestStage = 1 | 2 | 3;

export interface HearingTestWord {
  /** 고유 ID */
  id: string;
  /** 표시 단어 */
  word: string;
  /** 테스트 단계 */
  stage: TestStage;
  /** 초성 */
  consonant: string;
  /** 자음 유형 */
  consonantType: ConsonantType;
  /** 후행 모음 */
  vowel: string;
  /** 주파수 대역 분류 */
  frequencyBand: FrequencyBand;
  /** 평균 주파수 (Hz) — 연구 데이터 기반 */
  avgFrequencyHz: number;
  /** 권장 화자 성별 */
  speakerGender: SpeakerGender;
}

// ─── 1단계: 저주파수 웜업 (Confidence Builder) ──────────────
// 타겟: 240~280Hz | 비음(ㄴ,ㅁ) + 유음(ㄹ) | 남성 화자
// 특징: 모음 영향에 흔들리지 않는 일관된 저주파수 대역

export const STAGE_1_WORDS: HearingTestWord[] = [
  // /ㄴ/ 비음 — 저주파수 고정 구간, 모음 변동 적음
  {
    id: 's1-nabi',
    word: '나비',
    stage: 1,
    consonant: 'ㄴ',
    consonantType: '비음',
    vowel: 'ㅏ',
    frequencyBand: 'low',
    avgFrequencyHz: 260,
    speakerGender: 'male',
  },
  {
    id: 's1-nuna',
    word: '누나',
    stage: 1,
    consonant: 'ㄴ',
    consonantType: '비음',
    vowel: 'ㅜ',
    frequencyBand: 'low',
    avgFrequencyHz: 245,
    speakerGender: 'male',
  },
  {
    id: 's1-norae',
    word: '노래',
    stage: 1,
    consonant: 'ㄴ',
    consonantType: '비음',
    vowel: 'ㅗ',
    frequencyBand: 'low',
    avgFrequencyHz: 250,
    speakerGender: 'male',
  },
  {
    id: 's1-neukkim',
    word: '느낌',
    stage: 1,
    consonant: 'ㄴ',
    consonantType: '비음',
    vowel: 'ㅡ',
    frequencyBand: 'low',
    avgFrequencyHz: 255,
    speakerGender: 'male',
  },

  // /ㅁ/ 비음 — 안정적인 저음역대 유지
  {
    id: 's1-masul',
    word: '마술',
    stage: 1,
    consonant: 'ㅁ',
    consonantType: '비음',
    vowel: 'ㅏ',
    frequencyBand: 'low',
    avgFrequencyHz: 270,
    speakerGender: 'male',
  },
  {
    id: 's1-misul',
    word: '미술',
    stage: 1,
    consonant: 'ㅁ',
    consonantType: '비음',
    vowel: 'ㅣ',
    frequencyBand: 'low',
    avgFrequencyHz: 265,
    speakerGender: 'male',
  },
  {
    id: 's1-muyong',
    word: '무용',
    stage: 1,
    consonant: 'ㅁ',
    consonantType: '비음',
    vowel: 'ㅜ',
    frequencyBand: 'low',
    avgFrequencyHz: 248,
    speakerGender: 'male',
  },
  {
    id: 's1-moja',
    word: '모자',
    stage: 1,
    consonant: 'ㅁ',
    consonantType: '비음',
    vowel: 'ㅗ',
    frequencyBand: 'low',
    avgFrequencyHz: 252,
    speakerGender: 'male',
  },

  // /ㄹ/ 유음 — 청취 피로도가 가장 낮은 웜업용 음소
  {
    id: 's1-ramen',
    word: '라멘',
    stage: 1,
    consonant: 'ㄹ',
    consonantType: '유음',
    vowel: 'ㅏ',
    frequencyBand: 'low',
    avgFrequencyHz: 275,
    speakerGender: 'male',
  },
  {
    id: 's1-ribon',
    word: '리본',
    stage: 1,
    consonant: 'ㄹ',
    consonantType: '유음',
    vowel: 'ㅣ',
    frequencyBand: 'low',
    avgFrequencyHz: 268,
    speakerGender: 'male',
  },
  {
    id: 's1-robot',
    word: '로봇',
    stage: 1,
    consonant: 'ㄹ',
    consonantType: '유음',
    vowel: 'ㅗ',
    frequencyBand: 'low',
    avgFrequencyHz: 258,
    speakerGender: 'male',
  },
  {
    id: 's1-love',
    word: '러브',
    stage: 1,
    consonant: 'ㄹ',
    consonantType: '유음',
    vowel: 'ㅓ',
    frequencyBand: 'low',
    avgFrequencyHz: 262,
    speakerGender: 'male',
  },
];

// ─── 2단계: 모음 변별력 테스트 (Vowel & Mid-Frequency) ─────
// 타겟: 중주파수 대역 | 파열음(ㄱ,ㅂ,ㄷ) | 남녀 혼합 화자
// 특징: 동일 자음이라도 후행 모음에 따라 주파수 도약

export const STAGE_2_WORDS: HearingTestWord[] = [
  // /ㄱ/ 파열음 — 모음 조합에 따른 주파수 도약 확인
  {
    id: 's2-gabang',
    word: '가방',
    stage: 2,
    consonant: 'ㄱ',
    consonantType: '파열음',
    vowel: 'ㅏ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1580,
    speakerGender: 'mixed',
  },
  {
    id: 's2-gudu',
    word: '구두',
    stage: 2,
    consonant: 'ㄱ',
    consonantType: '파열음',
    vowel: 'ㅜ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1200,
    speakerGender: 'mixed',
  },
  {
    id: 's2-gorae',
    word: '고래',
    stage: 2,
    consonant: 'ㄱ',
    consonantType: '파열음',
    vowel: 'ㅗ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1350,
    speakerGender: 'mixed',
  },
  {
    id: 's2-geomi',
    word: '거미',
    stage: 2,
    consonant: 'ㄱ',
    consonantType: '파열음',
    vowel: 'ㅓ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1450,
    speakerGender: 'mixed',
  },

  // /ㅂ/ 파열음 — 중주파수 대역의 명료도 평가
  {
    id: 's2-bada',
    word: '바다',
    stage: 2,
    consonant: 'ㅂ',
    consonantType: '파열음',
    vowel: 'ㅏ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1520,
    speakerGender: 'mixed',
  },
  {
    id: 's2-binu',
    word: '비누',
    stage: 2,
    consonant: 'ㅂ',
    consonantType: '파열음',
    vowel: 'ㅣ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1750,
    speakerGender: 'mixed',
  },
  {
    id: 's2-buchae',
    word: '부채',
    stage: 2,
    consonant: 'ㅂ',
    consonantType: '파열음',
    vowel: 'ㅜ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1180,
    speakerGender: 'mixed',
  },
  {
    id: 's2-boseok',
    word: '보석',
    stage: 2,
    consonant: 'ㅂ',
    consonantType: '파열음',
    vowel: 'ㅗ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1320,
    speakerGender: 'mixed',
  },

  // /ㄷ/ 파열음 — 순간 에너지 변별력 체크
  {
    id: 's2-dari',
    word: '다리',
    stage: 2,
    consonant: 'ㄷ',
    consonantType: '파열음',
    vowel: 'ㅏ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1600,
    speakerGender: 'mixed',
  },
  {
    id: 's2-dubu',
    word: '두부',
    stage: 2,
    consonant: 'ㄷ',
    consonantType: '파열음',
    vowel: 'ㅜ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1250,
    speakerGender: 'mixed',
  },
  {
    id: 's2-dojang',
    word: '도장',
    stage: 2,
    consonant: 'ㄷ',
    consonantType: '파열음',
    vowel: 'ㅗ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1380,
    speakerGender: 'mixed',
  },
  {
    id: 's2-daejang',
    word: '대장',
    stage: 2,
    consonant: 'ㄷ',
    consonantType: '파열음',
    vowel: 'ㅐ',
    frequencyBand: 'mid',
    avgFrequencyHz: 1680,
    speakerGender: 'mixed',
  },
];

// ─── 3단계: 고주파수 스트레스 타격 (High-Frequency Detail) ──
// 타겟: 3,500~7,000Hz+ | 마찰음/파찰음(ㅅ,ㅆ,ㅈ,ㅊ,ㅌ) | 여성 화자
// 특징: 노인성 난청 환자가 가장 먼저 놓치는 고음역대 취약점

export const STAGE_3_WORDS: HearingTestWord[] = [
  // /ㅅ/ 마찰음 — 4,000~6,500Hz 대역
  {
    id: 's3-satang',
    word: '사탕',
    stage: 3,
    consonant: 'ㅅ',
    consonantType: '마찰음',
    vowel: 'ㅏ',
    frequencyBand: 'high',
    avgFrequencyHz: 5200,
    speakerGender: 'female',
  },
  {
    id: 's3-sigye',
    word: '시계',
    stage: 3,
    consonant: 'ㅅ',
    consonantType: '마찰음',
    vowel: 'ㅣ',
    frequencyBand: 'high',
    avgFrequencyHz: 6300,
    speakerGender: 'female',
  },
  {
    id: 's3-suyeong',
    word: '수영',
    stage: 3,
    consonant: 'ㅅ',
    consonantType: '마찰음',
    vowel: 'ㅜ',
    frequencyBand: 'high',
    avgFrequencyHz: 4800,
    speakerGender: 'female',
  },
  {
    id: 's3-sogeum',
    word: '소금',
    stage: 3,
    consonant: 'ㅅ',
    consonantType: '마찰음',
    vowel: 'ㅗ',
    frequencyBand: 'high',
    avgFrequencyHz: 5000,
    speakerGender: 'female',
  },

  // /ㅆ/ 경마찰음 — 고주파수 변별력 한계치 테스트
  {
    id: 's3-ssari',
    word: '싸리',
    stage: 3,
    consonant: 'ㅆ',
    consonantType: '마찰음',
    vowel: 'ㅏ',
    frequencyBand: 'high',
    avgFrequencyHz: 5800,
    speakerGender: 'female',
  },
  {
    id: 's3-ssoda',
    word: '쏘다',
    stage: 3,
    consonant: 'ㅆ',
    consonantType: '마찰음',
    vowel: 'ㅗ',
    frequencyBand: 'high',
    avgFrequencyHz: 5500,
    speakerGender: 'female',
  },
  {
    id: 's3-sseuda',
    word: '쓰다',
    stage: 3,
    consonant: 'ㅆ',
    consonantType: '마찰음',
    vowel: 'ㅡ',
    frequencyBand: 'high',
    avgFrequencyHz: 6000,
    speakerGender: 'female',
  },

  // /ㅈ/ 파찰음 — 3,500~5,000Hz 대역
  {
    id: 's3-jari',
    word: '자리',
    stage: 3,
    consonant: 'ㅈ',
    consonantType: '파찰음',
    vowel: 'ㅏ',
    frequencyBand: 'high',
    avgFrequencyHz: 4200,
    speakerGender: 'female',
  },
  {
    id: 's3-jigu',
    word: '지구',
    stage: 3,
    consonant: 'ㅈ',
    consonantType: '파찰음',
    vowel: 'ㅣ',
    frequencyBand: 'high',
    avgFrequencyHz: 4800,
    speakerGender: 'female',
  },
  {
    id: 's3-jumeok',
    word: '주먹',
    stage: 3,
    consonant: 'ㅈ',
    consonantType: '파찰음',
    vowel: 'ㅜ',
    frequencyBand: 'high',
    avgFrequencyHz: 3800,
    speakerGender: 'female',
  },
  {
    id: 's3-jeoul',
    word: '저울',
    stage: 3,
    consonant: 'ㅈ',
    consonantType: '파찰음',
    vowel: 'ㅓ',
    frequencyBand: 'high',
    avgFrequencyHz: 4000,
    speakerGender: 'female',
  },

  // /ㅊ/ 파찰음(격음) — 고음역대 돌발 인지력 확인
  {
    id: 's3-chago',
    word: '차고',
    stage: 3,
    consonant: 'ㅊ',
    consonantType: '파찰음',
    vowel: 'ㅏ',
    frequencyBand: 'high',
    avgFrequencyHz: 4500,
    speakerGender: 'female',
  },
  {
    id: 's3-chiyak',
    word: '치약',
    stage: 3,
    consonant: 'ㅊ',
    consonantType: '파찰음',
    vowel: 'ㅣ',
    frequencyBand: 'high',
    avgFrequencyHz: 5200,
    speakerGender: 'female',
  },
  {
    id: 's3-chuseok',
    word: '추석',
    stage: 3,
    consonant: 'ㅊ',
    consonantType: '파찰음',
    vowel: 'ㅜ',
    frequencyBand: 'high',
    avgFrequencyHz: 4300,
    speakerGender: 'female',
  },

  // /ㅌ/ 기식파열음 — 4,000Hz 이상 고주파수 파열음
  {
    id: 's3-tada',
    word: '타다',
    stage: 3,
    consonant: 'ㅌ',
    consonantType: '기식파열음',
    vowel: 'ㅏ',
    frequencyBand: 'high',
    avgFrequencyHz: 4100,
    speakerGender: 'female',
  },
];

// ─── 전체 단어 목록 & 유틸 ─────────────────────────────────

/** 39개 전체 단어 통합 배열 */
export const ALL_HEARING_WORDS: HearingTestWord[] = [
  ...STAGE_1_WORDS,
  ...STAGE_2_WORDS,
  ...STAGE_3_WORDS,
];

/** 단계별 단어 맵 */
export const WORDS_BY_STAGE: Record<TestStage, HearingTestWord[]> = {
  1: STAGE_1_WORDS,
  2: STAGE_2_WORDS,
  3: STAGE_3_WORDS,
};

/** 단계별 메타데이터 */
export const STAGE_META = {
  1: {
    title: '저주파수 웜업',
    subtitle: 'Confidence Builder',
    description: '편안한 저음역대 소리로 시작해볼까요?\n긴장을 풀고 천천히 들어보세요.',
    emoji: '🎵',
    questionCount: 4,
    targetHz: '240 ~ 280Hz',
    speakerLabel: '남성 화자',
  },
  2: {
    title: '모음 변별력 확인',
    subtitle: 'Vowel & Mid-Frequency',
    description: '비슷한 소리 속에서 정확한 단어를\n구별할 수 있는지 확인해볼게요.',
    emoji: '🎶',
    questionCount: 4,
    targetHz: '중주파수 가변',
    speakerLabel: '남녀 혼합 화자',
  },
  3: {
    title: '고주파수 정밀 확인',
    subtitle: 'High-Frequency Detail',
    description: '고음역대의 섬세한 소리를\n얼마나 잘 들을 수 있는지 확인해요.',
    emoji: '🎼',
    questionCount: 5,
    targetHz: '3,500 ~ 7,000Hz+',
    speakerLabel: '여성 화자',
  },
} as const;

/** 전체 문제 수 */
export const TOTAL_QUESTIONS =
  STAGE_META[1].questionCount +
  STAGE_META[2].questionCount +
  STAGE_META[3].questionCount; // 13

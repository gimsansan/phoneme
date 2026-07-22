/**
 * 앱 공통 색상 상수
 * LAYOUT_APPLY_REPORT 권장사항 반영
 */
export const COLORS = {
  /** 기본 텍스트 */
  textPrimary: '#333',
  textSecondary: '#666',
  textMuted: '#555',
  textLight: '#999',
  textSlate: '#4b5563',
  textPlaceholder: '#aaa',
  textLoading: '#64748b',

  /** 배경 */
  background: '#ffffff',
  backgroundGray: '#f5f5f5',
  backgroundLight: '#f0f0f0',
  backgroundWarm: '#fffbeb',
  backgroundSuccess: '#ecfdf5',
  backgroundError: '#fef2f2',
  backgroundWarning: '#fef3c7',
  backgroundStar: '#FFF9E6',

  /** 액센트 / 버튼 */
  primary: '#f59e0b',
  primaryDark: '#d97706',
  blue: '#4A90E2',
  green: '#10b981',
  greenBright: '#50C878',
  success: '#7cbd7e',
  purple: '#9C27B0',

  /** 상태 */
  successLight: '#C8E6C9',
  successText: '#065f46',
  error: '#F44336',
  errorLight: '#FFCDD2',
  errorBorder: '#fca5a5',

  /** 테두리 */
  border: '#e2e8f0',
  borderGray: '#BDBDBD',

  /** 강조 */
  gold: '#FFD700',
  white: '#ffffff',

  /** 오버레이 */
  overlay: 'rgba(0, 0, 0, 0.4)',

  /** 기타 */
  activityIndicator: '#007bff',
  orange: '#FF8c42',
  successGreen: '#28A745',
  shadow: '#000',
  grayLight: '#E0E0E0',
  blueLight: '#E3F2FD',

  /** 등급 (matchGameAI, matchGamePG) */
  gradeUntried: '#999',
  gradePerfect: '#FF6B6B',
  gradeExcellent: '#4ECDC4',
  gradeNormal: '#95E1D3',
  gradePractice: '#FFE66D',

  /** ── 청능 훈련 테마 ── */
  hearingStage1: '#6366F1',     // 인디고 — 저주파수 웜업
  hearingStage1Light: '#EEF2FF', // 인디고 밝은 배경
  hearingStage2: '#8B5CF6',     // 바이올렛 — 모음 변별
  hearingStage2Light: '#F5F3FF', // 바이올렛 밝은 배경
  hearingStage3: '#EC4899',     // 핑크 — 고주파수 타격
  hearingStage3Light: '#FDF2F8', // 핑크 밝은 배경
  hearingBg: '#F8FAFC',         // 전체 밝은 배경
  hearingCardBg: '#FFFFFF',     // 카드 배경
  hearingAccent: '#0EA5E9',     // 스카이블루 — CTA
  hearingAccentDark: '#0284C7', // CTA 눌림 상태
  hearingCorrect: '#10B981',    // 정답 피드백
  hearingCorrectBg: '#ECFDF5',  // 정답 배경
  hearingWrong: '#EF4444',      // 오답 피드백
  hearingWrongBg: '#FEF2F2',    // 오답 배경
  hearingTextTitle: '#1E293B',  // 제목 텍스트
  hearingTextBody: '#475569',   // 본문 텍스트
  hearingTextMuted: '#94A3B8',  // 보조 텍스트
  hearingBorder: '#E2E8F0',     // 테두리
  hearingOverlay: 'rgba(15, 23, 42, 0.6)', // 오버레이
} as const;

/** 파형 Skia LinearGradient — 좌→우: 주황 → 연한 주황 → 초록 */
export const WAVEFORM_GRADIENT = {
  start: '#FF9800',
  middle: '#FFB74D',
  end: '#81C784',
  positions: [0, 0.5, 1] ,
} as const;

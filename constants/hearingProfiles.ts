/**
 * 청능 훈련 결과 — 감성 프로필 정의
 *
 * 의료적 진단명 대신 감성적 네이밍으로 청취 프로필을 제시합니다.
 * 각 프로필은 저/중/고 주파수 대역별 점수 범위로 매칭됩니다.
 */

export interface ScoreRange {
  min: number; // 0~100
  max: number;
}

export interface HearingProfile {
  /** 고유 ID */
  id: string;
  /** 감성 네이밍 */
  name: string;
  /** 대표 이모지 */
  emoji: string;
  /** 프로필 설명 */
  description: string;
  /** 권유형 피드백 */
  recommendation: string;
  /** 프로필 대표 색상 (그라데이션 시작) */
  color: string;
  /** 프로필 보조 색상 (그라데이션 끝) */
  colorEnd: string;
  /** 매칭 기준 — 대역별 점수 범위 */
  criteria: {
    low: ScoreRange;
    mid: ScoreRange;
    high: ScoreRange;
  };
  /** 우선 순위 (낮을수록 먼저 매칭 시도) */
  priority: number;
}

/** 감성 프로필 목록 — 우선순위 순 */
export const HEARING_PROFILES: HearingProfile[] = [
  {
    id: 'clear-river',
    name: '맑은 강물형',
    emoji: '🏞️',
    description:
      '전 대역에서 소리를 잘 들으시는 편이에요.\n맑은 강물처럼 소리가 깨끗하게 전달되고 있어요.',
    recommendation:
      '현재 청취 상태가 아주 좋아요! 꾸준한 훈련으로 이 상태를 유지해보세요. 가끔 고음역대 훈련을 하시면 더욱 좋습니다.',
    color: '#3B82F6',
    colorEnd: '#06B6D4',
    criteria: {
      low: { min: 80, max: 100 },
      mid: { min: 80, max: 100 },
      high: { min: 75, max: 100 },
    },
    priority: 1,
  },
  {
    id: 'spring-breeze',
    name: '봄바람형',
    emoji: '🌸',
    description:
      '저·중음역대는 잘 들으시지만,\n높은 소리에서 살짝 헷갈리는 경향이 있어요.',
    recommendation:
      '결과를 보니 특정 고음역대 소리에서 헷갈리시는 경향이 있어요. "ㅅ, ㅈ, ㅊ" 같은 소리를 집중적으로 연습해 볼까요?',
    color: '#EC4899',
    colorEnd: '#F97316',
    criteria: {
      low: { min: 70, max: 100 },
      mid: { min: 65, max: 100 },
      high: { min: 40, max: 74 },
    },
    priority: 2,
  },
  {
    id: 'deep-forest',
    name: '깊은 숲속형',
    emoji: '🌲',
    description:
      '저음역대는 편안하게 들으시지만,\n고음역대에서 놓치는 소리가 좀 있어요.',
    recommendation:
      '숲속의 새소리처럼 높은 음역의 소리를 더 선명하게 들을 수 있도록 고주파수 훈련을 집중적으로 해보시는 건 어떨까요?',
    color: '#10B981',
    colorEnd: '#059669',
    criteria: {
      low: { min: 65, max: 100 },
      mid: { min: 50, max: 74 },
      high: { min: 20, max: 59 },
    },
    priority: 3,
  },
  {
    id: 'cozy-fireplace',
    name: '아늑한 벽난로형',
    emoji: '🔥',
    description:
      '저음역대는 따뜻하게 잘 들리지만,\n중·고음역대에서 소리를 놓치는 경향이 있어요.',
    recommendation:
      '벽난로 옆에서 대화하듯, 중·고음역대의 소리를 더 선명하게 잡아보는 훈련을 함께 해볼까요? 꾸준한 연습이 큰 도움이 됩니다.',
    color: '#F59E0B',
    colorEnd: '#EF4444',
    criteria: {
      low: { min: 50, max: 100 },
      mid: { min: 30, max: 64 },
      high: { min: 20, max: 49 },
    },
    priority: 4,
  },
  {
    id: 'calm-lake',
    name: '고요한 호수형',
    emoji: '🌊',
    description:
      '전반적으로 소리를 듣는 데 살짝 어려움이 있는 편이에요.\n하지만 걱정하지 마세요, 꾸준한 훈련이 도움이 됩니다.',
    recommendation:
      '고요한 호수 위에 울려퍼지는 소리처럼, 천천히 다양한 음역대의 소리를 연습해보면 좋겠어요. 전문가 상담도 함께 고려해보시면 더욱 좋습니다.',
    color: '#8B5CF6',
    colorEnd: '#6366F1',
    criteria: {
      low: { min: 0, max: 64 },
      mid: { min: 0, max: 49 },
      high: { min: 0, max: 39 },
    },
    priority: 5,
  },
];

/**
 * 대역별 점수를 기반으로 가장 적합한 프로필 매칭
 *
 * @param scores - { low, mid, high } 각 0~100
 * @returns 매칭된 HearingProfile
 */
export function matchProfile(scores: {
  low: number;
  mid: number;
  high: number;
}): HearingProfile {
  // 우선순위 순으로 정렬된 프로필에서 기준에 부합하는 첫 번째 반환
  const sorted = [...HEARING_PROFILES].sort((a, b) => a.priority - b.priority);

  for (const profile of sorted) {
    const { criteria } = profile;
    if (
      scores.low >= criteria.low.min &&
      scores.low <= criteria.low.max &&
      scores.mid >= criteria.mid.min &&
      scores.mid <= criteria.mid.max &&
      scores.high >= criteria.high.min &&
      scores.high <= criteria.high.max
    ) {
      return profile;
    }
  }

  // 어떤 프로필에도 정확히 매칭되지 않으면 가장 가까운 프로필 반환
  return findClosestProfile(scores);
}

/**
 * 정확한 매칭이 없을 때 유클리드 거리 기반으로 가장 가까운 프로필 반환
 */
function findClosestProfile(scores: {
  low: number;
  mid: number;
  high: number;
}): HearingProfile {
  let bestProfile = HEARING_PROFILES[HEARING_PROFILES.length - 1];
  let bestDistance = Infinity;

  for (const profile of HEARING_PROFILES) {
    const { criteria } = profile;
    const midLow = (criteria.low.min + criteria.low.max) / 2;
    const midMid = (criteria.mid.min + criteria.mid.max) / 2;
    const midHigh = (criteria.high.min + criteria.high.max) / 2;

    const distance = Math.sqrt(
      (scores.low - midLow) ** 2 +
        (scores.mid - midMid) ** 2 +
        (scores.high - midHigh) ** 2,
    );

    if (distance < bestDistance) {
      bestDistance = distance;
      bestProfile = profile;
    }
  }

  return bestProfile;
}

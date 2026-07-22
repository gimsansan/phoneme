/**
 * 방사형 차트 (Radar Chart) — react-native-svg 기반
 *
 * 3축(저음역/중음역/고음역) 점수를 시각화합니다.
 * 그라데이션 영역 + 부드러운 등장 애니메이션 포함.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated as RNAnimated } from 'react-native';
import Svg, {
  Polygon,
  Line,
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { COLORS } from '../../constants/colors';

// ─── 타입 ───────────────────────────────────────────────────

interface RadarChartProps {
  /** 점수 데이터 (0~100) */
  data: {
    low: number;   // 저음역
    mid: number;   // 중음역
    high: number;  // 고음역
  };
  /** 차트 크기 */
  size?: number;
  /** 그라데이션 시작 색상 */
  fillColorStart?: string;
  /** 그라데이션 끝 색상 */
  fillColorEnd?: string;
  /** 애니메이션 여부 */
  animated?: boolean;
}

// ─── 유틸 ───────────────────────────────────────────────────

const LABELS = [
  { key: 'high', label: '고음역', emoji: '🔊' },
  { key: 'mid', label: '중음역', emoji: '🎵' },
  { key: 'low', label: '저음역', emoji: '🎶' },
] as const;

/** 꼭짓점 좌표 계산 (3축, 12시 방향 시작, 시계 방향) */
function getPoint(
  centerX: number,
  centerY: number,
  radius: number,
  index: number,
  total: number,
): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

/** 다각형 포인트 문자열 생성 */
function getPolygonPoints(
  centerX: number,
  centerY: number,
  radius: number,
  total: number,
): string {
  return Array.from({ length: total })
    .map((_, i) => {
      const { x, y } = getPoint(centerX, centerY, radius, i, total);
      return `${x},${y}`;
    })
    .join(' ');
}

/** 데이터 다각형 포인트 문자열 */
function getDataPolygonPoints(
  centerX: number,
  centerY: number,
  maxRadius: number,
  values: number[],
  total: number,
): string {
  return values
    .map((val, i) => {
      const r = (val / 100) * maxRadius;
      const { x, y } = getPoint(centerX, centerY, r, i, total);
      return `${x},${y}`;
    })
    .join(' ');
}

// ─── 컴포넌트 ───────────────────────────────────────────────

export default function RadarChart({
  data,
  size = 260,
  fillColorStart = '#6366F1',
  fillColorEnd = '#EC4899',
  animated = true,
}: RadarChartProps) {
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const scaleAnim = useRef(new RNAnimated.Value(0.3)).current;

  useEffect(() => {
    if (animated) {
      RNAnimated.parallel([
        RNAnimated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          delay: 300,
          useNativeDriver: true,
        }),
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 7,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
    }
  }, [animated]);

  const padding = 44;
  const svgSize = size + padding * 2;
  const center = svgSize / 2;
  const maxRadius = size / 2;
  const numAxes = 3;
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const values = [data.high, data.mid, data.low]; // LABELS 순서와 동일

  return (
    <RNAnimated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Svg width={svgSize} height={svgSize}>
        <Defs>
          <LinearGradient id="dataGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={fillColorStart} stopOpacity="0.35" />
            <Stop offset="1" stopColor={fillColorEnd} stopOpacity="0.35" />
          </LinearGradient>
          <LinearGradient id="dataStrokeGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={fillColorStart} stopOpacity="1" />
            <Stop offset="1" stopColor={fillColorEnd} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* 배경 그리드 */}
        {gridLevels.map((level) => (
          <Polygon
            key={`grid-${level}`}
            points={getPolygonPoints(center, center, maxRadius * level, numAxes)}
            fill="none"
            stroke={COLORS.hearingBorder}
            strokeWidth={1}
            strokeDasharray={level < 1 ? '4,4' : '0'}
          />
        ))}

        {/* 축 라인 */}
        {Array.from({ length: numAxes }).map((_, i) => {
          const { x, y } = getPoint(center, center, maxRadius, i, numAxes);
          return (
            <Line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={COLORS.hearingBorder}
              strokeWidth={1}
            />
          );
        })}

        {/* 데이터 영역 */}
        <Polygon
          points={getDataPolygonPoints(center, center, maxRadius, values, numAxes)}
          fill="url(#dataGrad)"
          stroke="url(#dataStrokeGrad)"
          strokeWidth={2.5}
        />

        {/* 데이터 포인트 (꼭짓점 원) */}
        {values.map((val, i) => {
          const r = (val / 100) * maxRadius;
          const { x, y } = getPoint(center, center, r, i, numAxes);
          return (
            <Circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={5}
              fill="#fff"
              stroke={i === 0 ? fillColorEnd : fillColorStart}
              strokeWidth={2.5}
            />
          );
        })}

        {/* 축 레이블 */}
        {LABELS.map((item, i) => {
          const labelRadius = maxRadius + 28;
          const { x, y } = getPoint(center, center, labelRadius, i, numAxes);
          return (
            <SvgText
              key={`label-${i}`}
              x={x}
              y={y + 5}
              fontSize={13}
              fontWeight="600"
              fill={COLORS.hearingTextBody}
              textAnchor="middle"
            >
              {`${item.emoji} ${item.label}`}
            </SvgText>
          );
        })}

        {/* 점수 표시 */}
        {values.map((val, i) => {
          const r = (val / 100) * maxRadius;
          const { x, y } = getPoint(center, center, r, i, numAxes);
          const offsetY = i === 0 ? -14 : 18;
          return (
            <SvgText
              key={`score-${i}`}
              x={x}
              y={y + offsetY}
              fontSize={12}
              fontWeight="bold"
              fill={COLORS.hearingTextTitle}
              textAnchor="middle"
            >
              {`${val}%`}
            </SvgText>
          );
        })}
      </Svg>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

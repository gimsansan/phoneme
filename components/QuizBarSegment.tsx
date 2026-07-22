import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { LAYOUT } from '../constants/layout';

/**
 * QuizBarSegment
 * quiz_bar.riv(Rive) 대체용 4칸 문제 수 선택 바.
 *
 * 원본 값 매핑:
 * - 옵션         : 5, 10, 15, 20
 * - 너비/높이    : LAYOUT.quizBarWidth × quizBarHeight
 * - 선택 표시    : Number 1~4 → 슬라이딩 하이라이트
 */

type QuizBarSegmentProps<T extends number> = {
  readonly options: readonly T[];
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly width?: number;
  readonly height?: number;
  readonly style?: ViewStyle;
};

export default function QuizBarSegment<T extends number>({
  options,
  value,
  onChange,
  width = LAYOUT.quizBarWidth,
  height = LAYOUT.quizBarHeight,
  style,
}: QuizBarSegmentProps<T>) {
  const selectedIndex = Math.max(0, options.indexOf(value));
  const segmentWidth = width / options.length;
  const highlightIndex = useSharedValue(selectedIndex);

  useEffect(() => {
    highlightIndex.value = withTiming(selectedIndex, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
    return () => cancelAnimation(highlightIndex);
  }, [selectedIndex]);

  const highlightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: highlightIndex.value * segmentWidth }],
  }));

  return (
    <View
      style={[
        styles.track,
        { width, height, borderRadius: height / 2 },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.highlight,
          {
            width: segmentWidth - 8,
            height: height - 8,
            borderRadius: (height - 8) / 2,
            top: 4,
            left: 4,
          },
          highlightStyle,
        ]}
      />
      {options.map((option) => {
        const isSelected = option === value;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.segment, { width: segmentWidth, height }]}
            activeOpacity={0.8}
            onPress={() => onChange(option)}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {option}문제
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: '#FF9800',
    elevation: 2,
  },
  segment: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    color: '#666',
  },
  labelSelected: {
    color: '#fff',
  },
});

/**
 * sound_grt 탭 내 네스트 Stack 네비게이터
 *
 * 홈 → 테스트 → 결과 스크린 간 네비게이션을 관리합니다.
 */

import { Stack } from 'expo-router';

export default function SoundGrtLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="hearing-test"
        options={{ gestureEnabled: false }} // 테스트 중 뒤로가기 방지
      />
      <Stack.Screen name="hearing-result" />
    </Stack>
  );
}

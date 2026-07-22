import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function TTSTestScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [text, setText] = useState('안녕하세요. 실제 소리가 잘 들리시나요?');

  const handlePlay = () => {
    console.log('[디버그] 재생 요청:', text);
    Speech.speak(text, { language: 'ko-KR' });
  };

  const handleStop = () => {
    console.log('[디버그] 재생 중단 요청');
    Speech.stop();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>🔊 순수 TTS 사운드 테스트</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>돌아가기</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>테스트할 문장:</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          multiline
        />

        <View style={styles.buttonRow}>
          <Pressable style={styles.playButton} onPress={handlePlay}>
            <Text style={styles.playText}>재생하기</Text>
          </Pressable>
          <Pressable style={styles.stopButton} onPress={handleStop}>
            <Text style={styles.stopText}>멈추기</Text>
          </Pressable>
        </View>

        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>소리가 안 날 때 체크리스트:</Text>
          <Text style={styles.helpText}>1. 폰이 매너모드(진동/무음)인지 확인</Text>
          <Text style={styles.helpText}>2. 미디어 볼륨이 0인지 확인</Text>
          <Text style={styles.helpText}>3. 블루투스 기기 연결 여부 확인</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#334155',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  playButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  playText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  helpBox: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
    lineHeight: 20,
  },
});

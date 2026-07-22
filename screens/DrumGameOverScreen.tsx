import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import ScoreProgressBar from "../components/ScoreProgressBar";


interface DrumGameOverScreenProps {
  score: number;
  maxScore: number;
  onRestart: () => void;
  onGoHome: () => void;
}

function DrumGameOverScreen({
  score,
  maxScore,
  onRestart,
  onGoHome,
}: DrumGameOverScreenProps) {
  // 점수에 따른 메시지 결정
  const getScoreMessage = () => {
    if (score === maxScore) return " 완벽해요!";
    if (score >= maxScore * 0.7) return " 잘했어요!";
    return "아쉬워요!";
  };

  return (
    <View style={styles.container}>
      <View style={styles.resultWrapper}>
        <View style={styles.resultContent}>


          {/* 점수 카드 */}
          <View style={styles.scoreCard}>
            {/* 점수와 진행 바를 함께 배치 */}
            <View style={styles.scoreContainer}>


              {/* 점수 진행 바 - pro_box33.riv 대체 (Reanimated) */}
              <View style={styles.progressBar}>
                <ScoreProgressBar score={score} maxScore={maxScore} />
              </View>
              <Text style={styles.scoreMessage}>{getScoreMessage()}</Text>
              <Text style={styles.scoreCombined}>
                {score}/{maxScore}
              </Text>
            </View>


          </View>

          {/* 버튼 */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onRestart}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.buttonText}>다시 하기</Text>
            </Pressable>

            <Pressable
              onPress={onGoHome}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.buttonText}>나가기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  resultWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  resultContent: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  scoreCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    alignItems: "center",
    elevation: 4,
    marginBottom: 20,
  },
  scoreCombined: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: "bold",
    color: "#7cbd7e",
    textAlign: "center",
    textShadowColor: "rgba(135, 206, 235, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,

  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 20,



  },
  scoreMessage: {
    fontSize: 32,
    color: "#333",
    marginTop: 5,
    fontWeight: "bold",
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    gap: 6,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#7cbd7e",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
    minHeight: 80,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF", // 흰색
  },
  pressedButton: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
});

export default DrumGameOverScreen;

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useRef } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../constants/colors";

// 탭 버튼 애니메이션 컴포넌트
const AnimatedTabBarButton = ({
  children,
  onPress,
  style,
  ...restProps
}: any) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressOut = () => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 1.2,
        useNativeDriver: true,
        speed: 200,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        speed: 200,
      }),
    ]).start();
  };

  const { ref, pressColor, pressOpacity, hoverEffect, href, ...filteredRestProps } = restProps as any;

  return (
    <Pressable
      {...filteredRestProps}
      onPress={onPress}
      onPressOut={handlePressOut}
      style={[
        { flex: 1, justifyContent: "center", alignItems: "center" },
        style,
      ]}
      android_ripple={{ borderless: false, radius: 0 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (

    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { paddingBottom: 4 + insets.bottom, height: 64 + insets.bottom }],
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textLight,
   /*      // screenOptions로 Tabs에 props를 내려주면
        // (예: screenOptions={{ tabBarButton: ... }})
        // 각 tab의 tabBarButton에 자동으로 전달됨.
        // props는 내부적으로 Navigation이 탭 상태, onPress 등 정보 자동 전달!
        // 네, props 파라미터는 여기서 처음 생성(정의)됩니다. */
        tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="sound_grt"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="ear-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>

  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,

    elevation: 8,

  },
});

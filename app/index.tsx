import { View } from "react-native";
import SplashScreen from "./screens/Onboarding/splashScreen";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SplashScreen />
    </View>
  );
}

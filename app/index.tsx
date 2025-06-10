import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ForgotPasswordScreen from './screens/auth/forgotPasswordScreen';
import LoginScreen from './screens/auth/loginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';

import SubmitComplaintScreen from './screens/complaints/SubmitComplaintScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import NotificationsScreen from './screens/Notifications/NotificationsScreen';
import SplashScreen from './screens/Onboarding/splashScreen';
import ProfileSettingsScreen from './screens/profile/ProfileSettingsScreen';
import AirtimeDataScreen from './screens/Services/AirtimeDataScreen';
import AnnouncementsScreen from './screens/Services/AnnouncementsScreen';
import ElectricityScreen from './screens/Services/ElectricityScreen';
import EmergencyScreen from './screens/Services/EmergencyScreen';
import EstateDuesScreen from './screens/Services/EstateDuesScreen';
import GatePassScreen from './screens/Services/GatePassScreen';
import TransactionHistoryScreen from './screens/Services/TransactionHistoryScreen';
const Stack = createStackNavigator(); 

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyle: { backgroundColor: '#fff' }
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="GatePass" component={GatePassScreen} />
        <Stack.Screen name="Electricity" component={ElectricityScreen} />
        <Stack.Screen name="AirtimeData" component={AirtimeDataScreen} />
        <Stack.Screen name="EstateDues" component={EstateDuesScreen} />
        <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
        <Stack.Screen name="SubmitComplaint" component={SubmitComplaintScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}

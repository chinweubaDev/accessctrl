import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EstateAdminAnnouncementsScreen from './screens/Admin/AnnouncementsScreen';
import EstateAdminDashboard from './screens/Admin/EstateAdminDashboard';
import EstateAdminDuesScreen from './screens/Admin/EstateDuesScreen';
import PaymentHistoryScreen from './screens/Admin/PaymentHistoryScreen';
import ResidentsScreen from './screens/Admin/ResidentsScreen';
import SecurityAccessScreen from './screens/Admin/SecurityAccessScreen';
import ViewComplaintsScreen from './screens/Admin/ViewComplaintsScreen';
import VisitorsScreen from './screens/Admin/VisitorsScreen';
import ForgotPasswordScreen from './screens/auth/forgotPasswordScreen';
import LoginScreen from './screens/auth/loginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import SubmitComplaintScreen from './screens/complaints/SubmitComplaintScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import NotificationsScreen from './screens/Notifications/NotificationsScreen';
import SplashScreen from './screens/Onboarding/splashScreen';
import AboutScreen from './screens/profile/AboutScreen';
import ChangePasswordScreen from './screens/profile/ChangePasswordScreen';
import ChangePinScreen from './screens/profile/ChangePinScreen';
import EditProfileScreen from './screens/profile/EditProfileScreen';
import ProfileSettingsScreen from './screens/profile/ProfileSettingsScreen';
import SecuritySettingsScreen from './screens/profile/SecuritySettingsScreen';
import SecurityDashboard from './screens/security/SecurityDashboard';
import AirtimeDataScreen from './screens/Services/AirtimeDataScreen';
import AnnouncementsScreen from './screens/Services/AnnouncementsScreen';
import CableTV from './screens/Services/CableTV';
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
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="ChangePin" component={ChangePinScreen} />
        <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="SubmitComplaint" component={SubmitComplaintScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="SecurityDashboard" component={SecurityDashboard} />
        <Stack.Screen name="EstateAdminDashboard" component={EstateAdminDashboard} />
        <Stack.Screen name="CableTV" component={CableTV} />
        <Stack.Screen name="Residents" component={ResidentsScreen} />
        <Stack.Screen name="Visitors" component={VisitorsScreen} />
        <Stack.Screen name="EstateAdminDues" component={EstateAdminDuesScreen} />
        <Stack.Screen name="EstateAdminAnnouncements" component={EstateAdminAnnouncementsScreen} />
        <Stack.Screen name="SecurityAccess" component={SecurityAccessScreen} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
        <Stack.Screen name="ViewComplaints" component={ViewComplaintsScreen} />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}

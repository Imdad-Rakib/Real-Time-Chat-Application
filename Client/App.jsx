import { Provider } from "react-redux";
import store from "./store/index.mjs";
import { useSelector } from "react-redux";
import { Button } from "react-native";
import Login from "./components/views/login";
import SignUp from "./components/views/signUp";
import OTPPage from "./components/views/otpPage";
import AllChats from "./components/views/allChats";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword from "./components/views/forgotPassword";
import ResetPassword from "./components/views/resetPass";
import ResetPassOtp from "./components/views/resetPassOtp";
import Rooms from "./components/views/rooms";
import SearchUser from "./components/controllers/searchUser";
import Inbox from "./components/views/inbox";
import ChatOptions from "./components/views/chatOptions";
import Home from "./components/views/home";
import { io } from 'socket.io-client';


import MyButtonPage from "./components/controllers/test";

const Stack = createNativeStackNavigator();


export default function App() {

  return (

    // <SearchUser/>
    <Provider store = {store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name = 'Home' component={Home}/>
          <Stack.Screen name='test' component={MyButtonPage} />
          {/* <Stack.Screen name='Chats' component={AllChats} /> */}
          <Stack.Screen name = "Search" component={SearchUser} options={{headerShown: false}}/>
          <Stack.Screen name="Inbox" component={Inbox} />
          <Stack.Screen name = "Login" component={Login} />
          <Stack.Screen name = "Chat Options" component={ChatOptions} />
          <Stack.Screen name = "Room" component={Rooms} />
          <Stack.Screen name = "Sign Up" component={SignUp}/>
          <Stack.Screen name = 'Validation' component={OTPPage}/>
          <Stack.Screen name = 'Forgot Password' component={ForgotPassword} />
          <Stack.Screen name = 'Reset Password' component={ResetPassword} /> 
          <Stack.Screen name = 'Password Reset Code' component={ResetPassOtp} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

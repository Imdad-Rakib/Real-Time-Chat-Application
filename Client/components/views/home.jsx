import { View, FlatList, Alert, Text, StyleSheet, TouchableOpacity, Image, Platform, Icon } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
import AllChats from "./allChats";
import ActiveChats from "./activeChats";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const Navbar = () =>{
  return(
    <View style={styles.navbarContainer}>
      <TouchableOpacity>
        <Icon name="chat" size={30} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="people" size={30} color="gray" />
      </TouchableOpacity>
    </View>
  )
}
const Home = () =>{
  return(
    // <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Navbar" component={Navbar} />
        <Drawer.Screen name="Chats" component={AllChats} />
        <Drawer.Screen name="Peoples" component={ActiveChats} />
      </Drawer.Navigator>
    // </NavigationContainer>
  )
}
const styles = StyleSheet.create({
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 12,
    paddingLeft: 70,
    paddingRight: 70,
    flexDirection: 'row',
    justifyContent: "space-between",
    width: '100%',
    ...Platform.select({
        android: {
          elevation: 2.5
        }
    })
  }
})
export default Home
import SendLove from './screens/SendLove.js';
import LoveLetter from './screens/LoveLetter.js';
import Dingolfy from './screens/Dingolfy.js';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const MyTabs = createMaterialTopTabNavigator({
  screens: {
    SendLove: SendLove,
    LoveLetter: LoveLetter,
    Dingolfy: Dingolfy,
  },
});

export default function App() {
    return (
        <MyTabs.Navigator
        screenOptions={{
            tabBarStyle: { backgroundColor: '#B64969' },
            tabBarLabelStyle: { fontSize: 12 },
            tabBarItemStyle: { width: 100 },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'black',
        }}
        >
        <MyTabs.Screen name="Send Love" component={SendLove} />
        <MyTabs.Screen name="Love Letter" component={LoveLetter} />
        <MyTabs.Screen name="Dingolfy" component={Dingolfy} />
        </MyTabs.Navigator>
    );
}

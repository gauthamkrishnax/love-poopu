import { SafeAreaView } from "react-native-safe-area-context"
import * as Animatable from 'react-native-animatable'
import Button from "../../components/Button"
import { auth } from "../../utils/firebaseConfig.js";

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animatable.View animation="fadeIn" duration={1000} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Logout" handlePress={() => auth.signOut()} />
      </Animatable.View>
    </SafeAreaView>
  );
}
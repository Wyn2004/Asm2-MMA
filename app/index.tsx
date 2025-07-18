import { SafeAreaView } from "react-native-safe-area-context";
import { SimpleProductList } from "../screens/SimpleProductList";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SimpleProductList />
    </SafeAreaView>
  );
}

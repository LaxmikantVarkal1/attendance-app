import { View } from "react-native";

export default function Card({showFooter}:{showFooter:boolean}){
    return <View>
        <View>header</View>
        <View>body</View>
        {showFooter && <View></View>}
    </View>
}
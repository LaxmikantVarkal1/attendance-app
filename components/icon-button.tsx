import { TouchableOpacity, useColorScheme } from "react-native";

export default function IconButton({ children, onPress, style, isLabel=true }: any) {
    const theme = useColorScheme() ?? "light"
    const iconWithLabel = {
        flex:1,
        width: 'auto',
        flexDirection:'row',
        gap:10,
        justifyContent: "center", 
        alignItems: 'center',
        height:'100%'
    }
    const withoutLabel = {
        flexDirection:'row',
        gap:10,
        justifyContent: "center", 
        alignItems: 'center',
        height:40,
        width:40,
    }
    return <TouchableOpacity onPress={onPress} style={[isLabel?iconWithLabel:withoutLabel, style]}>
        {children}
    </TouchableOpacity>
}
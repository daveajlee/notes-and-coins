import { Pressable } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

type IconButtonProps = {
    onPress: any;
    iconName: any;
}

export default function IconButton({onPress, iconName}: IconButtonProps) {

    return (
        <Pressable onPress={onPress}><Ionicons name={iconName} size={30} color="black" /></Pressable>
    );
}
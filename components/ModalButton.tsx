import { Pressable } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

type ModalButtonProps = {
    modalVisible: boolean;
    setModalVisible: Function;
    iconName: string;
}

export default function ModalButton({modalVisible, setModalVisible, iconName}: ModalButtonProps) {

    return (
        <Pressable onPress={() => setModalVisible(!modalVisible)}><Ionicons name={iconName} size={30} color="black" /></Pressable>
    );
}
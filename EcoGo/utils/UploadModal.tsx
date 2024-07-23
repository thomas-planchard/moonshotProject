import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {COLORS} from '@/constants/theme.ts';


interface UploadModalProps {
    modalVisible: boolean;
    onRequestClose: () => void;
    onBackPress: () => void;
    onCameraPress: () => void;
    onGalleryPress: () => void;
    isLoading?: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({
    modalVisible,
    onRequestClose,
    onBackPress,
    onCameraPress,
    onGalleryPress,
    isLoading = false,
}) => {
    return (

        <Modal animationType="fade" transparent={true} visible={modalVisible} >
            <Pressable style={styles.container} onPress={onBackPress}>
                {isLoading && <ActivityIndicator size={70} color="#0000ff" />}

                {!isLoading && (
                    <View style={styles.modalView}>
                        <Text style={styles.title}>Profile Photo</Text>
                        <View style={styles.decisionRow}>
                            <TouchableOpacity style={styles.optionBtn} onPress={onCameraPress}>
                                <MaterialIcons name="camera-alt" size={30} color={COLORS.greenForest} />
                                <Text>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionBtn} onPress={onGalleryPress}>
                                <MaterialIcons name="photo-library" size={30} color={COLORS.greenForest} />
                                <Text>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Pressable>
        </Modal>
        
    )
}

export default UploadModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        width: '80%',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    decisionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: wp(10),
    },
    optionBtn: {
        alignItems: 'center',
        backgroundColor: "#e6eae7",
        borderRadius: 10,
        padding: 10,
    },
});
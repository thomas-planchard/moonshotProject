import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SIZES, COLORS } from '@/constants/theme.ts';

const PoliciesContainer = () => {
    return (
        <View style={{marginVertical: hp(2)}}>
            <Text style={{fontSize: hp(2.5), color: COLORS.greenForest, fontWeight: 'bold', marginBottom: hp(2)}}>Policies</Text>
            <TouchableOpacity style={{height: hp(7), flexDirection: 'row', paddingHorizontal: hp(2), backgroundColor: '#F2F2F2', alignItems: 'center', borderRadius: hp(2)}}>
                <Octicons name="law" size={hp(2.7)} color={COLORS.greenForest} />
                <Text style={{fontSize: hp(2), marginLeft: hp(2), color: '#333'}}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{height: hp(7), flexDirection: 'row', paddingHorizontal: hp(2), backgroundColor: '#F2F2F2', alignItems: 'center', borderRadius: hp(2), marginTop: hp(2)}}>
                <Octicons name="shield" size={hp(2.7)} color={COLORS.greenForest} />
                <Text style={{fontSize: hp(2), marginLeft: hp(2), color: '#333'}}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{height: hp(7), flexDirection: 'row', paddingHorizontal: hp(2), backgroundColor: '#F2F2F2', alignItems: 'center', borderRadius: hp(2), marginTop: hp(2)}}>
                <Octicons name="browser" size={hp(2.7)} color={COLORS.greenForest} />
                <Text style={{fontSize: hp(2), marginLeft: hp(2), color: '#333'}}>Cookies Policy</Text>
            </TouchableOpacity>
        </View>
    );
}

export default PoliciesContainer;
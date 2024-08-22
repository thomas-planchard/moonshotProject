import React, { useCallback, useState } from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import CustomKeyboardView from '@/components/common/CustomKeyboardView';
import Header from '@/components/screens/infoUser/header/Header';
import ProfileSection from '@/components/screens/infoUser/profileSection/ProfileSection';
import PersonalInformation from '@/components/screens/infoUser/personalInfo/PersonalInfo';
import PoliciesContainer from '@/components/screens/infoUser/policies/Policies';
import LogoutButton from '@/components/screens/infoUser/logoutButton/LogoutButton';

const InfoUser: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <CustomKeyboardView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: COLORS.greenWhite }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{ paddingTop: 50, paddingHorizontal: 20, backgroundColor: COLORS.greenWhite }}>
          <Header />
          <ProfileSection />
          <PersonalInformation />
          <PoliciesContainer />
          <LogoutButton />
        </View>
      </ScrollView>
    </CustomKeyboardView>
  );
};

export default InfoUser;
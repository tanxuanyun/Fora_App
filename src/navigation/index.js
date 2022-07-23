import React, { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';

import { NavigationContainer } from '@react-navigation/native';

import Main from './MainStack';
import Auth from './AuthStack';
import Loading from '../screens/Loading';

const Navigation = ({linking}) => {
	const auth = useContext(AuthContext);
	const user = auth.user;
	return (
		<NavigationContainer linking = {linking}>
			{user == null && <Loading />}
			{user == false && <Auth />}
			{user == true && <Main />}
		</NavigationContainer>
	);
};

export default Navigation;
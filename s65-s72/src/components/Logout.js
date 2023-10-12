import {useUser} from '../contexts/UserContext';
import {useNavigate, Navigate} from 'react-router-dom';

function Logout() {
	const { logout } = useUser();
	const navigate = useNavigate();

	const logoutUser = () => {
		logout();
		navigate('/');
	}

	return (
		<Navigate to='/login' />
	)
} 

export default Logout;
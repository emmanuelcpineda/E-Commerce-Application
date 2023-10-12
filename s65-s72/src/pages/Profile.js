import { useEffect, useState } from 'react';
import avatar from '../images/avatar.png';
import '../styles/components/Profile.css';

function Profile() {
	const userId = localStorage.getItem('userId');
	const token = localStorage.getItem('token');
	const [userInfo, setUserInfo] = useState('');
	//console.log(token)
 
	const fetchUser = async() => {
		try{
			const response = await fetch(`${process.env.REACT_APP_API_URL}/users/info/${userId}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			if(response) {
				const userData = await response.json();

				setUserInfo(userData);
				//console.log(userData);
			}

		} catch(error) {
			console.warn('Failed. An Error Occured.');
		}
	}

	useEffect( () => {
		if(token !== "undefined") {
			fetchUser();
		}
	});

	return (
	<div className="profile">
      <div className="profile-banner">
        <h2 className="banner">Profile Banner</h2>
      </div>
      <img className="profile-avatar" src={avatar} alt="User Avatar" />
      <div className="profile-info">
        <div className="profile-name">{userInfo.name}</div>
        <div className="profile-contact">
          <p><em>{userInfo.email}</em></p>
        </div>
      </div>
    </div>
	)
}

export default Profile;
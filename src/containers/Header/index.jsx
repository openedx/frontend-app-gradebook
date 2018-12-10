import { connect } from 'react-redux';
import { fetchUserProfile } from '@edx/frontend-auth';

import Header from '../../components/Header';

const mapStateToProps = state => ({
  username: state.userProfile.username,
  userProfileImageUrl: state.userProfile.userProfileImageUrl,
});

export default connect(mapStateToProps)(Header);

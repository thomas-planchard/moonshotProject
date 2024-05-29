import {Image} from 'react-native';

export const ProfilImage = ({ imageState, source, style, setImageState }) => {
    return (
        <Image source={{ uri: imageState ? source : 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg' }} style={style} onLoadEnd={() => setImageState(true)}
        />
    );
}

{/* <Image

source={{ uri: imageLoaded ? user?.profileImageUrl : 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg' }}

onLoadEnd={() => setImageLoaded(true)}

style={styles.profileImage}

/> */}
import firebase from 'firebase/app';
import 'firebase/database';

try {
  const config = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASEURL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID
  };
  firebase.initializeApp(config);
} catch (error) {
  console.log(error);
}

function addMessege({ lat, lng, username, message }) {
  const locationId = getLocationId({ lat, lng });
  firebase
    .database()
    .ref(`messages/${locationId}/posts`)
    .push({
      date: Date.now(),
      username: username,
      lattitude: lat,
      longitude: lng,
      content: message
    });
}

function getLocationId({ lat, lng }) {
  return `${(lat * 10).toFixed()}_${(lng * 10).toFixed()}`;
}

function subscribe({ lat, lng }, cb) {
  const locationId = getLocationId({ lat, lng });
  const ref = firebase.database().ref(`messages/${locationId}/posts`);
  ref.on('value', onValueChange =>
    cb(
      Object.entries(onValueChange.val() || {}).map(([id, data]) => ({
        id,
        ...data
      }))
    )
  );
  return () => ref.off('value', cb);
}

export { addMessege, subscribe };

import { firebase } from '../../FirebaseConfig'; // Adjust the import based on your setup
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const uploadImage = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase.storage().ref().child(`screenshots/${userId}/${new Date().toISOString()}.png`);
    return ref.put(blob).then(() => {
        return ref.getDownloadURL(); // Get the download URL of the uploaded image
    });
};

const takeScreenshotAndUpload = async (userId) => {
    // Assuming you have a way to take a screenshot, such as using `react-native-view-shot`
    // For example, after capturing the screenshot, call this:
    const screenshotUri = await captureScreenshot(); // Your screenshot capturing logic
    const downloadUrl = await uploadImage(screenshotUri, userId);
    
    // Optionally, save the URL to Firestore
    await saveImageUrlToFirestore(userId, downloadUrl);
};

const saveImageUrlToFirestore = async (userId, downloadUrl) => {
    const db = firebase.firestore();
    await db.collection('users').doc(userId).collection('images').add({ url: downloadUrl });
};

export { takeScreenshotAndUpload };

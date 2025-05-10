import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const getGoogleAuthRequest = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '892898293705-bbr3l3ajmuueuaajm1saevj9ivgufuvl.apps.googleusercontent.com',
    androidClientId: '892898293705-bbr3l3ajmuueuaajm1saevj9ivgufuvl.apps.googleusercontent.com',
    iosClientId: '470692047922-e7212uigl7q197g6p64dlephc5qc8uos.apps.googleusercontent.com'
});

  return { request, response, promptAsync };
};


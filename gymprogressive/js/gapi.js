// +%+%+%+%+%+%+%+%+%+%+%+%+%+%+%+%+%+%+%+%+%+%+% 
// асинхронная функция для запроса данных профиля
//
const getUserProfileData = async (accessToken) => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`)
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers
    })
    const data = await response.json();
    return data;
}
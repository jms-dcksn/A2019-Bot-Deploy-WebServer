const axios = require('axios')

const auth = async (url, userName, password) => {
  url = url + 'v1/authentication'
  try{
  const { data } = await axios(
    {
      method: 'post',
      url: url,
      data: {
        username: userName,
        password: password
      },
      headers : {
        "Content-Type": "application/json",
      }
    });
    if(data.message){
      const message = data.message
      return [message, undefined]
    }
    const token = data.token
    return [undefined, token]
  } catch (error) {
    return [error.response.data.message, undefined]
  }
}
module.exports = auth
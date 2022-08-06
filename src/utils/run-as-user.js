const axios = require('axios')

//Return the run as user ID to be used in the bot deployment API

const runAsUser = async (url, token, userName) => {
  url = url + 'v1/devices/runasusers/list'
  try{
  const { data } = await axios(
    {
      method: 'post',
      url: url,
      data: {
        //json body to filter based on user name provided
          'sort':[
              {
                'field':'username',
                'direction':'asc'
              }
          ],
          'filter':{
              'operator': 'eq',
              'field': 'username',
              'value': userName
          },
          'fields':[],
          'page':{
              'length':1,
              'offset':0
          }
        },
      headers : {
        "Content-Type": "application/json",
        "X-Authorization": token
      }
    });
    if(data.message){
      const message = data.message
      return ["Username search failed. " + message, undefined]
    }
    if(data.list.length===0){
      return ["Username not found. ", undefined]
    }
    const userId = data.list[0].id
    return [undefined, userId]
  } catch (error) {
      return ["Username search failed. " + error.response.data.message, undefined]
    
  }
}

module.exports = runAsUser

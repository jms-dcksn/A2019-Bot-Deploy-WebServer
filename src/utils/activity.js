const axios = require('axios')

const activityList = async (url, token, deploymentId) => {
    url = url + 'v2/activity/list'
    try{
        const { data } = await axios(
        {
            method: 'post',
            url: url,
            data: {
                    'filter': {
                        'operator': 'eq',
                        'field': 'deploymentId',
                        'value': deploymentId
                    }
                },
            headers : {
                "Content-Type": "application/json",
                "X-Authorization": token
            }
        });
        if(data.message){
            const message = "Activity search failed. " + data.message
            return [message, undefined]
        }
        if(data.list.length===0){
            return ["Deployment ID was not found.", undefined]
        }
        const status = data.list[0].status
        const botOutput = data.list[0].botOutVariables
        return [undefined, status, botOutput]
    } catch (error) {
        return ["Activity Search Failed. " + error.response.data.message, undefined]
    }
}

module.exports = activityList
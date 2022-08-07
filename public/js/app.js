const runBotForm = document.querySelector('#runBot')
const crUrlInput = document.querySelector('#Url')
const userNameInput = document.querySelector('#userName')
const apiKeyInput = document.querySelector('#key')
const botId = document.querySelector('#botId')
const runnerInput = document.querySelector('#runner')
const poolInput = document.querySelector('#pool')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const messageThree = document.querySelector('#message-3')
const messageJson = document.querySelector('#message-json')
const messageCode = document.querySelector('#message-code')
const generateJSON = document.querySelector('#createJSONBody')
const urlInfo = document.querySelector('#urlInfo')

let callbackUrl = window.location.protocol + "//" + window.location.host + "/response"

urlInfo.textContent = "curl -d '<json-payload-see-below>' -H \"Content-Type: application/json\" -X POST " + window.location.protocol + "//" + window.location.host + "/webhook"

runBotForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const crUrl = crUrlInput.value
    const userName = userNameInput.value
    const bot = botId.value
    const apiKey = apiKeyInput.value
    const runner = runnerInput.value
    const poolId = poolInput.value

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''
    messageThree.textContent = ''

    console.log(callbackUrl)

    fetch('/run?crUrl=' + encodeURIComponent(crUrl) + '&userName=' + encodeURIComponent(userName) + '&apiKey=' + encodeURIComponent(apiKey) + '&runner=' + encodeURIComponent(runner) + '&poolId=' + poolId + '&bot=' + encodeURIComponent(bot) + '&callbackInfo=' + callbackUrl)
    .then((response) => {
        response.json().then((data) => {
            if(data.error){
                messageOne.textContent = data.error
                
            } else{
            messageOne.textContent = data.message
            messageTwo.textContent = 'Deployment ID: ' + data.deploymentId
        }
        })
    })
})

generateJSON.addEventListener('click', (e) => {
    e.preventDefault()

    const crUrl = crUrlInput.value
    const userName = userNameInput.value
    const bot = botId.value
    const apiKey = apiKeyInput.value
    const runner = runnerInput.value
    const poolId = poolInput.value

    //console.log('JSON payload generated')
    messageJson.textContent = 'JSON Payload to include in webhook POST request:'
    messageCode.textContent = '{\n\t"controlRoomUrl": "' + crUrl + '",\n\t"userName": "' + userName + '",\n\t"password": "<your_password>",\n\t"runAsUser": "' + runner + '",\n\t"poolId": ' + poolId + ',\n\t"botId": ' + bot + '\n}'
})
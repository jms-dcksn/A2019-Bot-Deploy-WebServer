const runBotForm = document.querySelector('#bot')
const crUrlInput = document.querySelector('#Url')
const userNameInput = document.querySelector('#userName')
const apiKeyInput = document.querySelector('#key')
const botInput = document.querySelector('#botName')
const runnerInput = document.querySelector('#runner')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const messageThree = document.querySelector('#message-3')

runBotForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const crUrl = crUrlInput.value
    const userName = userNameInput.value
    const bot = botInput.value
    const apiKey = apiKeyInput.value
    const runner = runnerInput.value

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''
    messageThree.textContent = ''

    fetch('/run?crUrl=' + encodeURIComponent(crUrl) + '&userName=' + encodeURIComponent(userName) + '&apiKey=' + encodeURIComponent(apiKey) + '&runner=' + encodeURIComponent(runner) + '&bot=' + encodeURIComponent(bot)).then((response) => {
        response.json().then((data) => {
            if(data.error){
                messageOne.textContent = data.error
                
            } else{
            messageOne.textContent = 'Deployment ID: ' + data.deploymentId
            messageTwo.textContent = 'Bot has been deployed!'
            
        }
        })
    })
})
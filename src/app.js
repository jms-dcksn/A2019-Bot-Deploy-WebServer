const path = require('path')
const express = require('express')
const hbs = require('hbs')
const auth = require('./utils/auth')
const bot = require('./utils/bot')
const botDeploy = require('./utils/bot-deploy')
const runAsUser = require('./utils/run-as-user')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectory))

//Configure Express to use body-parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('', (req, res) => {
    res.render('index', {
        title: 'A360 Bot Deploy App',
        name: 'Thinking makes it so.'
    })
})

//Endpoint that will be called by client-side javascript upon clicking Run Bot button
app.get('/run', async (req, res) => {
    if(!req.query.crUrl){
        return res.send({
            error: 'You must provide values for all inputs'
        })
    }
    //ensure url ends with a '/'
    let newURL = req.query.crUrl
    if(!newURL.endsWith('/')){
        newURL += '/'
    }
//Code to make API calls to A2019 CR
    const [tokenError, token] = await auth(newURL, req.query.userName, req.query.apiKey)
    if(tokenError){ return res.send({ error: tokenError }) }   

    const [userError, userId] = await runAsUser(newURL, token, req.query.runner)
    if(userError){ return res.send({ error: userError }) }
                
    const [deployError, deploymentId] = await botDeploy(newURL, token, req.query.bot, userId, req.query.poolId, {}, {})
    if(deployError){ return res.send({ error: deployError }) }

    res.send({
        message: "The deployment request was made successfully. If the bot does not deploy, please check the Control Room Audit Logs for details.",
        deploymentId: deploymentId
    })
})

//Generic webhook endpoint with JSON body to define deployment params
    app.post('/webhook', async (req, res) => {
        let controlRoomUrl = req.body.controlRoomUrl
        if ( !controlRoomUrl.endsWith('/') ) {
            controlRoomUrl += '/'
        }
        const [tokenError, token] = await auth(controlRoomUrl, req.body.userName, req.body.password)
        if(tokenError){ res.send({
                error: tokenError
            })
        }
    
        const [userError, userId] = await runAsUser(controlRoomUrl, token, req.body.runAsUser)
        if(userError){ res.send({
                error: userError
            })
        }
    
        const [deployError, deploymentId] = await botDeploy(controlRoomUrl, token, req.body.botId, userId, req.body.poolId, req.body.botInput, req.body.callbackInfo)
        if(deployError){ res.send({
            error: deployError
        })
    }
                    
        res.send({
                    message: "The deployment request was made successfully. If the bot does not deploy, please check the Control Room Audit Logs for details.",
                    deploymentId: deploymentId,
                    callbackInfo: req.body.callbackInfo
                })
});

app.post('/response', (req, res) => {
    console.log('Bot Output: '+req.body.botOutput)
    console.log('Bot run status: '+req.body.status)
})

app.listen(port, () => {
    console.log('Server is up on port '+port)
})
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

app.get('', (req, res) => {
    res.render('index', {
        title: 'A2019 Bot Deploy App',
        name: 'James Dickson'
    })
})

//Endpoint that will be called by client-side javascript upon clicking Run Bot button
app.get('/run', (req, res) => {
    if(!req.query.crUrl){
        return res.send({
            error: 'You must provide values for all inputs'
        })
    }
    if(req.query.crUrl.endsWith('/')){
        var newURL = req.query.crUrl.substring(0, req.query.crUrl.length-1)
      } else {
        var newURL = req.query.crUrl
      }
//Code to make API calls to A2019 CR
    auth(newURL, req.query.userName, req.query.apiKey, (error, {token}={}) => {
        if (error){
            return res.send({
                error: error
            })
        }
        
        runAsUser(newURL, token, req.query.runner, (error, {userId, device}={}) => {
            if(error){
                return res.send({
                    error: error
                })
            }
                
            bot(newURL, token, req.query.bot, (error, {botId}={}) => {
                if (error){
                    return res.send({error: error})
                }
    
                botDeploy(newURL, token, botId, userId, (error, {deploymentId}={}) => {
                    if(error){
                        return res.send({error: error})
                    }
                    res.send({
                        deploymentId: deploymentId
                    })
                })
            })
        })
    })
})



app.listen(port, () => {
    console.log('Server is up on port '+port)
})
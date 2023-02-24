const route = require('express').Router()

route.get('/' , (req,res) => {
 res.send('Server Runing')
})

module.exports = route
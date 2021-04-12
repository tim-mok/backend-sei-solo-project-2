const axios = require('axios')
const models = require('../models')
const searchURL = 'https://newsapi.org/v2/everything?q='
const headlinesURL = 'https://newsapi.org/v2/top-headlines?country='


const newsControllers = {}

newsControllers.topHeadlines = async (req, res) => {
    try {
        const user = await models.user.findOne({
            where: {
                id: req.headers.authorization
            }
        })
        console.log(user)
        const country = await user.getCountry()
        console.log(country)
        const code = country.code
        console.log(code)

        const response = await axios.get(`${headlinesURL}${code}${process.env.APIKEY}`)

        res.send(response.data)
        

    } catch (error) {
        res.status(404)
        res.json({error})
    }
}

newsControllers.searchNews = async (req, res) => {
    try {
        const searchInput = req.body.search

        const response = await axios.get(`${searchURL}${searchInput}${process.env.APIKEY}`)

        res.send(response.data)

    } catch (error) {
        res.status(400)
        res.json({error})
    }
}


module.exports = newsControllers
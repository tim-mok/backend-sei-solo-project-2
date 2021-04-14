const axios = require('axios')
const models = require('../models')
const searchURL = 'https://newsapi.org/v2/everything?q='
const headlinesURL = 'https://newsapi.org/v2/top-headlines?country='
const jwt = require('jsonwebtoken')

const newsControllers = {}

newsControllers.topHeadlines = async (req, res) => {
    try {
        const decryptedId = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)

        const user = await models.user.findOne({
            where: {
                id: decryptedId.userId
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

newsControllers.saveArticle = async (req, res) => {
    try {
        const decryptedId = jwt.verify(req.body.id, process.env.JWT_SECRET)

        const user = await models.user.findOne({
            where: {
                id: decryptedId.userId
            }
        })
        console.log(user)

        const article = await models.article.findOrCreate({
            where: {
                title: req.body.title,
                url: req.body.url,
                image: req.body.image
            }
        })
        console.log(article[0])
        const saved = await user.addArticle(article[0])
        console.log(saved)

    } catch (error) {
        res.status(400)
        res.json({error})
    }
}

newsControllers.removeArticle = async (req, res) => {
    try {
        const decryptedId = jwt.verify(req.body.id, process.env.JWT_SECRET)

        const user = await models.user.findOne({
            where: {
                id: decryptedId.userId
            }
        })

        const article = await models.article.findOne({
            where: {
                title: req.body.title,
                url: req.body.url,
                image: req.body.image
            }
        })

        const removeSaved = await user.removeArticle(article)

        res.json(removeSaved)
    } catch (error) {
        res.status(400)
        res.json({error})
    }
}


module.exports = newsControllers
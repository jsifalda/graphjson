const bodyParser = require('body-parser')

const middleware = (resolvers = {}, context) => {
  return [
    bodyParser.json(),
    (req, res, next) => {
      const { operation } = req.body
      if (!resolvers[operation]) {
        return res.status(400).json({
          error: 'not supported operation'
        })
      }

      req.$resolver = resolvers[operation]
      next()
    },
    async (req, res) => {
      const { params = {}, operation } = req.body

      try {
        const result = await req.$resolver({ params, headers: req.headers }, context)
        res.json({
          [operation]: result
        })
      } catch (e) {
        console.warn('Resolver error:', e)

        res.json({
          error: {
            type: e.type,
            message: e.message
          }
        })
      }
    }
  ]
}

module.exports = {
  middleware
}

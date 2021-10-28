const validateField = require('./validateFields')
const validateJWT = require('./validateJWT')
const validateRole = require('./validateRole')

module.exports = { ...validateField, ...validateJWT, ...validateRole }

const { json } = require('express');
const jwt = require('jsonwebtoken');
const jwtSecret = "mysecrettoken"

module.exports = function (req, res, next) {

    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({ message: 'Invalid token' });  

    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.user = decoded.user
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Invalid token' });  
    }
}
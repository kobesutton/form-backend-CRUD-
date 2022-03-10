const User = require('../modelSchema/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

var jwtSecret = "mysecrettoken"

const signUp = async (req, res) => {

  const {name, email, password} = req.body

  try {

    let user = await User.findOne({ email })
    if(user) return res.status(400).send({ error: 'User already exists' }) 
    user = new User({name, email, password})
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()

    const payload = {
      user: {
        id: user.id,
      }
    }

    jwt.sign(payload, jwtSecret, {expiresIn: 108000}, (err, token ) => {
      if(err) throw err 
      res.json({ success: true, token: token })
    })

  } catch (error) {
      console.error(error)
      res.status(500).send({ error: "server error"})
  } 
}

const login = async (req, res) => {

    const { email, password } = req.body

    try {
      const user = await User.findOne({ email })
      if(!user) return res.status(400).json({error: 'User not found'})
  
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch) return res.status(400).json({error: 'Invalid User'})
  
      const payload = {
        user: {
          id: user.id,
        }
      }
  
      jwt.sign(payload, jwtSecret, {expiresIn: "5 days"}, (err, token ) => {
        if(err) throw err 
        res.json({ token })
      })
      
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: 'Server Error'})
    }
}

  const updateUser = async (req, res) => {
      try {
       const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body)
       console.log(updatedUser)
       if(!updatedUser) return res.status(400).send('User cannot be updated!')
       await updatedUser.save()
       res.json(updatedUser)
      } catch (error) {
        res.status(500).send({error: 'Server Error'})
      }
  }

  const getExistingUser = async (req, res) => {
    try {
      const user = await User.findOne(req.params.id, req.body).select('-password')
      console.log(user)
      if(!user) return res.status(400).send({error: 'User not found'});
      res.json(user)
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: "server error"})
    }
  }

  const findUserById = async (req, res) => {
    
    try {
      const user = await User.find({_id: req.params.id, body: req.body})
      console.log(user)
      if(!user) return res.status(400).send({error: 'User not found'});
      res.json(user)
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: "server error"}) 
    }
  }

module.exports = { signUp, updateUser, getExistingUser, login, findUserById }
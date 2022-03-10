const express = require('express');
const { check } = require('express-validator')
const { signUp, updateUser, getExistingUser, login, findUserById } = require('../controllers/users');
const auth = require('../middleware/auth')
const router = express.Router();

router.post('/', [
    check('name', 'Please enter a name').not().isEmpty(),
    check('email', 'Please enter a email').isEmail(),
    check('password', 'Please enter a password longer than 6 or more characters').isLength({ minLength: 6})
], signUp)

router.post('/auth', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a valid password').exists()
], login)
router.get('/auth', auth, getExistingUser)
router.get('/auth/:id', auth, findUserById)

router.put('/update/:id', updateUser)

module.exports = router;
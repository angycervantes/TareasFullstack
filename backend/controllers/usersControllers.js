const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')


const registerUser = asyncHandler( async (req, res) =>{
    const{ name, email, password } = req.body /* destructurando lo que viene en el body */

    if (!name || !email || !password){
        res.status(400)
        throw new Error('Faltan datos')
    }

    //verificar si el usuario existe
    const userExists = await User.findOne({email})
    if (userExists){
        throw new Error('Ese Usuario ya existe, favor de verificar')
    }

    //Hash al password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //crear el usuario
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    // Si se pudo crear el usuario lo muestra en la respuesta
    // en caso contrario lanza un error
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    }else{
        res.status(400)
        throw new Error('No se pudo crear al usuario')
    }
})

const loginUser = asyncHandler( async (req, res) =>{
    const { email, password } = req.body

    //verificamos que el usuario exista
    const user = await User.findOne({ email })

    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
    })} else {
        res.status(400)
        throw new Error('credenciales incorrectas')
    }

    res.json({message:'login usuario'})
})

const getUserData = asyncHandler( async (req, res) =>{
    res.json(req.user)
})

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '30m'
    })
}
module.exports = {
    registerUser,
    loginUser,
    getUserData,
    generateToken
}
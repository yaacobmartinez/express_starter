const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Activity = require('../models/activityLogs')

exports.getAll = async function(req, res){
    try {
        const users = await User.publicUser.find()
        setLog(res._id, 'Query Users', req.ip)
        res.json(users);
        
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

exports.register = async function(req, res){
    const userExists = await User.authUser.findOne({username : req.body.username})
    if(userExists){return res.status(500).json({success: false, message: `Username ${req.body.username} already exists` })}
    const user = new User.authUser({
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        username : req.body.username,
        password : bcrypt.hashSync(req.body.password, 10)
    })
    try {
        const newUser = await user.save()
        setLog(newUser._id, `Registered New User`, req.ip)
        res.json({success: true, message: `User saved with id ${newUser._id}`})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}
exports.getUser = async function(req, res){
    setLog(res._id, `Searched for User ${res.user.username}`)
    res.json(res.user)
}

exports.deleteUser = async function(req, res){
    try {
        await res.user.remove()
        setLog(res._id, `Deleted User with Username ${res.user.username} and ID ${res.user._id}`, req.ip)
        res.json({success: true, message: `User ${res.user.username} Removed`})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

exports.updateUser = async function(req, res){
    const currentUser = await User.publicUser.findById(req.params.id)
    const newUsername = await User.publicUser.findOne({username : req.body.username})
    if(currentUser.username != req.body.username){
        if(newUsername) return res.status(500).json({success:false, message: `Username ${req.body.username} already exists. Please try a different username`})
    }
    if(req.body.first_name != null){ res.user.first_name = req.body.first_name }
    if(req.body.last_name != null){ res.user.last_name = req.body.last_name }
    if(req.body.username != null){ res.user.username = req.body.username }
    if(req.body.password != null){ res.user.password = bcrypt.hashSync(req.body.password) }
    try {
        const updatedUser = await res.user.save();
        setLog(res._id, `Update User with Username ${res.user.username} and ID ${res.user._id}`, req.ip)
        res.json({success: true, message: `User ${res.user.username} updated`})
    } catch (error) {
        res.json(500).json({success:false, message: `Uh oh, something wrong happened.`})
    }
}

exports.loginUser = async function(req, res){
    const user = await User.authUser.findOne({username : req.body.username})
    if(!user) return res.status(500).json({success: false, message: `We cannot find a user with that username`})
    
    const isCorrectPassword = await bcrypt.compare(req.body.password, user.password)
    if(!isCorrectPassword) return res.status(500).json({success: false, message: `Your password is invalid.`})
    
    const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn : 86400})
    setLog(user._id, 'User Login', req.ip)
    return res.json({success: true, message: `Login Successful`, token: token})
}

exports.me = async function(req, res){
    const user = await User.publicUser.findById(res._id)
    res.json(user)
}

exports.getUserById = async function(req, res, next){
    try {
     user = await User.publicUser.findById(req.params.id)
     if(user == null){ return res.status(404).json({success: false, message: 'User Not Found'})}   
    } catch (error) {
        return res.status(500).json({success: false, message: 'User not Found'})
    }
    res.user = user
    next()
}

async function setLog(userId, activity, userIp){
    const log = new Activity({
        user : userId,
        IP : userIp,
        object: `User`,
        activity: activity
    })
    const recordLog = await log.save()
}
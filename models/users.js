const express = require('express')
const mongoose = require('mongoose')

const authenticatedUser = new mongoose.Schema({
    first_name : {
        type: String,
        required: [true, 'First Name is Required.'],
        min: 2, 
        max: 30
    },
    last_name: {
        type: String,
        required: [true, 'First Name is Required.'],
        min: 2, 
        max: 30
    },
    username: {
        type: String, 
        required: [true, 'What should we call you?'],
        min: [8, 'Username must be 8-15 characters long'],
        max: [15, 'Username must be 8-15 characters long'],
    },
    password:{
        type: String, 
        required: [true, 'A password will make sure we can secure your account.'],
        min: [8, 'Password must be 8-15 characters long'],
        max: [15, 'Password must be 8-15 characters long'],
    },
    date_created: {
        type: Date,
        required: true, 
        default: Date.now
    }
})

const unauthenticatedUser = new mongoose.Schema({
    first_name : {
        type: String,
        required: [true, 'First Name is Required.'],
        min: 2, 
        max: 30
    },
    last_name: {
        type: String,
        required: [true, 'First Name is Required.'],
        min: 2, 
        max: 30
    },
    username: {
        type: String, 
        required: [true, 'What should we call you?'],
        min: [8, 'Username must be 8-15 characters long'],
        max: [15, 'Username must be 8-15 characters long'],
    },
    password:{
        type: String, 
        required: [true, 'A password will make sure we can secure your account.'],
        min: [8, 'Password must be 8-15 characters long'],
        max: [15, 'Password must be 8-15 characters long'],
        select: false
    },
    date_created: {
        type: Date,
        required: true, 
        default: Date.now,
        select: false
    }
})

const authUser = mongoose.model('authUser', authenticatedUser, 'users' );
const publicUser = mongoose.model('publicUser', unauthenticatedUser, 'users' );

module.exports = {
    authUser:authUser,
    publicUser:publicUser
}
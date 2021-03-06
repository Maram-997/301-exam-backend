'use strict';
 
const express = require('express')
const server = express();
const axios = require('axios')
require('dotenv').config()
const cors = require('cors')
server.use(cors())
server.use(express.json())
const mongoose = require('mongoose');
const PORT =  process.env.PORT
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology: true});

const colorSchema = mongoose.Schema({
    title:String,
    imageUrl:String
})

const userSchema = mongoose.Schema({
    email:String,
    colors:[colorSchema]
})

const userModel = mongoose.model('colors', userSchema)

function seedColloection () {
let maram = new userModel({
    email:'maramabumurad97@gmail.com',
    colors:[{
        title:'Black',
        imageUrl: "http://www.colourlovers.com/img/000000/100/100/Black.png"
    }]
})

let razan  = new userModel({
    email:'quraanrazan282@gmail.com',
    colors:[{
        title:'Black',
        imageUrl: "http://www.colourlovers.com/img/000000/100/100/Black.png"
    }]
})

maram.save()
razan.save()
 } 

//  seedColloection();
 
class ColorsClass{
    constructor(title,imageUrl){
        this.title= title,
        this.imageUrl =imageUrl
    }
}

server.get('/colors', async (req, res)=>{
    let url = 'https://ltuc-asac-api.herokuapp.com/allColorData'
    let result = await axios.get(url)
    console.log(result)
    let apiData = result.data.map (element =>{
        return new ColorsClass ( element.title, element.imageUrl)
    })
    res.send(apiData)
})
//////////////////////////////////////////////////
server.post('/addtofav', (req,res)=>{
    let email = req.query.email
    const {title,imageUrl} = req.body
userModel.find({email:email}, (error, data)=>{
    if (error){
        res.send(error)
    }else{
        data[0].colors.push({
            title:title,
            imageUrl:imageUrl
        })
        data[0].save();
        res.send(data[0].colors)
    }
})
})
///////////////////////////////////////////////////////
server.get('/favs', (req,res)=>{
let email = req.query.email
userModel.find({email:email},(error, data)=>{
    if (error){
        res.send(error)
    }else{
res.send(data[0].colors)    
}
})
})
////////////////////////////////////////

server.delete('/deleteColor/:idx', (req, res)=>{
    let email = req.query.email
    let index = Number(req.params.idx)
    console.log(email, '---', index);
    userModel.find({email:email}, (error, data)=>{
        if (error){
            res.send(error)
        } else {
            let filtered = data[0].colors.filter((element, elementIdx) =>{
                if (elementIdx !== index){return element}
            })
            data[0].colors = filtered
            data[0].save();
            res.send(data[0].colors)
        }
    })
})
/////////////////////////////////////////////////////////
server.put('/updatecolor/:idx',(req, res)=>{
    let email = req.query.email
    let index = req.params.idx
    const {title,imageUrl} = req.body
    userModel.find({email:email}, (error, data)=>{
        if (error){
            res.send(error)
        }else{
            data[0].colors.splice(index,1,{
                title:title,
                imageUrl:imageUrl

            })
            data[0].save()
            res.send(data[0].colors)
        }
    })
})




server.listen(PORT, console.log(`listening on Port ${PORT}`) )
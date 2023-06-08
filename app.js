const express = require('express')
const app = express()
const { db } = require('./mongoose.js')
const {User} = require('./models.js')
const {Questions} = require('./models.js')
const {logger} = require('./middleware')
const {register} = require('./middleware.js')

app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Login Server

app.post('/user/login',(req,res) => {
    const {username,password} = req.body
    const log = async()=>{
        try{
            const val = await User.find({Username:username})
            if(val.length===0){
                res.send('Invalid Username')
                return
            }else{
                const val2 = val[0].Password
                if(val2===password){
                    res.json(1)
                    return
                }else{
                    res.send('Invalid Password')
                }
            }
        }catch(err){
            res.send(err)
        }
    }
    log()
})
// app.listen(5000)

// Register Server

app.post('/user/register',register,async (req,res)=>{
    const{username,password,confirmpassword,email,usertype,department}=req.body
    const add = new User({
        Username : username,
        Password : password,
        ConfirmPassword : confirmpassword,
        Email : email,
        UserType : usertype,
        Department : department
    })
    await add.save()
    res.send('Registration Successful')
})
// app.listen(5000)

// Account Deletion Server

app.post('/user/deleter',(req,res)=>{
    const{username,password}=req.body
    const del = async()=>{
        try{
            const val = await User.find({Username:username})
            if(val.length===0){
                res.send('Invalid Username')
                return
            }else{
                const upassword = val[0].Password
                if(upassword==password){
                    const delf = await User.remove({Username:val[0].Username})
                    if(delf.deletedCount===1){
                        res.send('Account Deleted Suucessfully')
                        return
                    }
                }else{
                    res.send('Invalid Password')
                    return
                }
            }
        }catch(err){
            res.send(err)
        }
    }
    del()
})
// app.listen(5000)

// To add Questions by Admin Server

app.post('/admin/questionpost',logger,(req,res)=>{
    const{arr,lvalue}=req.body
    arr.map(async(q)=>{
        try{
            const{question,options,correctanswer}=q
            const add = new Questions({
                Questions : question,
                Options : options,
                CorrectAnswer : correctanswer
            })
            await add.save()
        }catch(err){
            res.send(err)
            return
        }
    })
    res.send('Questions Added Successfully.......')
})
// app.listen(5000)

// Take Test - First Server

app.get('/user/taketest1',logger,(req,res)=>{
    Questions.aggregate().sample(1)
    .then((value) => {
        res.send(value)
    }).catch((reason) => {
        console.log(reason)
    })
})
app.listen(5000)

// Take Test - Continous Server

app.post('/user/nextq',async(req,res)=>{
    // console.log('hi')
    const{arr,ID}=req.body
    const index = arr.indexOf(ID)
    let flag = 0
    if(index<=arr.length-2){
        console.log('hii')
        const index1 = arr.indexOf(ID)+1
        const data = await Questions.find({_id:arr[index1]})
        res.send(data)
        return
    }else if(index==arr.length-1){
        console.log('hi')
        while(flag===0){
            try{
                await Questions.aggregate().sample(1)
                .then((value) => {
                    if(arr.findIndex((a) => a == value[0]._id) == -1){
                        arr.push(value[0]._id)
                        res.send(value)
                        flag = 1
                        return
                    }
                }).catch((reason) => {
                    res.send(reason)
                    return
                })
            }catch(err){
                res.send(err)
            }
        }
    }
})
// app.listen(5000)

// Previous Question Server

app.post('/user/prevq',(req,res)=>{
    const{arr,id}=req.body
    const index = arr.indexOf(id) 
    if(index>0){
        const ID = arr[index-1]
        const val = async()=>{
            try{
                const qid = await Questions.find({_id:ID})
                res.send(qid)
                return
            }catch(err){
                res.send(err)
                return
            } 
        }
        val()
    }else if(index==0){
        res.send('No Previous Questions')
    }
})

app.post('/user/result',(req,res)=>{
    const{arr} = req.body
    let countsd = 0;
    let count=0;
    arr.map(async(q)=>{
        try{
                const{qid,up} = q
                let ID = await Questions.find({_id:qid})
                console.log(ID[0].CorrectAnswer,up)
                if(ID[0].CorrectAnswer===up){
                    countsd++
                }
                count++;
                if(count===arr.length){
                    res.send({countsd})
                    return
                }
        }catch(err){
            res.send(err)
            return
        }
    })
    // res.send({countsd})
})


app.listen(3000, ()=>{
    console.log('Server is Listening to Port Number 3000....')
})



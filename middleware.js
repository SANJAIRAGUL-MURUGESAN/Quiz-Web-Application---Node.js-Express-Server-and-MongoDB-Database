const { db } = require('./mongoose.js')
const {User} = require('./models.js')
const {Questions} = require('./models.js')


// Register middleware


function checkpassword(password,confirmpassword){
    return new Promise((resolve,reject) => {
        if(password!==confirmpassword){
            reject('password and confirmpassword mismatch')
        }else{
            resolve('Valid password ')
        }
    })
}

const register = (req,res,next) => {
    const check = async() => {
        const{username,password,confirmpassword,email,usertype,department} = req.body
        try{
            const val1 = await checkpassword(password,confirmpassword)
            const val = await User.find({Username:username})
            if(val.length!==0){
                res.send('Username already exists')
            }else{
                next()
            }
        }catch(error){
            res.send(error)
        }
    }
    check()
}

// login middleware

const logger = (req,res,next)=>{
    const {arr,lvalue} = req.body
    if(lvalue==1){
        next()
    }else{
        res.send('You Must Log In to Proceed')
    }
}

module.exports = {logger,register}




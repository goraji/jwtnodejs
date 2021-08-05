
const express = require('express');
const Teacher = require('../modules/schema');
const router = new express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var fs = require('fs');
// require('../')
router.get('/', (req, res) => {
console.log(process.env.skey);
    res.send(process.env.skey);
})

var multer = require('multer');


const verifyToken = (req, res, next) => {
  try {
    const bearerHeader = req.headers['authorization'];
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const decoded = jwt.verify(bearerToken, process.env.skey);
      req.user = decoded;
      // return  decoded.id;
      next();
  }catch (error) {
    res.send('invalid tkn');
    //  next();
  }
}
const fileFilter = (req,file,cb)=>{
  if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg'){
    cb(null,true);
  }else{
    cb(null,false);
  }
}
var storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    return cb(null, Date.now()+'-' +file.originalname )
  }
});
var upload = multer({ storage: storage,
  limits:{
  fileSize: 1024*1024*10
  },
  fileFilter: fileFilter
});
  


router.post('/register',upload.single('img'),async (req, res) => {
    try {
      console.log(req.file.filename);
        const data = new Teacher(req.body);
          let hash = await bcrypt.hash(data.password, 10);
          data.password = hash;
          data.img = req.file.filename;
          const user = await data.save();
        console.log(user);
        res.send(user);
    } catch (error) {
        console.log(error);
        res.send('email alredy exists');
    }
});
router.post('/login', async (req, res) => {
    try {
      const {email,password} = req.body;
      if(!email || !password){
        res.send('plzz fill all fields');
      }else{
        const user = await Teacher.findOne({email});
        if(!user){
          res.send('invalid email')
        }else{
          let match = await bcrypt.compare(password, user.password);
          if (match) {
            const token = jwt.sign(
              { id: user._id,},
              process.env.skey,
              {
                expiresIn: "2h",
              }
            )
            res.status(200).json({
              token:token
            })
          } else {
            res.send('invalid password')
          }
        }
      }
    }catch (error) {
        console.log(error);
        res.send(error);
    }
})
router.patch('/update',verifyToken,async(req, res)=>{
  try {
    let tkn = req.user;
    let id = tkn.id;
    console.log(id);
    const email = req.body.email;
    const pass = req.body.password;
    let hash = await bcrypt.hash(pass, 10);
    const user = await Teacher.findOneAndUpdate({_id:id},{email:email,password:hash});
    res.send(user);
  }catch{
    let tkn = req.user;
    let id = tkn.id;
    console.log(id);
    res.send('user not found')
  }
});

router.get('/profile',verifyToken,async(req,res)=>{
  try {
    let tkn = req.user;
    let id = tkn.id;
    let user = await Teacher.findById({_id:id},);
    res.json({
      msg: user.name+ "'s profile",
      data:user
    })
  } catch (error) {
    res.json({
      msg:"invalid details"
    })
  }
  res.send('profile page');
})

router.delete('/delete',verifyToken, async (req, res) => {
    try {
      let tkn = req.user;
      let id = tkn.id;
      let user = await Teacher.findByIdAndDelete({_id:id},);
      res.json({
        msg: user.name+ " is removed",
        data:user
      })
    } catch (error) {
      res.json({
        msg:"user not removed"
      })
    }
})
router.patch('/update',verifyToken ,async (req, res) => {
    try {
        const _id = req.params._id;
        const data = await Teacher.findByIdAndUpdate(_id, req.body, { new: true });
        res.send(data);
        console.log(data);
    } catch (error) {
        console.log(eror);
    }
})
router.delete('/teacher/:_id', async (req, res) => {
    try {
        const _id = req.params._id;
        const data = await Teacher.findByIdAndDelete(_id, req.body);
        res.send(data);
        console.log(data);
    } catch (error) {
        res.send(error);
        console.log(eror);
    }
})
module.exports = router;
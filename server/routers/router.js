
const route = require('express').Router()
const multer = require('multer')
const render = require('../services/render')
const control = require('../controllers/controller')
const { validateToken } = require('../middlewares/jwtFun')
const {isValidRoute} = require('../middlewares/routeValidation')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/img/uploads')
    },
    filename:function (req, file, cb) {
      cb(null,file.fieldname+'_'+Date.now()+'_'+file.originalname)
    }
  })
const upload = multer({ storage: storage }).single('profile')

const ECGstorage = multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,'./assets/img/ECG')
  },
  filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
  }
})
const ECGupload = multer({storage:ECGstorage}).single('ecg')

route.get('/',render.home)
route.get('/home',render.home)
route.get('/login',isValidRoute,render.login)
route.get('/signup',isValidRoute,render.signup)
route.get('/profile',validateToken,render.profile)
route.get('/updateprofile',validateToken,render.updateprofile)
route.get('/history',validateToken,render.history)
route.get('/Ip',validateToken,render.ip)
route.get('/delete/:id',validateToken,render.delete)
route.get('/admin',validateToken,render.admin)
route.get('/allprofile',validateToken,render.allprofile)
route.get('/allprediction',validateToken,render.allprediction)


route.post('/',ECGupload,control.home)
route.post('/signup',control.signup)
route.post('/login',control.login)
route.post('/profile',validateToken,upload,control.profile)
route.post('/updateprofile',validateToken,upload,control.updateprofile)
route.post('/logout',validateToken,control.logout)
route.get('*',render.x404)

module.exports = route
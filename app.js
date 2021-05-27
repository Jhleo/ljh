const {sequelize,User,Vote,Option}=require('./db')

const express = require('express')
const cors = require('cors')
const accountRouter=require('./account')
const cookieParser = require('cookie-parser')
const path = require('path')
const formidable = require('formidable')
const voteRouter=require('./vote')



const app= express()
const PORT=8089

app.use((req,res,next)=>{
  console.log(req.method,req.url)
    next()
})

app.use(cors({
  origin: true,
  maxAge: 99999999,
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser('secret'))

// 用来通过cookie从数据库里查询到当前登陆用户的
app.use(async (req, res, next) => {
  if (req.signedCookies.user) {
    req.user = await User.findOne({
      where: {
        name: req.signedCookies.user
      }
    })
  } else {
    req.user = null
  }
  next()
})

app.use('/', express.static(path.join(__dirname, './build')))


app.use('/account',accountRouter)

app.use('/vote',voteRouter)


app.use("/icons",express.static(path.resolve(__dirname,"icons"))) 

app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

app.post('/upload',async(req,res)=>{
    const form = formidable({
    multiples: false,//一次只传一个文件
    keepExtensions: true,//保留文件的扩展名
    uploadDir: path.join(__dirname, 'uploads')//上传路径
    });
    form.parse(req, async (err, info, files) => {
      if (err) {
        next(err)
      } else {
        // res.end('/uploads/' + path.basename(files.file.path))
        res.json({
          url: '/uploads/' + path.basename(files.file.path)
        })
      }
    })
})


const { server,io }= require('./servers')
server.on('request',app)

io.attach(server, {serveClient: false})//一定程度接管server的功能，

server.listen(PORT,()=>{
    console.log('listen',PORT)
})

const downloadCsv=require('./downloadcsv')
const request=require('postman-request')
const fs=require('fs')
const validator = require('validator');
const express = require('express')
const multer = require('multer');
const app = express()
const validateCurrencyCode = require('validate-currency-code');
app.use(express.urlencoded({extended:false}))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')  
});
 // SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.csv')
    }
  })
   
var upload = multer({ storage: storage })

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const base=req.body.username
    if (validateCurrencyCode(base)) {}
    else{
     return res.status(401).send("please provide a valid currency code or input field should not be empty")
      }
    const file = req.file
  
    let filename=''
    try{
   filename=file.filename
    }
    catch(error){
      return res.status(401).send("please select a file")
    }
    const destination=file.destination
    const originalname=file.originalname
    if(originalname.split('.')[1]!='csv'){
      return res.send("only csv file are allowed")
    }
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }else{
      res.redirect('/hello/'+filename+'/'+destination+'/'+base)
    }
  })
app.get('/hello/:filename/:destination/:base',async (req,res)=>{
  const filename=req.params.filename
  const destinationpath=req.params.destination+'/'+filename
  
 try{  
 await downloadCsv(destinationpath,req.params.base,async (error,result)=>{
      if(error){
        throw new Error(error)
      }
      
    
      res.redirect('/download/'+result.split('/')[2])
    
    })

  }
  catch(error){
    res.status(500).send(error)

  }
})

app.get('/download/:filename',async(req,res)=>{
  console.log("downloadfilename"+req.params.filename)
    res.download('./output/'+req.params.filename);

}
)


app.listen(3000, () => console.log('Server started on port 3000'));




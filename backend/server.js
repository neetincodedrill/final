const http = require('http');
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();
var url = process.env.DB;
var formidable = require('formidable');
const { dataValidation, emailvalidation,imagevalidation}  = require('./validation')

const requestHandler = (req,res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type','multipart/form-data') 
    if(req.method === "POST"){
      const form = formidable({ multiples: true });

      form.parse(req, (err, fields, files) => {  
      if (err) {
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
      }
      console.log(fields)
      console.log(files)
      let first_name = fields.first_name;
      let last_name = fields.last_name;
      let age = fields.age;
      let email = fields.email;
      let imageType = files.file.mimetype;

      //function to validate the data and files
      var fieldValidation = [
            dataValidation(first_name,last_name,age),
            imagevalidation(imageType),
            emailvalidation(email),
      ]
      // console.log(fieldValidation[0],fieldValidation[1],fieldValidation[2])
      if(fieldValidation[0] === true && fieldValidation[1] === true && fieldValidation[2] === true){
        return MongoClient.connect(url,function(err,db){
          if(err) throw err;
          var dbo = db.db('mydb');
          var data = {
            image : files,
            field :fields
          }
            const User =  dbo.collection('user')               
            User.insertOne(data,
              function(err,result){
              if(err) throw err;
                res.writeHead(200, { 'Content-Type': 'application/json' });

                }
              )          
             res.end(JSON.stringify({ fields, files }, null, 2));  
        })      
      }else {
        //sending validation error
        var error = ''
        var message = []
        for(i=0;i<fieldValidation.length;i++){        
             if(typeof fieldValidation[i] === 'string'){
                 message.push(fieldValidation[i])                                      
                 }  
                //  res.writeHead(400);    
                //  res.write(error)                               
             }    
         console.log(message)
          res.writeHead(400);    
          res.write(JSON.stringify(message))      
          return res.end();
      }   
    });
      }
      else if(req.method === 'GET'){
        MongoClient.connect(url,function(err,db){
          if(err) throw err;
          var dbo = db.db('mydb');
          if(dbo){
            return dbo.collection('user').find({}).toArray(function(err,result){
              if(err) throw err;   
              res.writeHead(200,{'Content-Type':'application/json'})         
              res.end(JSON.stringify(result))
              // console.log(result)           
            }) 
          }      
        })    
      }else{
        return "Only POST and GET request can be called"
      }
}

const server =  http.createServer(requestHandler)

const port = 7000;
const host = 'localhost';
server.listen(port,host)
console.log(`Server is running at localhost:${port}`)
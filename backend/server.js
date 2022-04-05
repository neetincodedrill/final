const http = require('http');
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();
var url = process.env.DB;
var formidable = require('formidable');
const { dataValidation, emailvalidation,imagevalidation}  = require('./validation')

const requestHandler = (req,res) => {
    // console.log(jsonParser);
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
      let first_name = fields.first_name;
      let last_name = fields.last_name;
      let age = fields.age;
      let email = fields.email;
      let imageType = files.file.mimetype;

      //function to validate the data and files
      console.log(dataValidation(first_name,last_name,age));
    
      console.log(imagevalidation(imageType));
      MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db('mydb');
        var data = {
          image : files,
          field :fields
        }
          const User =  dbo.collection('user')
          console.log(emailvalidation(email,User))
          User.findOne({email : email},function(err,user){
            if(err){
               console.log(err)
            }
            else if(user){
                console.log(user)
              // var err = new Error('A user with that email has already registers')
              // err.status = 400;
              // return next(err);
            }else{
               User.insertOne(data,
                function(err,result){
                  if(err) throw err;
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  console.log(result)
                }
                )
                res.end(JSON.stringify({ fields, files }, null, 2));
            }
          })
          
      
      
     
      })      
    });
      }
      else if(req.method === 'GET'){
        console.log('GET request');
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
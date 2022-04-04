const http = require('http');
const MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017/'
var url = 'mongodb+srv://neetinnegi:neetinnegi@cluster0.tyxfy.mongodb.net/'
var formidable = require('formidable');

const requestHandler = (req,res) => {
    // console.log(jsonParser);
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type','multipart/form-data') 
    if(req.method === "POST"){
      console.log("hi");
      const form = formidable({ multiples: true });

      form.parse(req, (err, fields, files) => {  
        console.log(fields);
        console.log(files);
      if (err) {
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
      }
      MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db('mydb');
        var data = {
          image : files,
          field :fields
        }
        if(data.image){
          return dbo.collection('user').insertOne(data,
            function(err,result){
              if(err) throw err;
              res.writeHead(200, { 'Content-Type': 'application/json' });
              console.log(result)
            }
            )
        }
      
      res.end(JSON.stringify({ fields, files }, null, 2));
      })      
    });
      }
      else{
        console.log('GET request');
        MongoClient.connect(url,function(err,db){
          if(err) throw err;
          var dbo = db.db('mydb');
          if(dbo){
            return dbo.collection('user').find({}).toArray(function(err,result){
              if(err) throw err;   
              res.writeHead(200,{'Content-Type':'application/json'})         
              res.end(JSON.stringify(result))
              console.log(result)           
            }) 
          }      
        })    
      }
}

const server =  http.createServer(requestHandler)

const port = 7000;
const host = 'localhost';
server.listen(port,host)
console.log(`Server is running at localhost:${port}`)
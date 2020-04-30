const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://user:senha@cluster0-hf1dd.gcp.mongodb.net/lojavirtual?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });
const porta=process.env.PORT||8080;
client.connect((err, client) => {
if (err) return console.log(err)
db = client.db('lojavirtual') 
app.listen(porta, () => console.log('Servidor na porta: '+porta));
})

app.get('/products/:id/:page',async (req, res) => {
let params=req.params.id;
params=params.toUpperCase();
let pagenation =req.params.page;
let tamanho=0; 
pagenation--;
let folha=pagenation*9;
db.collection('catalogo').find({'title':{$regex:'.*'+params+'.*'}}).count(function(err,res){
if(err){
res.send(400);
}else{
tamanho=res;
 next();
}});
function next(){
db.collection('catalogo').find({'title':{$regex:'.*'+params+'.*'}}).skip(folha).limit(9).toArray((err, results) => {
if (err){ res.send(400);
}else{
let qtp=(tamanho/9);
qtp= Math.ceil(qtp); 
pagenation=pagenation+1;
res.json( { docs: results ,total:tamanho,page:pagenation,pages:qtp });
}})
}})

app.get('/product/:id',async (req, res) => {
const params=req.params.id;
const id = new require('mongodb').ObjectID(params);
db.collection('catalogo').findOne({'_id':id}).then(function(doc) {
if(!doc){
res.send(400);
}else{
res.json(doc);
}
});
})
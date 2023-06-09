const express = require('express')
const  app =express();
const cors =require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port  =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xyvppop.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const usersCollection= client.db("bistroDB").collection("users");
    const menuCollection= client.db("bistroDB").collection("menu");
    const reviewsCollection= client.db("bistroDB").collection("reviews");
    const cartsCollection= client.db("bistroDB").collection("carts");

    // get post users apis

    app.post('/users',async(req,res)=>{
    
      const user = req.body;
      console.log(user);
      const result  = await usersCollection.insertOne(user)
      res.send(result)
    })

// get  menu apis 
    app.get('/menu',async(req,res)=>{
        const result = await menuCollection.find().toArray()
        res.send(result)
    })

    // get  reviews apis
    app.get('/reviews',async(req,res)=>{
        const result = await reviewsCollection.find().toArray()
        res.send(result)
    })

    //  get one carts apis
    app.get('/carts',async(req,res)=>{
      const email = req.query.email
      if(!email){
        res.send([]);
      }
      const query = {email: email}
      const result = await cartsCollection.find(query).toArray()
      res.send(result)
    })

    // post  one carts  apis
    app.post('/carts',async(req,res)=>{
      const item =req.body;
      const result = await cartsCollection.insertOne(item);
      res.send(result);
    })


    //  delete one  carts apis
    app.delete('/carts/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result =await cartsCollection.deleteOne(query)
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('hello World')
})

app.listen(port,()=>{
    console.log(`bistro boss is runing${port}`)
})
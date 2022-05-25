const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vytdg.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
    await client.connect();
    console.log('database connected');
    const serviceCollection = client.db('assignment-12').collection('services');
    const userCollection = client.db('assignment-12').collection('users');

    app.get('/service', async(req, res)=>{
        const query = {};
        const cursor = serviceCollection.find(query)
        const services = await cursor.toArray();
        res.send(services);
    });

    app.put('/user/:email',async(req,res)=>{
      const email = req.params.email;
      const user = req.body;
      const filter = {email : email}
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      res.send({ result, token });
    })

}
finally{

}
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World from electronic tools!')
})

app.listen(port, () => {
  console.log(`Electronic  app listening on port ${port}`)
})
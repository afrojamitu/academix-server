const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.xtu99cu.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const collegeCollection = client.db('academixDB').collection('collegeData')
    const userCollection = client.db('academixDB').collection('users')
    const applicationCollection = client.db('academixDB').collection('applications')


    // all college data
    app.get('/colleges', async (req, res) => {
        const result = await collegeCollection.find().toArray();
        res.send(result);
    })

    // college data by id
    app.get('/colleges/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await collegeCollection.findOne(query)
        res.send(result);
    })

    // admission form by id
    app.get('/admission/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await collegeCollection.findOne(query)
        res.send(result);
    })

    // set users to db
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'User Already Exist' })
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    // get users from db
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    // admission form - add data to db
     app.post('/addApplication', async (req, res) => {
      const application = req.body;
      const result = await applicationCollection.insertOne(application);
      res.send(result);
    })

    // get application data from db
    app.get('/addApplication', async (req, res) => {
      let query = {}
      if (req.query?.email) {
          query = { email: req.query.email }
      }
      const result = await applicationCollection.find(query).toArray()
      res.send(result)
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Welcome To Academix!')
})

app.listen(port, () => {
  console.log(`Sportopia is on port : ${port}`);
})
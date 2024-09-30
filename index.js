const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@newpro.rb49dn9.mongodb.net/?retryWrites=true&w=majority&appName=newPro`;

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
      //await client.connect();

      const craftCollection = client.db('TomaCanvasDB').collection('addCraft');
      const allCraftCollection = client.db('TomaCanvasDB').collection('allCraft');

      app.get('/myCraft/:id', async (req, res) => { 
        const cursor = craftCollection.find({mail:req.params.id});
        const result = await cursor.toArray();
        res.send(result);
      })
    
      app.get('/myCraftSort/:id', async (req, res) => { 
        const cursor = craftCollection.find({mail:req.params.id});
        const result = await cursor.sort({"customization":-1}).toArray();
        res.send(result);
      })
      app.get('/myCraftSortNo/:id', async (req, res) => { 
        const cursor = craftCollection.find({mail:req.params.id});
        const result = await cursor.sort({"customization":1}).toArray();
        res.send(result);
      })
     

      app.get('/allCraft', async (req, res) => { 
        const cursor = craftCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get('/allCraft/:id', async (req, res) => { 
          const result = await craftCollection.findOne({_id: new ObjectId(req.params.id)});
          res.send(result);
  
      })

      app.get('/singleCraft/:id', async(req, res) => { 
          const result = await craftCollection.findOne({_id: new ObjectId(req.params.id)});
          res.send(result);
      })


      app.post('/addCraft', async(req, res) => {
        const craft = req.body;
        const result = await craftCollection.insertOne(craft);
        res.send(result);
      })

      app.put('/allCraft/:id', async(req, res) =>{
          const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true }
        const updatedCraft = req.body;
        const craft = {
          $set: {
            name: updatedCraft.name,
            photoURL: updatedCraft.photoURL,
            subCategory: updatedCraft.subCategory,
            shortDescription: updatedCraft.shortDescription,
            price: updatedCraft.price,
            rating: updatedCraft.rating,
                customization: updatedCraft.customization,
                stockStatus: updatedCraft.stockStatus,
                processing_time: updatedCraft.processing_time
          }
        }
        const result = await craftCollection.updateOne(filter, craft, options);
        res.send(result);
      })

      app.delete('/delete/:id', async (req, res) => {

          const result = await craftCollection.deleteOne({_id: new ObjectId(req.params.id)});
          res.send(result);
      })
    
    //ready data
    app.get('/allCraftData', async (req, res) => { 
      const cursor = allCraftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/allCraftData/:id', async (req, res) => { 
      const result = await allCraftCollection.findOne({_id: new ObjectId(req.params.id)});
      res.send(result);

  })
     

     

    // Send a ping to confirm a successful connection
  // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => { 
    res.send('Toma Canvas server is running');
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
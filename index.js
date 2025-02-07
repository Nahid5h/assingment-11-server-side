const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app=express();
const port =process.env.PORT || 5000;
//Must remove "/" from your production URL
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hotelbooking-bb5b1.web.app",
      "https://hotelbooking-bb5b1.firebaseapp.com"
      
    ],
    credentials: true,
  })
);


// middleware 
app.use(cors()) ;
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1j9pcmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const roomsCollection=  client.db('hotelBooking').collection('rooms')
    const dataCollection=  client.db('hotelBooking').collection('data')
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // get all  rooms from bd 
    app.get("/featured", async(req,res)=>{
      const result = await roomsCollection.find().toArray()

      res.send(result);

    })
    app.get("/myBooking", async(req,res)=>{

      const email=req.query.email;
      // console.log(email)
      const query={email:email}
      // console.log(query);
      const result = await dataCollection.find(query).toArray();
      // console.log(result);
      res.send(result)

    })
    app.get("/viewDetail/:id", async(req,res)=>{
      const result = await dataCollection.findOne({_id:new ObjectId(req.params.id),
      })
      res.send(result)
    })
    // update 
    app.put("/update/:id", async (req,res)=>{
      const id =req.params.id;
      const filter ={_id:new ObjectId(id)}
      const option ={upsert:true};
      const updateSport= req.body;
      const spot ={
        $set:{
          
          name :updateSport.name,
          email:updateSport.email,
          date:updateSport.date,
        
             
        
        }
      }
      result = await dataCollection.updateOne(filter,spot,option)
     res.send(result)
    })
    // delete 
    app.delete("/delete/:id", async (req,res)=>{
      const id =req.params.id;
      console.log(id);
      const query ={ _id: new ObjectId(id)}
      const result = await dataCollection.deleteOne({_id: new ObjectId(req.params.id),
      })
      console.log(result)
      res.send(result);
    })
   
    // update 
    app.put("/updatee/:id", async (req,res)=>{
      const id =req.params.id;
      console.log(id)
      const filter ={_id:new ObjectId(id)}
      console.log(filter);
      const option ={upsert:true};
      const bookData= req.body;
      console.log(bookData);
      const spot ={
        $set:{
          
          Availability:bookData.Availability
        
     
        }
      }
      result = await roomsCollection.updateOne(filter,spot,option)
      
     res.send(result)
    })

    // post data 
    app.post('/addBook', async(req,res)=>{
      const newBook =req.body;
      // console.log(newBook)
      const result = await dataCollection.insertOne(newBook);
      res.send(result);

    })
    // get a single job data 
    app.get('/room/:id', async(req,res)=>{
      const id =req.params.id
      const query={_id:new ObjectId(id)}
      const result = await roomsCollection.findOne(query)
      res.send(result)
    })
    




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('hotel information is runing')
});
app.listen(port,()=>{
    console.log(`Hotel Server is runing on port${port}`)
})
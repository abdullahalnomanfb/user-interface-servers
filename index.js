const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000;
const objectId = require('mongodb').ObjectID

require('dotenv').config()
app.use(cors())
app.use(express.json())

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez7qy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log(err);
    const postCollection = client.db("userPost").collection("posts");
    const commentCollection = client.db("userPost").collection("comment");

    app.post('/addPost', (req, res) => {

        postCollection.insertOne(req.body)
            .then((result) => {
                if (result) {
                    res.send(result.insertedCount > 0)
                }
            })
    })


    app.get('/posts', (req, res) => {

        postCollection.find({title:{$regex:req.query.search}})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    app.get('/AllPosts', (req, res) => {

        postCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    app.get('/post', (req, res) => {
        postCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.patch('/update/:id', (req, res) => {
        const id = req.params.id;
        postCollection.updateOne({ _id: objectId(id) },
            {
                $set: { title: req.body.title, body: req.body.body }
            })
            .then(result => {
                if (result) {
                    res.send(result.modifiedCount > 0)
                }
            })
    })

    app.delete('/delete/:_id', (req, res) => {
        const id = req.params._id;
        postCollection.deleteOne({ _id: objectId(id) })
            .then((result) => {
                if (result) {
                    res.send(result.deletedCount > 0)
                }
            })
    })

    app.post('/addComment',(req,res)=>{

        commentCollection.insertOne(req.body)
        .then((result)=>{
            if(result){
                res.send(result.insertedCount > 0)
            }
        })
    })



    app.get('/comments/:userId',(req,res)=>{

        commentCollection.find({userId:req.params.userId})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })



    app.get('/', (req, res) => {
        res.send("Node.js Home page")
    })
});

app.listen(process.env.PORT || port)



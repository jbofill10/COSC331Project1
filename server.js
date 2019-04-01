const express = require("express");
const mysql = require("mysql")
const bodyParser = require("body-parser")

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "admin",
    password:"xanlZdgjehwCr0Sm"
});

const app = express();
const port = 3000;

db.connect();

db.on('error', (err)=>{
    console.error(err.toString());
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req,res)=> res.send("Hello World"))

app.listen(port, () => console.log(`listening on port ${port}`));
const express = require("express");
const mysql = require("mysql")
const bodyParser = require("body-parser")
const {body, validationResult} = require('express-validator/check')
const pick = require("object.pick")

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "admin",
    password:"xanlZdgjehwCr0Sm"
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

db.connect();

db.on('error', (err)=>{
    console.error(err.toString());
})

app.get("/", (req,res)=> res.send("COSC 331 Project 1"))

console.log("Connected as: admin")

app.get("/students", (req,res) => {
    db.query("SELECT * FROM project.student", (err,result)=>{
        if(err){
            console.log(err)
            res.status(400).send(err)
        }else{
            res.json(result)
        }
    })
})

app.post('/students',[
    body('id').not().isEmpty().isInt().isLength(7),
    body('firstName').not().isEmpty().isAlphanumeric(),
    body('lastName').not().isEmpty().isAlphanumeric(),
	body('year').not().isEmpty().isInt().isLength(4),
	body('age').not().isEmpty().isInt(),
	body('major').not().isEmpty().isAlphanumeric(),
	body('gpa').not().isEmpty().isFloat()
], (req,res)=>{
    const err = validationResult(req);
    if(!err.isEmpty()) return res.status(442).json({err:err.array()})

    db.query("INSERT INTO project.student SET ?",
        pick(req.body, ["id","firstName","lastName","year","age","major","gpa"]),
        (error,result)=>{
            if(error){
                console.error(error.toString())
                res.status(400).send(error);
            }else{
                res.json(result);
            }
        })
})

app.listen(port, () => console.log(`listening on port ${port}`));
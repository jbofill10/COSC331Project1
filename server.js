const express = require("express");
const mysql = require("mysql")
const bodyParser = require("body-parser")
const {body, validationResult} = require('express-validator/check')
const pick = require("object.pick")

// Set up SQL connection
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "admin",
    password:"xanlZdgjehwCr0Sm"
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// Connect to SQL server
db.connect();

db.on('error', (err)=>{
    console.error(err.toString());
})

app.listen(port, () => console.log(`listening on port ${port}`));

// Hello world route
app.get("/", (req,res)=> res.send("COSC 331 Project 1"))

console.log("Connected as: admin")

// Gets all the students in the DB
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

// Adds a new student
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

// Edits a field of a student's id
app.patch('/students', [
	body("id").not().isEmpty().isInt().isLength(7),
	body("firstName").optional().isAlphanumeric(),
	body("lastName").optional().isAlphanumeric(),
	body("year").optional().isInt().isLength(4),
	body("age").optional().isInt(),
	body("major").optional().isAlphanumeric(),
	body("gpa").optional().isFloat()
], (req, res) => {
        const err = validationResult(req);
        if(!err.isEmpty()) return res.status(442).json({err:err.array()})

        db.query("UPDATE project.student SET ? WHERE id = ?",
        [pick(req.body, ['firstName','lastName','year','age','major','gpa']), req.body.id],
        (error, result)=>{
            if(error){
                console.log(error)
                res.status(400).send(error);
            }else{
                res.json(result)
            }
        })

    }
)

// Edits whole student
app.put("/students", [    
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

    db.query("UPDATE project.student SET ? WHERE id = ?",
    [pick(req.body, ['firstName','lastName','year','age','major','gpa']), req.body.id],
    (error,result)=>{
        if(error){
            console.log(error)
            res.status(400).send(error)
        }else{
            res.json(result)
        }
    })
}
)

// Deletes student's id by using specific ID from DB in route
app.delete('/students/:id', (req,res) =>{
    db.query('DELETE FROM project.student WHERE id = ?;', [req.params.id], (error, result)=>{
    
      if (error) {
        console.log(error)
        res.status(400).send(error)
      } else {
        res.json(result);
      }
  })
})
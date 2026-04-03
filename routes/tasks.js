const express = require('express');
const router = express.Router();
const db = require('../db');

//GET all tasks
router.get('/tasks', (req , res) => {
    const query = 'SELECT * FROM tasks';
    db.query(query, (err , result) => {
        if(err) {
            res.status(500).json({error: 'failed to fetch tasks'});
            return;
        }
        res.status(200).json(result);
    });

});

//POST a new tasks
router.post('/tasks',(req, res) =>{
    const {title} = req.body;
    // const title = req.body.title; // same
    if(!title)
    {
        res.status(400).json({error:'Title is required'});
        return;
    }
    const query = 'INSERT INTO tasks (title) VALUES(?)';
    db.query(query, [title], (err, result) => {
        if(err)
        {
            res.status(500).json({error:'Failed to add task'});
            return;
        }
        res.status(201).json({message: 'Task added', id:result.insertId});
    });
});
//PUT update a task (marks done)
//DELETE a task


module.exports = router;
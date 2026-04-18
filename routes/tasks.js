const express = require('express');
const router = express.Router();
const db = require('../db');
const authentication = require('../middleware/auth.js');

router.get('/tasks',authentication,(req , res) => {
    const user_id = req.user.id;
    const query = 'SELECT * FROM tasks WHERE user_id = ?';
    db.query(query,[user_id] ,(err , result) => {
        if(err) {
            res.status(500).json({error: 'failed to fetch tasks'});
            return;
        }
        res.status(200).json(result);
    });

});


router.post('/tasks',authentication,(req, res) =>{
    const {title} = req.body;
    // const title = req.body.title; // same
    if(!title)
    {
        res.status(400).json({error:'Title is required'});
        return;
    }
    const user_id = req.user.id;
    const query = 'INSERT INTO tasks (title, user_id) VALUES(?,?)';
    db.query(query, [title,user_id], (err, result) => {
        if(err)
        {
            res.status(500).json({error:'Failed to add task'});
            return;
        }
        res.status(201).json({message: 'Task added', id:result.insertId});
    });
});

router.put('/tasks/:id' ,authentication ,(req, res) => {
    const {id} = req.params;
    const query = 'update tasks set done = true where id = ?';
    db.query(query, [id], (err, result) => {
        if(err){
            res.status(500).json({error : 'Failed to update task !'});
            return;
        }
        if(result.affectedRows == 0)
        {
            res.status(404).json({error:'Task not found !'});
            return;
        }
        res.status(200).json({message : 'Task updated '});
    });
});

router.delete('/tasks/:id',authentication ,(req, res) => {
    const {id} = req.params;
    const query = 'delete from tasks where id = ?';
    db.query(query, [id], (err,result) =>{
        if(err)
        {
            res.status(500).json({error : 'Failed to delete task !'});
            return;
        }
        if(result.affectedRows == 0)
        {
            res.status(404).json({error : 'Task not Found!'});
            return;
        } 
        res.status(200).json({message : 'Task deleted successfully'});
    });
});

router.put('/tasks/:id/undo', authentication, (req,res) => {
    const {id} = req.params;
    const query = 'update tasks set done = false where id = ?';
    db.query(query, [id],(err, result)  => {
        if(err)
        {
            res.status(500).json({erro: 'Failed to undo task!'});
            return;
        }
        res.status(200).json({message: 'Task undone'});
    });
});


module.exports = router;
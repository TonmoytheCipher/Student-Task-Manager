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
    const check = 'select * from tasks where title = ? AND user_id = ? AND done = false';
    db.query(check, [title, user_id], (err, results) => {
        if(err){
            res.status(500).json({error:'Failed to check tasks !'});
            return;
        }
        if(results.length > 0)
        {
            res.status(400).json({error: 'Task already exist !'});
            return;
        }
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
});

router.put('/tasks/:id' ,authentication ,(req, res) => {
    const {id} = req.params;
    const user_id = req.user.id;
    const query = 'update tasks set done = true where id = ? AND user_id = ?';
    db.query(query, [id,user_id], (err, result) => {
        if(err){
            res.status(500).json({error : 'Failed to update task !'});
            return;
        }
        if(result.affectedRows === 0)
        {
            res.status(404).json({error:'Task not found !'});
            return;
        }
        const pointquery = 'update users set points = points+5 where id = ?';
        db.query(pointquery,[user_id], (err) =>{
            if(err)
            {
                res.status(500).json({error:'Failed to update points!'});
                return;
            }
            res.status(200).json({message :'Task updated, points updated successfuly!'});
        });
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
    const user_id = req.user.id;
    const query = 'update tasks set done = false where id = ? and user_id = ?';
    db.query(query, [id,user_id],(err, result)  => {
        if(err)
        {
            res.status(500).json({error: 'Failed to undo task!'});
            return;
        }
        const pointquery = 'update users set points = points-5 where id = ?';
        db.query(pointquery, [user_id], (err) =>{
            if(err)
            {
                res.status(500).json({error:'Failed to update points!'});
                return;
            }
            res.status(200).json({message:'Task undone, Points updated!'});
        });
    });
});

router.get('/stats', authentication, (req,res)=>{
    const user_id = req.user.id;
    const query = 'select points from users where id = ?';
    db.query(query,[user_id], (err,result) =>{
        if(err)
        {
            res.status(500).json({err:'failed to fetch stats'});
            return;
        }
        const points = result[0].points;
        const level = Math.floor(points/25)+1;
        const pointsLevel = points % 25;
        const progress = Math.round((pointsLevel/25)*100);
        res.status(200).json({points, level, pointsLevel, progress});
    });
});


module.exports = router;
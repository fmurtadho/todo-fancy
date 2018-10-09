const Todo = require('../models/todo')
const User = require('../models/users')

class Controller {

    static create(req,res){
        let newTask = new Todo({
            name : req.body.name,
            description: req.body.description,
            dueDate : req.body.dueDate
        })

        newTask.save()
        .then(function(task){

            User.findOneAndUpdate(
                { _id : req.id}, 
                { $push : { todoList : task._id } } 
            )
            .then(()=>{

            })
            .catch(()=>{

            })

            res.status(200).json({
                task
            })
        })
        .catch(function(err){
            res.status(500).json({
                err
            })
        })
    }

    static read(req,res){
        User.findById(req.id)
        .populate("todoList")
        .then(function(task){
            res.status(200).json({
                task
            })
        })
        .catch(function(err){
            res.status(500).json({
                err
            })
        })
    }
    
    static update(req,res){
        Todo.findOneAndUpdate(
            { _id : req.params.id}, 
            { 
             name : req.body.name,
             description: req.body.description,
             dueDate : new Date()
            }
        )
        .then(function(task){
            res.status(200).json({
                message : `update ${task.name} success`
            })
        })
        .catch(function(err){
            res.status(500).json({
                err
            })
        })
    }

    static delete(req,res){
        Todo.findByIdAndRemove(
            { _id : req.params.id},
        )
        .then(function(task){
            res.status(200).json({
                message : `${task.name} removed..`
            })
        })
        .catch(function(err){
            res.status(500).json({
                err
            })
        })
    }

    static complete(req,res){
        Todo.findOneAndUpdate(
            { _id : req.params.id},
            { status : true }
        )
        .then(function(task){
            res.status(200).json({
                message : `${task.name} completed...`
            })
        })
        .catch(function(err){
            res.status(500).json({
                err
            })
        })
    }

    static uncomplete(req,res){
        Todo.findOneAndUpdate(
            { _id : req.params.id},
            { status : false }
        )
        .then(function(task){
            res.status(200).json({
                message : `${task.name} uncompleted...`
            })
        })
        .catch(function(err){
            res.status(500).json({
                err
            })
        })
    }
}

module.exports = Controller;
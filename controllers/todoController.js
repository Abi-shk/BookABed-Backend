const Todo = require("../models/todoModel")

const getAllTodos = async (req, res) => {
    const userId = req.params.userId
    try {
        const todos = await Todo.find({ userId });
        res.status(200).json({ status: true, todos })
    } catch (err) {
        res.status(500).json({ message: "could not find todos", err })
    }
}


const saveTodo = async (req, res) => {
    const { userId, title, description, dueDate } = req.body
    const newTodo = new Todo({
        userId,
        title,
        description,
        dueDate,
        completed: false
    })
    try {
        await newTodo.save()
        const todos = await Todo.find({ userId });
        res.status(200).json({ status: true, todos })
    } catch (err) {
        res.status(500).json({ message: "could not find todos", err })
    }
}


const deleteTodo = async (req, res) => {
    const todoId = req.params.todoId
    try {
        const deleteTodo = await Todo.findByIdAndDelete(todoId, { new: true });
        const todos = await Todo.find({ userId: deleteTodo.userId });
        res.status(200).json({ status: true, todos })
    } catch (err) {
        res.status(500).json({ message: "could not delete todo", err })
    }
}



const completedTodo = async (req, res) => {
    const todoId = req.params.todoId
    try {
        const todo = await Todo.findById(todoId)
        await Todo.findByIdAndUpdate(todoId, { completed: !todo.completed });
        const todos = await Todo.find({ userId: todo.userId })
        console.log(todo,todos)
        res.status(200).json({ status: true, todos,completed:!todo.completed })
    } catch (err) {
        res.status(500).json({ message: "could not update todos", err })
    }
}

exports.getAllTodos = getAllTodos
exports.saveTodo = saveTodo
exports.deleteTodo = deleteTodo
exports.completedTodo = completedTodo
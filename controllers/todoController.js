const Todo = require("../models/todoModel"); // Import the Todo model to interact with the todos collection in the database.

const getAllTodos = async (req, res) => {
    // Function to get all todos for a specific user
    const userId = req.params.userId; // Extract the userId from the request parameters
    try {
        const todos = await Todo.find({ userId }); // Find all todos that match the userId
        res.status(200).json({ status: true, todos }); // Send the todos in the response with a status of 200 (OK)
    } catch (err) {
        res.status(500).json({ message: "could not find todos", err }); // Send an error response with a status of 500 (Internal Server Error)
    }
};

const saveTodo = async (req, res) => {
    // Function to save a new todo
    const { userId, title, description, dueDate } = req.body; // Extract the userId, title, description, and dueDate from the request body
    const newTodo = new Todo({
        userId,
        title,
        description,
        dueDate,
        completed: false // Set the completed status to false by default
    });
    try {
        await newTodo.save(); // Save the new todo to the database
        const todos = await Todo.find({ userId }); // Find all todos that match the userId
        res.status(200).json({ status: true, todos }); // Send the updated list of todos in the response with a status of 200 (OK)
    } catch (err) {
        res.status(500).json({ message: "could not find todos", err }); // Send an error response with a status of 500 (Internal Server Error)
    }
};

const deleteTodo = async (req, res) => {
    // Function to delete a specific todo
    const todoId = req.params.todoId; // Extract the todoId from the request parameters
    try {
        const deleteTodo = await Todo.findByIdAndDelete(todoId, { new: true }); // Find the todo by its ID and delete it
        const todos = await Todo.find({ userId: deleteTodo.userId }); // Find all todos that match the userId of the deleted todo
        res.status(200).json({ status: true, todos }); // Send the updated list of todos in the response with a status of 200 (OK)
    } catch (err) {
        res.status(500).json({ message: "could not delete todo", err }); // Send an error response with a status of 500 (Internal Server Error)
    }
};

const completedTodo = async (req, res) => {
    // Function to toggle the completed status of a specific todo
    const todoId = req.params.todoId; // Extract the todoId from the request parameters
    try {
        const todo = await Todo.findById(todoId); // Find the todo by its ID
        await Todo.findByIdAndUpdate(todoId, { completed: !todo.completed }); // Toggle the completed status of the todo
        const todos = await Todo.find({ userId: todo.userId }); // Find all todos that match the userId of the updated todo
        console.log(todo, todos);
        res.status(200).json({ status: true, todos, completed: !todo.completed }); // Send the updated list of todos and the new completed status in the response with a status of 200 (OK)
    } catch (err) {
        res.status(500).json({ message: "could not update todos", err }); // Send an error response with a status of 500 (Internal Server Error)
    }
};

// Export the functions to be used in other parts of the application
exports.getAllTodos = getAllTodos;
exports.saveTodo = saveTodo;
exports.deleteTodo = deleteTodo;
exports.completedTodo = completedTodo;

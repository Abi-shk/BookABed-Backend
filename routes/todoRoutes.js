const express = require('express');
const { getAllTodos,saveTodo,deleteTodo,completedTodo } = require('../controllers/todoController');
const router = express.Router();

router.get('/all/:userId',getAllTodos );
router.post('/save',saveTodo );
router.delete('/delete/:todoId',deleteTodo );
router.patch('/completed/:todoId',completedTodo );

module.exports = router;

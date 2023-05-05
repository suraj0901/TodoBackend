import Todo from "../db/modals/todoModel.js"

class TodoService {
    static async getAllTodo({ limit, offset, userId }) {
        const todos = await Todo.findAll({ limit, offset, where: { UserId: userId } })
        return todos
    }

    static async getTodoById({ id }) {
        const todo = await Todo.findByPk(id)
        return todo
    }

    static async createTodo({ todo }) {
        const createdTodo = await Todo.create(todo)
        return createdTodo
    }

    static async updateTodo({ todo }) {
        const updatedTodo = await Todo.update(todo, {
            where: {
                id: todo.id
            }
        })
        return updatedTodo
    }

    static async deleteTodo({ id }) {
        const todo = await Todo.destroy({ where: { id } })
        return todo
    }
}

export default TodoService
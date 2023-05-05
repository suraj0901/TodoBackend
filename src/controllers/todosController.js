import express from "express"
import TodoService from "../services/todoService.js"
import { BadRequest, ServerError } from "../Error.js"
import { Unauthorized } from "../Error.js"

const { Request, Response } = express

/**
 * @typedef {{id: number, title:string, completed:boolean }} Todo
 */

class TodosController {
    static async checkTodoAvailable(id) {
        const todo = await TodoService.getTodoById({ id })
        // if (!todo) return res.status(400).json({ message:  })
        if (!todo) throw new BadRequest(`Todo with id ${id} is not available`)
        return todo
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @returns {Todo[]}
     */
    static async getAllTodos(req, res) {
        const { limit = 10, offset = 0 } = req.query
        const todos = await TodoService.getAllTodo({ limit, offset, userId: req?.user?.id })
        if (!todos) throw new ServerError('Could not get Todos')
        res.json(todos)
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    static async createTodo(req, res) {
        const todo = { title: req.body.title, UserId: req?.user?.id }
        const createdTodo = await TodoService.createTodo({ todo })
        if (!createdTodo) throw new ServerError(`Could not create Todo`)
        res.status(201).json(createdTodo)
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    static async updateTodo(req, res) {
        const { id } = req.params
        const todo = req.body

        // check todo available
        const dbTodo = await TodosController.checkTodoAvailable(id)

        if (dbTodo.UserId !== req?.user?.id) throw new Unauthorized("You are not authorized")
        // update todo
        const updated = await TodoService.updateTodo({ todo })
        // check todo updated successfully
        if (!updated) throw new ServerError("Could not update Todo")

        res.status(200).json({ message: "Updated Todo" })
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    static async deleteTodo(req, res) {
        const { id } = req.params

        const dbTodo = await TodosController.checkTodoAvailable(id)

        if (dbTodo.UserId !== req?.user?.id) throw new Unauthorized("You are not authorized")

        const todo = await TodoService.deleteTodo({ id })

        if (!todo) throw new ServerError(`Could not delete todo`)

        res.json({ message: "Deleted Todo Successfully" })
    }
}

export default TodosController
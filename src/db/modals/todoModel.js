import { DataTypes } from "sequelize";
import sequelize from "../index.js";

const Todo = sequelize.define("todo", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
})


export default Todo  
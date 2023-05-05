import { DataTypes } from "sequelize";
import sequelize from "../index.js";
import Todo from "./todoModel.js";

const User = sequelize.define("User", {
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Todo.belongsTo(User)
User.hasMany(Todo)
export default User
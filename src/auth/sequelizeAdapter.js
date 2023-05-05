const sequelizeAdapter = (User) => {
    return {
        async find(user) {
            const isUser = await User.findOne({
                where: user
            })
            return Boolean(isUser)
        },
        async findOrCreate(user) {
            return await User.findOrCreate({
                where: user,
            })
        }
    }
}

export default sequelizeAdapter
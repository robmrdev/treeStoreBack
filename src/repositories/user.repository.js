import UsersDto from "../DTOs/users.dto.js"

export default class UsersRepository {
    constructor(dao){
        this.dao = dao
    }

    createUser = async (user) =>{
        const newUser = new UsersDto(user);
        const result = await this.dao.save(newUser)
        return result
    }
}
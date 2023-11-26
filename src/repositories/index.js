import { UsersManager } from "../dao/factory.js";
import UsersRepository from "./user.repository.js";

const usersRepository = new UsersRepository (new UsersManager())

export {
    usersRepository
}


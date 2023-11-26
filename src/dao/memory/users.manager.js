/* ESTE MANAGER ES UNICAMENTE PARA PROBAR CAMBIO ENTRE MEMORY Y DB */

export default class UsersManager {
    constructor(){
        this.data = []
        console.log('working users with MEMORY')
    }

    getByEmail = async(email)=>{
        console.log(123)
        const user = this.data.find(user=> user.email = email);
        console.log(this.data)
        console.log(email)
        console.log(user)
        return user
    }
    getAll = async ()=>{
        const users = this.data
        return users
    }
    save =  async(user)=>{
        const newUser = this.data.push(user)
        return newUser
    }

}


export default class UsersDto {
    constructor (user) {
        this.firstName = user.firstName.includes(' ')
        ? user.firstName.split(' ').map(
            word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ')
        : user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase();
        
        this.lastName = user.lastName.includes(' ')
        ? user.lastName.split(' ').map(
            word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ')
        : user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1).toLowerCase();

        this.age = user.age,
        this.email = user.email,
        this.password = user.password
    }
}

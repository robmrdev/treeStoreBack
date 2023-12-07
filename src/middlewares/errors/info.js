export const generateUserErrorInfo = (user)=>{
    return `One or more properties were incomplete or not valid:
    List of required properties:
    email: needs to be a string, received: ${user.email}`
}
export const loginUserErrorInfo = ()=>{
    return 'One or more fields are invalid'
}
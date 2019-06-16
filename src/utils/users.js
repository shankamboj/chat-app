const users = [] 

//addUser, removeuser , getUser , getUserInRoom

const addUser = ({ id , username , room })=> {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data

    if(!username || !room){
        return {
            error: 'Username and room are required'
        }
    }
    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username===username
    
    })
    //validate username
    if(existingUser) {
        return { 
            error:"username is in use!"
        }
    }

    //Store user

    const user = { id,username , room}
    users.push(user)

    return {user}
    

}
const getUser = (id)=> {
    return users.find((user)=>user.id===id)
}
const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room==room)
}
const removeUser = (id)=> {
    const index = users.findIndex((user)=>{
        return user.id===id
    })  

    if(index!==-1){
        return users.splice(index,1)//one item removed from index 1..it returns new array 
    }
}
// addUser({
//     id:27,
//     username:"  shan  ",
//     room:"a"
// })
// addUser({
//     id:21,
//     username:"  deep  ",
//     room:"a"
// })

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
// const userList = getUserInRoom('a')
// //console.log(getUser(277))
// console.log(userList)
// // console.log(users)

// // const removedUser = removeUser(27)
// // console.log(removedUser)
// // console.log(users)


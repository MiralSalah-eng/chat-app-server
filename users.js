let users = []

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find( user => user.name === name )
    if (existingUser) {
        return {error : 'Username Taken'}
    }
    const user = { id, name, room };

    users.push(user)

    console.log(users)
    return {user}
}


const removeUser = (id) => {
    const index = users.findIndex( user => user.id === id) 
    if(index !== -1 ) {
        return users.splice(index,1)[0]
    }
}

const getUser = (name) => {
    const user = users.find(user => user.name === name )
    return user
}

const getUsersInRoom = (room)=> {
   return users.filter(user => user.room === room)
}


module.exports = { addUser, removeUser, getUser , getUsersInRoom  }
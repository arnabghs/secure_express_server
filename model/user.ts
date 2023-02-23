interface User {
    // id: serial
    email: string
    password: string
    role: string
    refreshToken: string
    // createdAt : timestamp
    // updatedAt : timestamp
}

interface Users {
    users: User[]
}

export {Users, User}
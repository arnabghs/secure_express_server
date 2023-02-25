interface RefreshJwtPayload {
    email: string,
}

interface AccessJwtPayload {
    email: string,
    role: string
}

export {AccessJwtPayload, RefreshJwtPayload}
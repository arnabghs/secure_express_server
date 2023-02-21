import cors from "cors";

const corsOptions = cors({
    origin: ['http://localhost:3000', 'https://www.google.com'],
    optionsSuccessStatus: 200
})

export { corsOptions}
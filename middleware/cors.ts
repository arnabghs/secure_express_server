import cors from "cors";
import {allowedOrigins} from "../shared/config";

const corsOptions = cors({
    origin: allowedOrigins,
    optionsSuccessStatus: 200
})

export {corsOptions}
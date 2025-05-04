import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'; //To use this kind of random name (userRouter) while importing, the export from the file shoulf be default


//routes declaration
app.use("/api/v1/users", userRouter)

//http://localhost:8000/api/v1/users/register


export { app }



/*IMPORTANT NOTES
1.  app.use() : The .use() method in Express (Node.js) is used to mount or attach 
        middleware functions to an application or a specific route. Middleware functions are 
        essentially functions that have access to the request object (req) and the response 
        object (res), as well as the next function in the middleware chain.






*/

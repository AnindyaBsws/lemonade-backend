import mongoose, { connect } from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";


/* Database Connection of an immediately executed async arrow function 
using try-catch.(approach 1)
    (In this approach, the connection to the database doesn't
    pollute any another files or folders, but the index folder is looking so messy
    because of the connection code to the database. That's why, we will use 
    a professional approach in approach number 2)

+++++++++++++  Approach 1  ++++++++++++++

const app =express()

( async() => {
    try{

       await mongoose.connect(`${process.env.MONGOGB_URI}/${DB_NAME}`)
       app.on("error", () => {
        console.log("ERRR: ", error);
        throw error
       })
       
       app.listen(process.env.PORT, () => {
        console.log((`App is listening on port ${process.env.PORT}`));
       })

    }
    catch(error){
        console.error("ERROR: ", error);
        throw err
    }

})()

*/


/*    IMPORTANT Notes: 

1. Whenever we try to connect to database, there can be some problematic scenarios,
Thus, it's always a better approach to wrap the code in try-catch methods.
        >>> The try statement defines the code block to run (to try). The catch statement defines 
        a code block to handle any error. The finally statement defines a code block to 
        run regardless of the result. The throw statement defines a custom error.
        >>> Use the try-catch statement to handle exceptions that might occur during execution 
        of a code block. Place the code where an exception might occur inside a try block.

2. Another problamatic scenario can also appear that "The Database is in another continent".
It means, connecting with database will require time. That's why, always use 'async-await' method and 
be carefull about using it.
        >>>  async/await is a mechanism in JavaScript (and other languages) that simplifies 
        handling asynchronous code, especially when dealing with promises, making it look 
        and feel more like synchronous code. 
        Here's a breakdown of how it works:
            1. async Keyword:
                    Marks a function as asynchronous.When an async function is called, 
                    it automatically returns a promise. Even if the function doesn't explicitly 
                    return a promise, the returned value is implicitly wrapped in a promise. 
            2. await Keyword:
                    Used inside an async function to pause its execution until a promise settles 
                    (either resolves or rejects). The await keyword can only be used inside an 
                    async function. When a promise is resolved, the value of that promise 
                    is returned. If the promise is rejected, an error is thrown. 

            3. Benefits of using async/await:
                >> Readability: Asynchronous code written with async/await is often easier to read and 
                understand than using traditional promise chaining or callbacks.
                >> Error Handling: You can use try...catch blocks to handle errors that might 
                occur within an async function, similar to synchronous code.
                >> Simplicity: It reduces the complexity of working with asynchronous operations, 
                especially when dealing with nested promises or callbacks, making it 
                easier to manage complex processes after a promise is settled

*/


/* +++++++++++++++++++++++  Approach 2  ++++++++++++++++++++
In this approach, a index.js is file is created and from there,
we are collectiong the connection code to the database. Because of this the code looks much cleaner
than apprach 1. It is much professional to use. */


import connectDB from "./db/index.js"; // we need to import from the index.js, so give the full path.
import dotenv from "dotenv"; // Go package.json and write in scripts ' -r dotenv/config --experimental-json-modules'. It will configure every dotenv configuration.
import {app} from './app.js'

dotenv.config({
    path: './env'
})

connectDB()
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("Mongo db connecttion fail!!!", err);
    
})

//Now run the code npm run dev


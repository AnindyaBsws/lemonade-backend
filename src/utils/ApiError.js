class ApiError extends Error{
    constructor(
        statusCode,
        message= "Something went wrong",
        errors= [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null 
        /*this.data=null :::::Setting a NULL value is appropriate when the 
        actual value is unknown,or when a value is not meaningful. A NULL 
        value is not equivalent to a value of ZERO if the data type is a 
        number and is not equivalent to spaces if the data type is a character. 
        A NULL value can be inserted into columns of any data type.
        The null value represents the intentional absence of any object value. 
        It is one of JavaScript's primitive values and is treated as 
        falsy for boolean operations. */
        this.message = message
        this.success = false
        this.errors = this.errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace( this, this.constructor)
        }
    }
}
export {ApiError}
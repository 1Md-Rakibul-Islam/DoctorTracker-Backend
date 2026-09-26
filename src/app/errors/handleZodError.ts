import { ZodError, ZodIssue } from "zod";

const handleZodError = (err: ZodError) => {

    const errorSourses = err.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue.message
        }
    })

    const statusCode = 400;

    return {
        statusCode,
        message: "Validation Error",
        errorSourses
    }
};

export default handleZodError;
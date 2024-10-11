const dbConnect = require("./Config/connectDb");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: "./Config/.env" });

const startServer = async () => {
    try {
        // Connect to MongoDB
        const connect = await dbConnect();
        if (!connect) {
            console.error("Failed to connect to MongoDB");
            process.exit(1); // Exit if the connection fails
        }

        // Import app after successful DB connection
        const app = require("./app");

        // Start the Express server only if MongoDB connection is successful
        const PORT = process.env.PORT || 4001;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1); // Exit if the server fails to start
    }
};

startServer();

/*
Some Important Comments:
For Routes
all the Endpoints are written in app.js and will be start with /api/v1
/user -> user routes
/admin -> admin routes
/auth -> Authentication routes


Schema Information
User Schema -> Solely for User and some methods
Admin Schema -> Solely for Admin and some methods

Why we have Created Two Schema instead of One?(User or Admin)
Although, both schema can be merged using role array but 
Common Issues :-
- as the codebase grows we can easily add more schemas for different roles
- In real Scenerio it can be seen both user can have same name and same email(if we are using Two Diff Client)
- For Eg. (Admin Portal & User Portal) -> We can add same name and same email in both portal

Why Email Field ?
if user signup through email, then it will be stored in email field

//Middleware Info
There are two route based middleware - isAuthenticatedUser and checkRole
isAuthenticatedUser -> Will check if the user is authenticated or not
checkRole -> Will check if the user is an admin or not



Authentications :
Cookie based authentication is used as, it automatically sends token in cookie


*/
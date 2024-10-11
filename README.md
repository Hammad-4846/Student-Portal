To get started with the API Service, follow these steps:
Prerequisites
• Node.js: Ensure you have Node.js installed on your machine. You can download it 
from nodejs.org.
• MongoDB: Set up a MongoDB database. You can use a local instance or a cloudbased service like MongoDB Atlas.
Steps
1. Clone the Repository :
git clone https://github.com/Hammad-4846/Student-Portal.git
2. Install Dependencies: Run the following command to install the necessary 
packages: npm install
3. Environment Variables: Create a .env file in the Config of the project and set the 
following environment variables:
MONGO_URI
PORT=4000
JWT_EXPIRATION_TIME
JWT_SECRET_KEY
COOKIE_EXPIRE
 4, Run the Server: Start the server with the command:
 npm start or node index.js

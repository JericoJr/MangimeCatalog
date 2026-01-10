                        Mangime Catalog

App Description: Mangime is a personal digital library and journal website for browsing all anime and manga related content. 
________________________________________________________________________
Features:
🔍 Search & Browse: Explore anime and manga content using Jikan API

📚 Personal Library: Save favorite content with fields like title, type, genre, and status

⏳ Status Tracking: Track progress: Completed, Waitlist, Reading/Watching

⭐ Ratings & Notes: Add personal ratings and comments for each entry

🔒 User Authentication: Register, log in, and manage sessions securely

✉️ Forgot Password: Request a code to reset your password

📊 Dynamic Sorting: Sort your library by newest, earliest, title, status, or rating
________________________________________________________________________
Tech Stack:
-Backend: Node.js, Express.js

-Database: MongoDB, Mongoose

-Frontend: HTML, CSS, JavaScript, EJS templates

-Session Management: express-session

-Email Sending: Nodemailer (Works Only Locally)

-Development Tools: Nodemon
________________________________________________________________________
APIs: 
Jikan (https://jikan.moe/)
________________________________________________________________________
Deployment/Setup:

1. View Website (Hosted on Render.com):
    Deployed App Link: https://mangimecatalog.onrender.com 
    (Note: Email Sending Does Work on Render's Server)
2. Setup Instructions
    a. Clone repository
    b. Install dependencies: "npm install"
    c. Create a .env file in project root:
        1c. Create MongoDB Account and set Mongo Connection String
        2c. Create or Use a Emaill Address, recommend Gmail, set Email and App Password
        3c. Create and Set Secret Session (Can make your own)
        4c. Must have these fields:
            MONGO_CONNECTION_STRING= ???
            SECRET_SESSION= ???
            EMAIL_USER= ???
            EMAIL_PASS= ???
    d. Open Terminal and Start Server: "npm nodemon websiteServer.ks"
        1d. Open browser and right click in terminal: "Web server is running at http://localhost:2000"


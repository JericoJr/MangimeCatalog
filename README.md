                                                    Mangime Catalog

App Description: Mangime Catalog is a personal digital library and journal website for browsing all anime and manga related content. 
________________________________________________________________________________________________________________________________
✨ Features
🔍 Discover Anime & Manga

Browse random anime and manga recommendations

Explore top-rated, current, and upcoming content

Search anime and manga using the Jikan API

View summaries and community reviews for each title

📚 Personal Library

Save your favorite anime and manga in a personal library

Store details such as title, type, genre, and status

⏳ Progress Tracking

Track your viewing/reading progress with statuses:

Completed

Watching / Reading

Waitlist

⭐ Ratings & Notes

Add personal ratings to each entry

Write private notes and comments for future reference

🔒 User Authentication & Security

Secure user registration and login system

Session-based authentication

All saved data is private and tied to the user’s account

✉️ Password Recovery

Reset forgotten passwords via email verification code

Secure password recovery flow

📊 Dynamic Sorting & Organization

Sort your library by:

Newest or earliest added

Title (A–Z)

Status

Rating
________________________________________________________________________________________________________________________________
Tech Stack:

-Backend: Node.js, Express.js

-Database: MongoDB, Mongoose

-Frontend: HTML, CSS, JavaScript, EJS templates

-Session Management: express-session

-Email Sending: Nodemailer (Works Only Locally)

-Development Tools: Nodemon
________________________________________________________________________________________________________________________________
APIs: 

Jikan (https://jikan.moe/) - Anime & Manga Database
________________________________________________________________________________________________________________________________
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
________________________________________________________________________________________________________________________________
Contact:

Email: jericojrestrella@gmail.com   

linkedIn: https://www.linkedin.com/in/jericojrestrella/



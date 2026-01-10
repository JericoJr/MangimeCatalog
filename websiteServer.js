const express = require("express"); /* Accessing express module */
const app = express(); /* app is a request handler function */
const session = require("express-session"); /* For sessions */
// const MongoStore = require("connect-mongo");
const path = require("path");
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});

// app.set("trust proxy", 1);
app.use(
  session({
    // name: "sid",
    // secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: false,
    // store: MongoStore.create({
    //   mongoUrl: process.env.MONGO_CONNECTION_STRING,
    //   dbName: "contentDB",
    //   ttl: 10 * 60, // 10 minutes
    // }),
    // cookie: {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 10 * 60 * 1000,
    // },
  })
);

const portNumber = 2000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

const login = require("./routes/login");
const signup = require("./routes/signup")
const home = require("./routes/home");
const browse = require("./routes/browse");
const myStuff = require("./routes/myStuff");
const addContent = require("./routes/addContent");
const account = require("./routes/account");
const forgot = require("./routes/forgot");

app.set('view engine', 'ejs');
app.set('views', './templates'); 

app.use(express.static('style'));
app.use("/", login);
app.use("/signup", signup);
app.use("/home", home)
app.use("/browse", browse);
app.use("/myStuff", myStuff);
app.use("/addContent", addContent);
app.use("/account", account);
app.use("/forgot", forgot)
app.listen(portNumber);
console.log(`Web server is running at http://localhost:${portNumber}`);
process.stdout.write("Stop to shutdown the server: ");

process.stdin.setEncoding("utf8"); /* encoding */
process.stdin.on('readable', () => {  /* on equivalent to addEventListener */
	const dataInput = process.stdin.read();
	if (dataInput !== null) {
		const command = dataInput.trim();
		if (command === "Stop") {
			// Not using console.log as it adds a newline by default
			process.stdout.write("Shutting down the server\n"); 
            process.exit(0);  /* exiting */
        } else {
			/* After invalid command, we cannot type anything else */
			process.stdout.write(`Invalid command: ${command}`);
            process.stdout.write("\nStop to shutdown the server: ");
		}
        process.stdin.resume(); // Allows the code to process next request
    }
});
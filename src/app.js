const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./db/conn");
const { Student, Teacher } = require("./models/registers");

const port = process.env.PORT || 4000;

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);


app.get("/", (req, res) =>{
    res.render("hero-section");
});
app.get("/Student_Signup", (req, res) =>{
    res.render("Student_Signup");
});

app.get("/Teacher_signup", (req, res) =>{
    res.render("Teacher_signup");
});
app.get("/Admin_landing_screen", (req, res) =>{
    res.render("Admin_landing_screen");
});
app.get("/Alreadyacc", (req, res) =>{

    res.render("Alreadyacc");    
});
app.get("/Alreadyaccadmin", (req, res) =>{

    res.render("Alreadyaccadmin");    
});
app.get("/Student_Login", (req, res) =>{

    res.render("Student_Login");    
});
app.get("/Teacher_login", (req, res) =>{

    res.render("Teacher_login");    
});
app.get("/Student_Landingscreen", (req, res) =>{

    res.render("Student_Landingscreen");    
});
app.get("/Teacher_Landingscreen", (req, res) =>{

    res.render("Teacher_Landingscreen");    
});

//create new user in db
app.post("/Student_Signup", async (req, res) =>{
    try {
        // res.send(req.body.username);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
                
        const registerStudent = new Student({
            username : req.body.username,
            email :req.body.email,
            password : hashedPassword
        })

        const registered = await registerStudent.save();
        res.status(201).render("Student_Landingscreen");

    } catch (error) {
        res.status(400).send(error);
    }
});

//for teacher sign up
app.post("/Teacher_signup", async (req, res) =>{
    try {
        // res.send(req.body.username);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
                
        const registerTeacher = new Teacher({
            email :req.body.email,
            password : hashedPassword
        })

        const registered = await registerTeacher.save();
        res.status(201).render("Teacher_Landingscreen");

    } catch (error) {
        res.status(400).send(error);
    }
});


app.post("/Student_Login", async (req, res) => {
    try {
        console.log("start")
        // Retrieve user data from the database
        const user = await Student.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Compare the hashed password with the one provided in the request
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        
        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }
        else{
            res.status(201).render("Student_Landingscreen");
        }
        
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
});
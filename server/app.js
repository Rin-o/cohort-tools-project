const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const helmet = require('helmet')
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PORT = 5005;

mongoose

  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")

  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))

  .catch(err => console.error("Error connecting to mongo", err));
// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

const cohortSchema = new Schema({
  cohortSlug:{type:String, required:true, unique:true},
  cohortName: {type:String, required:true},
  program: {type:String, enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"]},
  format: {type:String, enum: ["Full Time", "Part Time"]},
  campus: {type:String, enum: ["Madrid", "Barcelona", "Miami", "Paris", "Berlin", "Amsterdam", "Lisbon", "Remote"]},
  startDate: {type:Date,default:Date.now},
  endDate: Date,
  inProgress: {type:Boolean, default: false},
  programManager: {type:String, required:true},
  leadTeacher: {type:String, required:true},
  totalHours: {type:Number, default: 360}
 
});
 

const Cohort = mongoose.model("Cohort", cohortSchema);
 

module.exports = Cohort;


const studentSchema = new Schema({
  firstName:{type:String, required:true},
  lastName: {type:String, required:true},
  email: {type:String, required:true, unique:true},
  phone: {type:String, required:true},
  linkedinUrl: {type:String, default:''},
  languages: {type:String, enum: ["English", "Spanish", "French", "German", "Portuguese", "Dutch", "Other"]},
  program: {type:String,  enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"]},
  background: {type:String, default:''},
  image: {type:String, default:'https://i.imgur.com/r8bo8u7.png'},
  cohort: {type:mongoose.Schema.Types.ObjectId, ref:'Cohort'},
  projects: [String]
 
});
 

const Student = mongoose.model("Student", studentSchema);
 

module.exports = Student;

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet())
app.use(
  cors({
origin: [`http://localhost:5173`,`http://127.0.0.1:5173`],
  })
)


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get('/api/cohorts', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.sendFile('cohorts.json', { root: __dirname });
});

app.get('/api/students', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.sendFile('students.json', { root: __dirname });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
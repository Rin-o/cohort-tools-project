const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const helmet = require('helmet')
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Student = require("./models/students");
const Cohort = require("./models/cohorts");
const PORT = 5005;

mongoose

  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")

  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))

  .catch(err => console.error("Error connecting to mongo", err));
// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

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

app.get("/api/cohorts", async (request, response) => {
  try {
    const cohort = await Cohort.find();
    response.status(200).json({ cohorts: cohorts });
  } catch (error) {
    response
      .status(500)
      .json({ error: "Status code: 500 (Internal Server Error)" });
  }
});

//* GET /api/students - Retrieves all of the students in the database collection

app.get("/api/students", async (request, response) => {
  try {
    const students = await Student.find();
    response.status(200).json({ students: students });
  } catch (error) {
    response
      .status(500)
      .json({ error: "Status code: 500 (Internal Server Error)" });
  }
});

//POST /api/students - Creates a new student
app.post('/api/students', async (request, response) => {
  try {
    const newStudent = await Student.create(request.body)
    response.status(201).json({ student: newStudent })
  } catch (error) {
    console.log(error)
    response.status(400).json({ error })
  }
})

//* GET /api/students/cohort/:cohortId - Retrieves all of the students for a given cohort
app.get("/api/students/cohort/:cohortId", async (request, response) => {
  const { cohortId } = request.params;
  if (mongoose.isValidObjectId(cohortId)) {
    try {
      const currentCohort = await Student.find({cohort: cohortId});
      if (currentCohort) {
        response.json({ student: currentCohort });
      } else {
        response.status(404).json({ message: "Cohort not found" });
      }
    } catch (error) {
      console.log(error);
      response.status(400).json({ error });
    }
  } else {
    response.status(400).json({ message: "The id seems wrong" });
  }
});

//* GET /api/students/:studentId - Retrieves a specific student by id
app.get('/api/students/:studentId', async (request, response) => {
  const { studentId } = request.params
  if (mongoose.isValidObjectId(studentId)) {
    try {
      const currentStudent = await Student.findById(studentId)
      
      if (currentStudent) {
        currentStudent.populate("cohort").then((student)=>{response.status(202).send(student)})
      } else {
        response.status(404).json({ message: 'Student not found' })
      }
    } catch (error) {
      console.log(error)
      response.status(400).json({ error })
    }
  } else {
    response.status(400).json({ message: 'The id seems wrong' })
  }
})

//PUT /api/students/:studentId - Updates a specific student by id

app.put('/api/students/:studentId', async (request, response) => {
  const { studentId } = request.params

  try {
    const newStudent = await Student.findByIdAndUpdate(studentId, request.body, { new: true })
    response.status(202).json({ student: newStudent })
  } catch (error) {
    console.log(error)
    response.status(400).json({ error })
  }
})

//* DELETE /api/students/:studentId - Deletes a specific student by id
app.delete('/api/students/:studentId', async (request, response) => {
  const { studentId } = request.params

  await Student.findByIdAndDelete(studentId)
  response.status(202).json({ message: 'Student deleted' })
})

//* POST /api/cohorts - Creates a new cohort
app.post('/api/cohorts', async (request, response) => {
  try {
    const newCohort = await Cohort.create(request.body)
    response.status(201).json({ cohort: newCohort })
  } catch (error) {
    console.log(error)
    response.status(400).json({ error })
  }
})

//* GET /api/cohorts/:cohortId - Retrieves a specific cohort by id

app.get('/api/cohorts/:cohortId', async (request, response) => {
  const { cohortId } = request.params
  if (mongoose.isValidObjectId(cohortId)) {
    try {
      const currentCohort = await Cohort.findById(cohortId)
      if (currentCohort) {
        response.json({ cohort: currentCohort })
      } else {
        response.status(404).json({ message: 'Cohort not found' })
      }
    } catch (error) {
      console.log(error)
      response.status(400).json({ error })
    }
  } else {
    response.status(400).json({ message: 'The id seems wrong' })
  }
})

//* PUT /api/cohorts/:cohortId - Updates a specific cohort by id

app.put('/api/cohorts/:cohortId', async (request, response) => {
  const { cohortId } = request.params

  try {
    const newCohort = await Cohort.findByIdAndUpdate(cohortId, request.body, { new: true })
    response.status(202).json({ cohort: newCohort })
  } catch (error) {
    console.log(error)
    response.status(400).json({ error })
  }
})

//* DELETE /api/cohorts/:cohortId - Deletes a specific cohort by id
app.delete('/api/cohorts/:cohortId', async (request, response) => {
  const { cohortId } = request.params

  await Cohort.findByIdAndDelete(cohortId)
  response.status(202).json({ message: 'Cohort deleted' })
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
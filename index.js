import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let query;
const url = "https://bored-api.appbrewery.com/";

function api(req, res, next) {
  const category = req.body["type"];
  const participation = req.body["participants"];

  if (category && participation) {
    query = `${url}filter?type=${category}&participants=${participation}`;
  } else if (category) {
    query = `${url}filter?type=${category}`;
  } else if (participation) {
    query = `${url}filter?participants=${participation}`;
  } else {
    query = `${url}random`;
  }
  next();
}

app.use(api);

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req, res) => {
  console.log("get:", query);
  try {
    const response = await axios.get(url);
    const result = response.data;
    console.log("response:", result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "Failed to make request",
    });
  }
});

app.post("/", async (req, res) => {
  // Step 2: Play around with the drop downs and see what gets logged.
  // Use axios to make an API request to the /filter endpoint. Making
  // sure you're passing both the type and participants queries.
  // Render the index.ejs file with a single *random* activity that comes back
  // from the API request.
  // Step 3: If you get a 404 error (resource not found) from the API request.
  // Pass an error to the index.ejs to tell the user:
  // "No activities that match your criteria."

  console.log("get:", query);
  try {
    const response = await axios.get(query);
    const results = response.data;
    const result = Math.floor(Math.random() * result.length);
    console.log("response:", result);
    res.render("index.ejs", {
      data: result[result],
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "No activities that match your criteria.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

const app = require("express")()
const cors = require("cors")

// Enable CORS for all routes
app.use(cors())

app.get("/", (req, res) => {
    res.json({message: "App is running"})
})

app.listen(process.env.PORT || 8080)
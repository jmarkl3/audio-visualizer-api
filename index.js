const app = require("express")()

app.get("/", (req, res) => {
    res.json({message: "App is running"})
})

app.listen(process.env.PORT || 8080)
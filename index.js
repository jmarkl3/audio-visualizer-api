const app = reqire("express")()

app.get("/", (req, res) => {
    res.json({message: "App is running"})
})

app.listen(8080)

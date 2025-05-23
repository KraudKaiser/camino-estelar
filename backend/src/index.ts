import express, { Application, Express } from "express"
import cookieParser from "cookie-parser"

import servicesRoutes from "./routers/services.routes"
import categoriesRoutes from "./routers/categories.routes"
import usersRoutes from "./routers/users.routes"

const app : Application = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api", servicesRoutes)
app.use("/api", categoriesRoutes)
app.use("/api", usersRoutes)
app.listen(3002)

console.log("App is listening on port 3002")
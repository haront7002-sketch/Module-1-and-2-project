import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { pool } from "./database.js"
import reviewsRoutes from "./routes/reviewsRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// EMPLOYEES
app.get("/api/employees_info", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM employees_info")
        res.json(rows)
    } catch (err) {
        res.status(500).json(err)
    }
})

// REVIEWS
app.use("/api/reviews", reviewsRoutes)

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000")
})

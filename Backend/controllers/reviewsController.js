import { pool } from "../database.js";

export const getReviews = async (req, res) => {
    try {
        const [rows] = await pool.query(`
    SELECT reviews.ReviewsId,
            reviews.employeeId,
            employees_info.name,
            reviews.ReviewsComment
    FROM reviews
    JOIN employees_info
    ON reviews.employeeId = employees_info.employeeId
`)

res.json(rows)
} catch (err) {
    res.status(500).json(err)
    }
}

export const addReview = async (req, res) => {
    const { employeeId, ReviewsComment } = req.body

    if (!employeeId || !ReviewsComment)
        return res.status(400).json({ message: "Missing fields "});

    try {
        const [[employee]] = await pool.query(
            "SELECT name FROM employees_info WHERE employeeId = ?",
            [employeeId]
        )

        if (!employee) 
            return res.status(404).json({ message: "Employee not found" });

        const [[result]] = await pool.query(
            "INSERT INTO reviews (employeeId, name, ReviewsComment) VALUES (?, ?, ?)",
            [employeeId, employee.name, ReviewsComment]
        )

        res.json({
            ReviewsId: result.insertId,
            employeeId,
            name: employee.name,
            ReviewsComment
        })
    } catch (err) {
        res.status(500).json(err)
    }
}

export const deleteReview = async (req, res) => {
    try {
        await pool.query(
            "DELETE FROM reviews WHERE ReviewsId = ?",
            [req.params.id]
        )

        res.json({ message: "Deleted" })
    } catch (err) {
        res.status(500).json(err)
    }
}
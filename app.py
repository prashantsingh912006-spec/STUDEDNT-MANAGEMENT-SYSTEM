from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = "students.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def create_table():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roll INTEGER UNIQUE NOT NULL,
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            marks REAL NOT NULL
        )
    """)

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/students", methods=["GET"])
def get_students():

    conn = get_db()

    students = conn.execute(
        "SELECT * FROM students ORDER BY roll"
    ).fetchall()

    conn.close()

    return jsonify([dict(student) for student in students])


@app.route("/api/students", methods=["POST"])
def add_student():

    data = request.get_json()

    roll = data.get("roll")
    name = data.get("name")
    department = data.get("department")
    marks = data.get("marks")

    if not roll or not name or not department or marks is None:
        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    try:

        conn = get_db()

        conn.execute("""
            INSERT INTO students
            (roll, name, department, marks)
            VALUES (?, ?, ?, ?)
        """, (roll, name, department, marks))

        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Student added successfully!"
        })

    except sqlite3.IntegrityError:

        return jsonify({
            "success": False,
            "message": "Roll number already exists."
        }), 400


@app.route("/api/students/<int:roll>", methods=["GET"])
def search_student(roll):

    conn = get_db()

    student = conn.execute(
        "SELECT * FROM students WHERE roll = ?",
        (roll,)
    ).fetchone()

    conn.close()

    if student:
        return jsonify({
            "success": True,
            "student": dict(student)
        })

    return jsonify({
        "success": False,
        "message": "Student not found."
    }), 404


@app.route("/api/students/<int:roll>", methods=["PUT"])
def update_student(roll):

    data = request.get_json()

    name = data.get("name")
    department = data.get("department")
    marks = data.get("marks")

    if not name or not department or marks is None:
        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    conn = get_db()

    cursor = conn.execute("""
        UPDATE students
        SET name = ?, department = ?, marks = ?
        WHERE roll = ?
    """, (name, department, marks, roll))

    conn.commit()

    updated = cursor.rowcount

    conn.close()

    if updated:
        return jsonify({
            "success": True,
            "message": "Student updated successfully!"
        })

    return jsonify({
        "success": False,
        "message": "Student not found."
    }), 404


@app.route("/api/students/<int:roll>", methods=["DELETE"])
def delete_student(roll):

    conn = get_db()

    cursor = conn.execute(
        "DELETE FROM students WHERE roll = ?",
        (roll,)
    )

    conn.commit()

    deleted = cursor.rowcount

    conn.close()

    if deleted:
        return jsonify({
            "success": True,
            "message": "Student deleted successfully!"
        })

    return jsonify({
        "success": False,
        "message": "Student not found."
    }), 404


create_table()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
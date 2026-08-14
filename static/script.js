 // ============================================
// STUDENT MANAGEMENT SYSTEM
// JavaScript Frontend
// ============================================


// ============================================
// GLOBAL DATA
// ============================================

let students = [];


// ============================================
// PAGE INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    setCurrentDate();

    loadStudents();

});


// ============================================
// CURRENT DATE
// ============================================

function setCurrentDate() {

    const dateElement = document.getElementById("currentDate");

    if (!dateElement) {
        return;
    }

    const today = new Date();

    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric"
    };

    dateElement.textContent =
        today.toLocaleDateString("en-IN", options);
}


// ============================================
// LOAD ALL STUDENTS
// ============================================

async function loadStudents() {

    try {

        const response =
            await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Failed to load students");
        }

        students = await response.json();

        updateDashboard();

        displayStudents();

        displayRecentStudents();

    }

    catch (error) {

        console.error(error);

        showToast(
            "Unable to load student records",
            true
        );

    }

}


// ============================================
// DASHBOARD
// ============================================

function updateDashboard() {

    const totalStudents =
        students.length;


    // Total Students

    document.getElementById(
        "totalStudents"
    ).textContent = totalStudents;


    // Departments

    const departments =
        new Set(
            students.map(student =>
                student.department.trim().toUpperCase()
            )
        );

    document.getElementById(
        "totalDepartments"
    ).textContent = departments.size;


    // Average Marks

    let average = 0;

    if (students.length > 0) {

        const totalMarks =
            students.reduce(
                (sum, student) =>
                    sum + Number(student.marks),
                0
            );

        average =
            totalMarks / students.length;
    }

    document.getElementById(
        "averageMarks"
    ).textContent = average.toFixed(1);

}


// ============================================
// DISPLAY STUDENTS
// ============================================

function displayStudents() {

    const table =
        document.getElementById(
            "studentTable"
        );

    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">

                    <div class="empty-state-icon">
                        👨‍🎓
                    </div>

                    <strong>
                        No student records
                    </strong>

                    <span>
                        Add your first student to get started.
                    </span>

                </td>
            </tr>
        `;

        return;
    }


    students.forEach(student => {

        table.appendChild(
            createStudentRow(student)
        );

    });

}


// ============================================
// RECENT STUDENTS
// ============================================

function displayRecentStudents() {

    const table =
        document.getElementById(
            "recentStudentTable"
        );

    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">

                    <div class="empty-state-icon">
                        📋
                    </div>

                    <strong>
                        No recent students
                    </strong>

                    <span>
                        Student records will appear here.
                    </span>

                </td>
            </tr>
        `;

        return;
    }


    // Show latest 5 students

    const recentStudents =
        [...students]
            .reverse()
            .slice(0, 5);


    recentStudents.forEach(student => {

        table.appendChild(
            createStudentRow(student)
        );

    });

}


// ============================================
// CREATE STUDENT TABLE ROW
// ============================================

function createStudentRow(student) {

    const row =
        document.createElement("tr");


    const name =
        student.name || "Unknown";


    const department =
        student.department || "N/A";


    const marks =
        Number(student.marks);


    // Student initials

    const initials =
        getInitials(name);


    row.innerHTML = `

        <td>

            <div class="student-cell">

                <div class="student-avatar">
                    ${initials}
                </div>

                <div>

                    <div class="student-name">
                        ${escapeHTML(name)}
                    </div>

                    <div class="student-email">
                        Student
                    </div>

                </div>

            </div>

        </td>


        <td>
            <strong>
                #${student.roll}
            </strong>
        </td>


        <td>

            <span class="department-badge">

                ${escapeHTML(department)}

            </span>

        </td>


        <td>

            <div class="marks-cell">

                <span class="marks-number">
                    ${marks.toFixed(1)}%
                </span>

                <div class="marks-bar">

                    <div
                        class="marks-progress"
                        style="width:${Math.min(
                            Math.max(marks, 0),
                            100
                        )}%">
                    </div>

                </div>

            </div>

        </td>


        <td>

            <button
                class="action-btn edit-btn"
                onclick="openEditModal(${student.roll})"
                title="Edit Student">

                ✏️

            </button>


            <button
                class="action-btn delete-btn"
                onclick="deleteStudent(${student.roll})"
                title="Delete Student">

                🗑️

            </button>

        </td>

    `;


    return row;
}


// ============================================
// GET INITIALS
// ============================================

function getInitials(name) {

    const words =
        name.trim().split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


// ============================================
// ADD STUDENT
// ============================================

const studentForm =
    document.getElementById(
        "studentForm"
    );


if (studentForm) {

    studentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const roll =
                document.getElementById(
                    "roll"
                ).value.trim();


            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const department =
                document.getElementById(
                    "department"
                ).value.trim();


            const marks =
                document.getElementById(
                    "marks"
                ).value.trim();


            if (
                !roll ||
                !name ||
                !department ||
                marks === ""
            ) {

                showToast(
                    "Please fill all fields",
                    true
                );

                return;
            }


            if (
                Number(marks) < 0 ||
                Number(marks) > 100
            ) {

                showToast(
                    "Marks must be between 0 and 100",
                    true
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        "/api/students",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                roll: Number(roll),

                                name: name,

                                department:
                                    department,

                                marks:
                                    Number(marks)

                            })

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    showToast(
                        result.message ||
                        "Unable to add student",
                        true
                    );

                    return;
                }


                showToast(
                    "Student added successfully!"
                );


                studentForm.reset();


                await loadStudents();


                showSection(
                    "students"
                );

            }

            catch (error) {

                console.error(error);

                showToast(
                    "Something went wrong",
                    true
                );

            }

        }
    );

}


// ============================================
// SEARCH STUDENT
// ============================================

async function searchStudent() {

    const rollInput =
        document.getElementById(
            "searchRoll"
        );


    const resultBox =
        document.getElementById(
            "searchResult"
        );


    if (!rollInput || !resultBox) {
        return;
    }


    const roll =
        rollInput.value.trim();


    if (!roll) {

        showToast(
            "Enter a roll number",
            true
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/api/students/${roll}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            resultBox.innerHTML = `

                <div class="search-result-card">

                    <div class="empty-state">

                        <div class="empty-state-icon">
                            🔍
                        </div>

                        <strong>
                            Student Not Found
                        </strong>

                        <span>
                            No student exists with roll number #${roll}.
                        </span>

                    </div>

                </div>

            `;

            return;
        }


        const student =
            result.student;


        const initials =
            getInitials(student.name);


        resultBox.innerHTML = `

            <div class="search-result-card">

                <div class="search-result-header">

                    <div class="search-result-avatar">

                        ${initials}

                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(
                                student.name
                            )}
                        </h3>

                        <p>
                            Roll Number #${student.roll}
                        </p>

                    </div>

                </div>


                <div class="search-details">

                    <div class="detail-box">

                        <span>
                            ROLL NUMBER
                        </span>

                        <strong>
                            #${student.roll}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>
                            DEPARTMENT
                        </span>

                        <strong>
                            ${escapeHTML(
                                student.department
                            )}
                        </strong>

                    </div>


                    <div class="detail-box">

                        <span>
                            MARKS
                        </span>

                        <strong>
                            ${Number(
                                student.marks
                            ).toFixed(1)}%
                        </strong>

                    </div>

                </div>

            </div>

        `;

    }

    catch (error) {

        console.error(error);

        showToast(
            "Search failed",
            true
        );

    }

}


// ============================================
// EDIT STUDENT
// ============================================

function openEditModal(roll) {

    const student =
        students.find(
            s => Number(s.roll) === Number(roll)
        );


    if (!student) {
        return;
    }


    document.getElementById(
        "editRoll"
    ).value = student.roll;


    document.getElementById(
        "editName"
    ).value = student.name;


    document.getElementById(
        "editDepartment"
    ).value = student.department;


    document.getElementById(
        "editMarks"
    ).value = student.marks;


    const modal =
        document.getElementById(
            "editModal"
        );


    modal.style.display = "flex";

}


function closeModal() {

    const modal =
        document.getElementById(
            "editModal"
        );


    modal.style.display = "none";

}


// Close modal when clicking outside

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "editModal"
            );


        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


// ============================================
// UPDATE STUDENT
// ============================================

async function updateStudent() {

    const roll =
        document.getElementById(
            "editRoll"
        ).value;


    const name =
        document.getElementById(
            "editName"
        ).value.trim();


    const department =
        document.getElementById(
            "editDepartment"
        ).value.trim();


    const marks =
        document.getElementById(
            "editMarks"
        ).value;


    if (
        !name ||
        !department ||
        marks === ""
    ) {

        showToast(
            "Please fill all fields",
            true
        );

        return;
    }


    if (
        Number(marks) < 0 ||
        Number(marks) > 100
    ) {

        showToast(
            "Marks must be between 0 and 100",
            true
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/api/students/${roll}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        department:
                            department,

                        marks:
                            Number(marks)

                    })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            showToast(
                result.message ||
                "Update failed",
                true
            );

            return;
        }


        closeModal();


        showToast(
            "Student updated successfully!"
        );


        await loadStudents();

    }

    catch (error) {

        console.error(error);

        showToast(
            "Something went wrong",
            true
        );

    }

}


// ============================================
// DELETE STUDENT
// ============================================

async function deleteStudent(roll) {

    const student =
        students.find(
            s => Number(s.roll) === Number(roll)
        );


    const studentName =
        student
            ? student.name
            : "this student";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${studentName}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/students/${roll}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            showToast(
                result.message ||
                "Delete failed",
                true
            );

            return;
        }


        showToast(
            "Student deleted successfully!"
        );


        await loadStudents();

    }

    catch (error) {

        console.error(error);

        showToast(
            "Unable to delete student",
            true
        );

    }

}


// ============================================
// PAGE NAVIGATION
// ============================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(
            ".section"
        );


    sections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });


    const target =
        document.getElementById(
            sectionId
        );


    if (target) {

        target.classList.add(
            "active-section"
        );

    }


    // Update sidebar

    const menuItems =
        document.querySelectorAll(
            ".menu-item"
        );


    menuItems.forEach(item => {

        item.classList.remove(
            "active"
        );

    });


    const sectionTitles = {

        dashboard: [
            "Dashboard",
            "Overview of your student records and statistics."
        ],

        students: [
            "Students",
            "Manage all registered student records."
        ],

        addStudent: [
            "Add Student",
            "Create a new student record."
        ],

        searchStudent: [
            "Search Student",
            "Find a student using their roll number."
        ]

    };


    const information =
        sectionTitles[sectionId];


    if (information) {

        document.getElementById(
            "pageTitle"
        ).textContent =
            information[0];


        document.getElementById(
            "pageDescription"
        ).textContent =
            information[1];

    }


    // Activate matching menu item

    const menuMap = {

        dashboard: 0,

        students: 1,

        addStudent: 2,

        searchStudent: 3

    };


    const index =
        menuMap[sectionId];


    if (index !== undefined) {

        menuItems[index]
            ?.classList.add("active");

    }

}


// ============================================
// TABLE SEARCH
// ============================================

function filterTable() {

    const input =
        document.getElementById(
            "tableSearch"
        );


    const filter =
        input.value
            .toLowerCase()
            .trim();


    const table =
        document.getElementById(
            "studentTable"
        );


    const rows =
        table.querySelectorAll(
            "tr"
        );


    rows.forEach(row => {

        const text =
            row.textContent
                .toLowerCase();


        if (text.includes(filter)) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });

}


// ============================================
// TOAST MESSAGE
// ============================================

function showToast(
    message,
    error = false
) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    const toastIcon =
        document.querySelector(
            ".toast-icon"
        );


    if (!toast || !toastMessage) {
        return;
    }


    toastMessage.textContent =
        message;


    if (error) {

        toastIcon.textContent = "×";

        toastIcon.style.background =
            "#dc2626";

    }

    else {

        toastIcon.textContent = "✓";

        toastIcon.style.background =
            "#16a34a";

    }


    toast.style.display =
        "flex";


    setTimeout(
        function () {

            toast.style.display =
                "none";

        },
        3000
    );

}


// ============================================
// SECURITY
// Prevent HTML injection in student names
// ============================================

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}
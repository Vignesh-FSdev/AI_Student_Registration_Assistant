let editingStudentId = null;
let allStudents = [];

// ======================================
// Register / Update Student
// ======================================

document
.getElementById("studentForm")
.addEventListener("submit", saveStudent);

async function saveStudent(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value.trim();

    let url = "http://127.0.0.1:8000/register";
    let method = "POST";

    if (editingStudentId !== null) {

        url = `http://127.0.0.1:8000/students/${editingStudentId}`;
        method = "PUT";

    }

    document.getElementById("result").innerHTML =
    "⏳ Processing...";

    try {

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                course
            })

        });

        const data = await response.json();

        document.getElementById("result").innerHTML =
        "✅ " + data.message;

        document.getElementById("studentForm").reset();

        editingStudentId = null;

        loadStudents();

    }

    catch (error) {

        document.getElementById("result").innerHTML =
        "❌ Backend Connection Failed";

    }

}

// ======================================
// Load Students
// ======================================

async function loadStudents() {

    try {

        const response =
        await fetch("http://127.0.0.1:8000/students");

        allStudents = await response.json();

        displayStudents(allStudents);

        updateDashboard();

    }

    catch (error) {

        document.getElementById("studentList").innerHTML =
        "<h3>Unable to Load Students</h3>";

    }

}

// ======================================
// Display Students
// ======================================

function displayStudents(students) {

    const studentList =
    document.getElementById("studentList");

    studentList.innerHTML = "";

    if (students.length === 0) {

        studentList.innerHTML =
        "<h3>No Students Found</h3>";

        return;

    }

    students.forEach(student => {

        studentList.innerHTML += `

        <div class="student-card">

            <h3>${student.name}</h3>

            <p><strong>Email :</strong> ${student.email}</p>

            <p><strong>Course :</strong> ${student.course}</p>

            <button onclick="editStudent(
                '${student.id}',
                '${student.name}',
                '${student.email}',
                '${student.course}'
            )">

                ✏ Edit

            </button>

            <button onclick="deleteStudent('${student.id}')">

                🗑 Delete

            </button>

        </div>

        `;

    });

}

// ======================================
// Edit Student
// ======================================

function editStudent(id, name, email, course) {

    editingStudentId = id;

    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
    document.getElementById("course").value = course;

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

    document.getElementById("result").innerHTML =
    "✏ Editing Student... Click Save Student.";

}

// ======================================
// Delete Student
// ======================================

async function deleteStudent(id) {

    const confirmDelete =
    confirm("Delete this Student?");

    if (!confirmDelete) {

        return;

    }

    try {

        await fetch(

            `http://127.0.0.1:8000/students/${id}`,

            {

                method: "DELETE"

            }

        );

        document.getElementById("result").innerHTML =
        "🗑 Student Deleted Successfully";

        loadStudents();

    }

    catch {

        document.getElementById("result").innerHTML =
        "❌ Delete Failed";

    }

}

// ======================================
// Search Student
// ======================================

function searchStudent() {

    const keyword =

    document
    .getElementById("searchStudent")
    .value
    .toLowerCase();

    const filtered =

    allStudents.filter(student =>

        student.name.toLowerCase().includes(keyword) ||

        student.email.toLowerCase().includes(keyword) ||

        student.course.toLowerCase().includes(keyword)

    );

    displayStudents(filtered);

}

// ======================================
// Dashboard
// ======================================

function updateDashboard() {

    document.getElementById("totalStudents").innerText =
    allStudents.length;

    const uniqueCourses =

    [...new Set(

        allStudents.map(student => student.course)

    )];

    document.getElementById("totalCourses").innerText =
    uniqueCourses.length;

}

// ======================================
// AI Chat
// ======================================

async function askAI() {

    const question = document.getElementById("aiQuestion").value.trim();

    if (question === "") {

        alert("Please enter a question.");

        return;

    }

    const aiResponse = document.getElementById("aiResponse");

    aiResponse.innerHTML = "🤖 AI is thinking...";

    try {

        const response = await fetch("http://127.0.0.1:8000/ai-chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: question
            })

        });

        console.log("Status:", response.status);

        const data = await response.json();

        console.log("Response:", data);

        aiResponse.innerHTML = data.reply || data.error || "No Response";

    }

    catch (error) {

        console.error("FULL ERROR:", error);

        aiResponse.innerHTML = "❌ " + error.message;

    }

}
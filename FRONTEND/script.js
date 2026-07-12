let editingStudentId = null;
let allStudents = [];

// ======================================
// Backend URL
// ======================================

const API_URL =
"https://ai-student-registration-assistant.onrender.com";

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

    let url = `${API_URL}/register`;
    let method = "POST";

    if (editingStudentId !== null) {

        url = `${API_URL}/students/${editingStudentId}`;
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
        await fetch(`${API_URL}/students`);

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

            `${API_URL}/students/${id}`,

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

function askAI() {

    const aiResponse =
    document.getElementById("aiResponse");

    aiResponse.innerHTML =
    "🤖 AI Chat has been disabled in this deployed version.<br><br>It will return in Project 2 using the OpenAI API.";

}

// ======================================
// Page Load
// ======================================

loadStudents();
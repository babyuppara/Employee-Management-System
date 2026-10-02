/*
 * EmployeeHub frontend
 *
 * LOCAL:
 *   Start Spring Boot on port 8080.
 *   Keep the URL below as http://localhost:8080/api/employees
 *
 * ONLINE:
 *   GitHub Pages cannot run Spring Boot.
 *   After deploying your Spring Boot backend somewhere, replace
 *   API with that public backend URL.
 */

const API = "http://localhost:8080/api/employees";

let employees = [];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("employeeForm")
        .addEventListener("submit", saveEmployee);

    document.getElementById("modal")
        .addEventListener("click", e => {
            if (e.target.id === "modal") closeModal();
        });

    loadEmployees();
});

async function loadEmployees() {
    try {
        const res = await fetch(API);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        employees = await res.json();
        render(employees);
    } catch (error) {
        console.error("GET employees failed:", error);
        showError(
            "Could not connect to Spring Boot. Start Spring Boot and MySQL, then refresh."
        );
    }
}

function render(list) {
    const body = document.getElementById("employeeTable");
    const empty = document.getElementById("empty");

    body.innerHTML = "";

    if (!list.length) {
        empty.textContent = "No employees found.";
        empty.style.display = "block";
    } else {
        empty.style.display = "none";

        list.forEach(e => {
            body.innerHTML += `
                <tr>
                    <td>#${escapeHtml(e.id)}</td>
                    <td>
                        <div class="employee-name">${escapeHtml(e.name)}</div>
                        <div class="email">${escapeHtml(e.email)}</div>
                    </td>
                    <td><span class="badge">${escapeHtml(e.department)}</span></td>
                    <td>${escapeHtml(e.phone)}</td>
                    <td>₹${Number(e.salary).toLocaleString("en-IN")}</td>
                    <td>
                        <button class="action edit"
                                onclick="editEmployee(${e.id})">✎</button>
                        <button class="action delete"
                                onclick="deleteEmployee(${e.id})">🗑</button>
                    </td>
                </tr>`;
        });
    }

    document.getElementById("total").textContent = list.length;
    document.getElementById("it").textContent =
        list.filter(e => e.department === "IT").length;
    document.getElementById("hr").textContent =
        list.filter(e => e.department === "HR").length;
    document.getElementById("finance").textContent =
        list.filter(e => e.department === "Finance").length;
}

async function searchEmployees() {
    const keyword = document.getElementById("search").value.trim();

    if (!keyword) {
        render(employees);
        return;
    }

    try {
        const res = await fetch(
            `${API}/search?keyword=${encodeURIComponent(keyword)}`
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        render(await res.json());
    } catch (error) {
        console.error("Search failed:", error);
        showError("Search could not connect to the backend.");
    }
}

function openModal(employee = null) {
    document.getElementById("modal").classList.add("show");
    document.getElementById("formError").textContent = "";

    document.getElementById("modalTitle").textContent =
        employee ? "Edit Employee" : "Add Employee";

    document.getElementById("employeeId").value = employee?.id || "";
    document.getElementById("name").value = employee?.name || "";
    document.getElementById("email").value = employee?.email || "";
    document.getElementById("department").value = employee?.department || "";
    document.getElementById("phone").value = employee?.phone || "";
    document.getElementById("salary").value = employee?.salary ?? "";
}

function closeModal() {
    document.getElementById("modal").classList.remove("show");
}

async function saveEmployee(event) {
    event.preventDefault();

    const errorBox = document.getElementById("formError");
    errorBox.textContent = "";

    const id = document.getElementById("employeeId").value;

    const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value,
        phone: document.getElementById("phone").value.trim(),
        salary: Number(document.getElementById("salary").value)
    };

    if (!data.name || !data.email || !data.department ||
        !data.phone || !data.salary || data.salary <= 0) {
        errorBox.textContent = "Please fill all details correctly.";
        return;
    }

    try {
        const res = await fetch(id ? `${API}/${id}` : API, {
            method: id ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const serverMessage = await res.text();
            console.error("Save failed:", res.status, serverMessage);

            if (res.status === 409) {
                errorBox.textContent = "This email already exists.";
            } else if (res.status === 400) {
                errorBox.textContent =
                    "Please check the details. Name, email, department, phone and positive salary are required.";
            } else {
                errorBox.textContent =
                    `Server error (${res.status}). Check Spring Boot console.`;
            }
            return;
        }

        closeModal();
        await loadEmployees();

    } catch (error) {
        console.error("Save request failed:", error);
        errorBox.textContent =
            "Backend is not reachable. Start Spring Boot and MySQL first.";
    }
}

async function editEmployee(id) {
    try {
        const res = await fetch(`${API}/${id}`);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const employee = await res.json();
        openModal(employee);

    } catch (error) {
        console.error("Edit load failed:", error);
        alert("Could not load this employee.");
    }
}

async function deleteEmployee(id) {
    if (!confirm("Delete this employee?")) return;

    try {
        const res = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        await loadEmployees();

    } catch (error) {
        console.error("Delete failed:", error);
        alert("Could not delete employee. Check the backend.");
    }
}

function showError(message) {
    const empty = document.getElementById("empty");
    empty.textContent = message;
    empty.style.display = "block";
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[m]));
}

loadEmployees();

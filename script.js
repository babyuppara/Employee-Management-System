const API = "/api/employees";
let employees = [];

async function loadEmployees() {
    try {
        const res = await fetch(API);
        employees = await res.json();
        render(employees);
    } catch (e) {
        showError("Could not connect to the server. Make sure Spring Boot and MySQL are running.");
    }
}

function render(list) {
    const body = document.getElementById("employeeTable");
    const empty = document.getElementById("empty");
    body.innerHTML = "";
    empty.style.display = list.length ? "none" : "block";

    list.forEach(e => {
        body.innerHTML += `
        <tr>
          <td>#${e.id}</td>
          <td><div class="employee-name">${escapeHtml(e.name)}</div><div class="email">${escapeHtml(e.email)}</div></td>
          <td><span class="badge">${escapeHtml(e.department)}</span></td>
          <td>${escapeHtml(e.phone)}</td>
          <td>₹${Number(e.salary).toLocaleString("en-IN")}</td>
          <td>
            <button class="action edit" onclick="editEmployee(${e.id})">✎</button>
            <button class="action delete" onclick="deleteEmployee(${e.id})">🗑</button>
          </td>
        </tr>`;
    });

    document.getElementById("total").textContent = employees.length;
    document.getElementById("it").textContent = employees.filter(e => e.department === "IT").length;
    document.getElementById("hr").textContent = employees.filter(e => e.department === "HR").length;
    document.getElementById("finance").textContent = employees.filter(e => e.department === "Finance").length;
}

async function searchEmployees() {
    const keyword = document.getElementById("search").value.trim();
    if (!keyword) return render(employees);
    const res = await fetch(`${API}/search?keyword=${encodeURIComponent(keyword)}`);
    render(await res.json());
}

function openModal(employee = null) {
    document.getElementById("modal").classList.add("show");
    document.getElementById("formError").textContent = "";
    document.getElementById("modalTitle").textContent = employee ? "Edit Employee" : "Add Employee";
    document.getElementById("employeeId").value = employee?.id || "";
    document.getElementById("name").value = employee?.name || "";
    document.getElementById("email").value = employee?.email || "";
    document.getElementById("department").value = employee?.department || "";
    document.getElementById("phone").value = employee?.phone || "";
    document.getElementById("salary").value = employee?.salary || "";
}
function closeModal(){document.getElementById("modal").classList.remove("show")}

document.getElementById("employeeForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const id = document.getElementById("employeeId").value;
    const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value,
        phone: document.getElementById("phone").value.trim(),
        salary: Number(document.getElementById("salary").value)
    };
    const res = await fetch(id ? `${API}/${id}` : API, {
        method: id ? "PUT" : "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });
    if(!res.ok){document.getElementById("formError").textContent="Please check the details and try again.";return;}
    closeModal();
    loadEmployees();
});

async function editEmployee(id) {
    const res = await fetch(`${API}/${id}`);
    openModal(await res.json());
}
async function deleteEmployee(id) {
    if(!confirm("Delete this employee?")) return;
    await fetch(`${API}/${id}`, {method:"DELETE"});
    loadEmployees();
}
function showError(msg){document.getElementById("empty").textContent=msg;document.getElementById("empty").style.display="block"}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
document.getElementById("modal").addEventListener("click", e => {if(e.target.id==="modal") closeModal()});
loadEmployees();

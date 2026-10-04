const STORAGE_KEY = "eemployeehub_employees_v1";

function getEmployees() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveEmployees(employees) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

function nextId(employees) {
  return employees.length ? Math.max(...employees.map(e => Number(e.id))) + 1 : 1;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN", {maximumFractionDigits: 2});
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function employeeRow(emp) {
  return `<tr>
    <td>${emp.id}</td>
    <td><strong>${escapeHtml(emp.name)}</strong></td>
    <td>${escapeHtml(emp.email)}</td>
    <td>${escapeHtml(emp.department)}</td>
    <td>${escapeHtml(emp.phone)}</td>
    <td>${money(emp.salary)}</td>
    <td class="actions">
      <button class="edit-btn" onclick="editEmployee(${emp.id})">Edit</button>
      <button class="delete-btn" onclick="deleteEmployee(${emp.id})">Delete</button>
    </td>
  </tr>`;
}

function renderDashboard() {
  const employees = getEmployees();
  document.getElementById("total-count").textContent = employees.length;
  document.getElementById("it-count").textContent = employees.filter(e => e.department === "IT").length;
  document.getElementById("hr-count").textContent = employees.filter(e => e.department === "HR").length;
  document.getElementById("finance-count").textContent = employees.filter(e => e.department === "Finance").length;

  const recent = [...employees].reverse().slice(0, 5);
  const table = document.getElementById("dashboard-table");
  table.innerHTML = recent.map(employeeRow).join("");
  document.getElementById("dashboard-empty").classList.toggle("hidden", recent.length > 0);
}

function renderEmployees() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const dept = document.getElementById("department-filter").value;
  let employees = getEmployees();

  employees = employees.filter(e => {
    const matchesSearch = !query || [e.name,e.email,e.department,e.phone,String(e.id)]
      .some(v => String(v).toLowerCase().includes(query));
    const matchesDept = !dept || e.department === dept;
    return matchesSearch && matchesDept;
  });

  document.getElementById("employee-table").innerHTML = employees.map(employeeRow).join("");
  document.getElementById("employee-empty").classList.toggle("hidden", employees.length > 0);
}

function refresh() {
  renderDashboard();
  renderEmployees();
}

function resetForm() {
  document.getElementById("employee-form").reset();
  document.getElementById("emp-id").value = "";
  document.getElementById("form-title").textContent = "Add Employee";
}

function editEmployee(id) {
  const emp = getEmployees().find(e => Number(e.id) === Number(id));
  if (!emp) return;
  showPage("add");
  document.getElementById("emp-id").value = emp.id;
  document.getElementById("name").value = emp.name;
  document.getElementById("email").value = emp.email;
  document.getElementById("department").value = emp.department;
  document.getElementById("phone").value = emp.phone;
  document.getElementById("salary").value = emp.salary;
  document.getElementById("form-title").textContent = "Edit Employee";
}

function deleteEmployee(id) {
  const employees = getEmployees();
  const emp = employees.find(e => Number(e.id) === Number(id));
  if (!emp) return;
  if (!confirm(`Delete employee "${emp.name}"?`)) return;
  saveEmployees(employees.filter(e => Number(e.id) !== Number(id)));
  refresh();
  showToast("Employee deleted");
}

function showPage(page) {
  const pages = ["dashboard","employees","add","settings"];
  pages.forEach(p => document.getElementById(`${p}-page`).classList.toggle("hidden", p !== page));

  document.querySelectorAll(".nav-link").forEach(a => a.classList.toggle("active", a.dataset.page === page));

  const titles = {
    dashboard:["Employee Management","Dashboard overview"],
    employees:["Employees","Manage your employee records"],
    add:[document.getElementById("emp-id").value ? "Edit Employee" : "Add Employee","Enter employee details below"],
    settings:["Settings","Manage local application data"]
  };
  document.getElementById("page-title").textContent = titles[page][0];
  document.getElementById("page-subtitle").textContent = titles[page][1];

  if (page === "dashboard") renderDashboard();
  if (page === "employees") renderEmployees();
  if (page === "add") document.getElementById("page-title").textContent = document.getElementById("form-title").textContent;
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    showPage(link.dataset.page);
    history.replaceState(null, "", "#" + link.dataset.page);
  });
});

document.querySelectorAll("[data-page-target]").forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.pageTarget;
    showPage(page);
    history.replaceState(null, "", "#" + page);
  });
});

document.getElementById("top-add").addEventListener("click", () => {
  resetForm();
  showPage("add");
  history.replaceState(null, "", "#add");
});

document.getElementById("employee-form").addEventListener("submit", e => {
  e.preventDefault();
  const employees = getEmployees();
  const id = document.getElementById("emp-id").value;

  const employee = {
    id: id ? Number(id) : nextId(employees),
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    department: document.getElementById("department").value,
    phone: document.getElementById("phone").value.trim(),
    salary: Number(document.getElementById("salary").value)
  };

  if (id) {
    const index = employees.findIndex(e => Number(e.id) === Number(id));
    employees[index] = employee;
    showToast("Employee updated successfully");
  } else {
    employees.push(employee);
    showToast("Employee added successfully");
  }

  saveEmployees(employees);
  refresh();
  resetForm();
  showPage("employees");
  history.replaceState(null, "", "#employees");
});

document.getElementById("clear-form").addEventListener("click", resetForm);
document.getElementById("search").addEventListener("input", renderEmployees);
document.getElementById("department-filter").addEventListener("change", renderEmployees);

document.getElementById("clear-all").addEventListener("click", () => {
  if (!getEmployees().length) return showToast("No employee data to clear");
  if (!confirm("Delete ALL employee records? This cannot be undone.")) return;
  localStorage.removeItem(STORAGE_KEY);
  refresh();
  showToast("All employee data cleared");
});

window.addEventListener("hashchange", () => {
  const page = location.hash.replace("#", "");
  showPage(["dashboard","employees","add","settings"].includes(page) ? page : "dashboard");
});

const initialPage = location.hash.replace("#", "");
showPage(["dashboard","employees","add","settings"].includes(initialPage) ? initialPage : "dashboard");

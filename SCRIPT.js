// ===== التنقل بين الواجهات =====
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function enterTeacher() {
  show("loginScreen");
}

function enterStudent() {
  show("studentApp");
  studentView();
}

function logout() {
  show("mainScreen");
}

// ===== كلمة مرور المدرس =====
const PASSWORD = "1234"; // تگدر تغيرها

function checkPassword() {
  const pass = document.getElementById("teacherPass").value;
  if (pass === PASSWORD) {
    show("teacherApp");
    render();
  } else {
    alert("كلمة المرور خطأ");
  }
}

// ===== تخزين البيانات =====
function getData() {
  return JSON.parse(localStorage.getItem("grades") || "[]");
}

function saveData(data) {
  localStorage.setItem("grades", JSON.stringify(data));
}

// ===== إضافة سجل =====
function addRecord() {
  const year = document.getElementById("year").value;
  const cls = document.getElementById("class").value;
  const seat = document.getElementById("seat").value;
  const name = document.getElementById("name").value;
  const subject = document.getElementById("subject").value;
  const grade = document.getElementById("grade").value;

  if (!seat || !name || !subject || grade === "") {
    alert("املأ كل الحقول");
    return;
  }

  const data = getData();

  data.push({
    year,
    class: cls,
    seat,
    name,
    subject,
    grade: Number(grade)
  });

  saveData(data);
  clearInputs();
  render();
}

// ===== تفريغ الحقول =====
function clearInputs() {
  document.querySelectorAll("#teacherApp input").forEach(i => i.value = "");
}

// ===== حذف سجل =====
function deleteRecord(index) {
  const data = getData();
  data.splice(index, 1);
  saveData(data);
  render();
}

// ===== عرض البيانات (للمدرس) =====
let chart;

function render() {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  const search = document.getElementById("search").value.toLowerCase();
  const subjectFilter = document.getElementById("subjectFilter").value;

  const data = getData();

  let count = 0;
  const subjectStats = {};

  data.forEach((rec, index) => {
    if (
      rec.name.toLowerCase().includes(search) ||
      rec.seat.includes(search)
    ) {
      if (subjectFilter && rec.subject !== subjectFilter) return;

      count++;

      const status = rec.grade >= 50 ? "ناجح" : "راسب";
      const cls = rec.grade >= 50 ? "pass" : "fail";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rec.seat}</td>
        <td>${rec.name}</td>
        <td>${rec.subject}</td>
        <td>${rec.grade}</td>
        <td class="${cls}">${status}</td>
        <td><button onclick="deleteRecord(${index})">حذف</button></td>
      `;
      tbody.appendChild(tr);

      subjectStats[rec.subject] = (subjectStats[rec.subject] || 0) + 1;
    }
  });

  document.getElementById("stats").innerText = "عدد السجلات: " + count;

  drawChart(subjectStats);
}

// ===== رسم المخطط =====
function drawChart(stats) {
  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(stats),
      datasets: [{
        label: "عدد الطلاب بكل مادة",
        data: Object.values(stats)
      }]
    }
  });
}

// ===== عرض الطالب =====
function studentView() {
  const tbody = document.getElementById("studentTable");
  tbody.innerHTML = "";

  const search = document.getElementById("studentSearch").value.toLowerCase();
  const data = getData();

  data.forEach(rec => {
    if (
      rec.name.toLowerCase().includes(search) ||
      rec.seat.includes(search)
    ) {
      const status = rec.grade >= 50 ? "ناجح" : "راسب";
      const cls = rec.grade >= 50 ? "pass" : "fail";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rec.subject}</td>
        <td>${rec.grade}</td>
        <td class="${cls}">${status}</td>
      `;
      tbody.appendChild(tr);
    }
  });
}

// ===== طباعة =====
function printRecords() {
  window.print();
}

// ===== تحميل البيانات عند فتح الصفحة =====
document.addEventListener("DOMContentLoaded", render);

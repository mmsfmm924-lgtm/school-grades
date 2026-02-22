// بيانات الطلاب (مؤقتًا باستخدام localStorage)
let students = JSON.parse(localStorage.getItem("students") || "[]");

// شاشات
const mainScreen = document.getElementById("mainScreen");
const loginScreen = document.getElementById("loginScreen");
const teacherApp = document.getElementById("teacherApp");
const studentApp = document.getElementById("studentApp");

// مدخلات
const teacherPass = document.getElementById("teacherPass");
const tbody = document.getElementById("tbody");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("search");
const subjectFilter = document.getElementById("subjectFilter");

// كلمة مرور المدرس
const PASSWORD = "1234";

// دوال التنقل بين الشاشات
function showScreen(screen) {
  [mainScreen, loginScreen, teacherApp, studentApp].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function enterTeacher() { showScreen(loginScreen); }
function enterStudent() { showScreen(studentApp); }
function logout() { showScreen(mainScreen); }

// التحقق من كلمة المرور
function checkPassword() {
  if (teacherPass.value === PASSWORD) {
    showScreen(teacherApp);
    render();
    teacherPass.value = "";
  } else {
    alert("كلمة المرور خاطئة!");
  }
}

// إضافة سجل طالب
function addRecord() {
  const year = document.getElementById("year").value;
  const className = document.getElementById("class").value;
  const seat = document.getElementById("seat").value;
  const name = document.getElementById("name").value;
  const subject = document.getElementById("subject").value;
  const grade = Number(document.getElementById("grade").value);

  if(!year || !className || !seat || !name || !subject || !grade) {
    alert("يرجى ملء جميع الحقول!");
    return;
  }

  students.push({ year, className, seat, name, subject, grade });
  localStorage.setItem("students", JSON.stringify(students));
  clearInputs();
  render();
}

// مسح الحقول
function clearInputs() {
  ["year","class","seat","name","subject","grade"].forEach(id => document.getElementById(id).value = "");
}

// عرض بيانات المدرس
function render() {
  const filterText = searchInput.value.toLowerCase();
  const subject = subjectFilter.value;
  tbody.innerHTML = "";

  let filtered = students.filter(s => 
    (s.name.toLowerCase().includes(filterText) || s.seat.includes(filterText)) &&
    (subject === "" || s.subject === subject)
  );

  filtered.forEach((s, index) => {
    const status = s.grade >= 50 ? "pass" : "fail";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.seat}</td>
      <td>${s.name}</td>
      <td>${s.subject}</td>
      <td>${s.grade}</td>
      <td class="${status}">${status.toUpperCase()}</td>
      <td><button onclick="deleteRecord(${index})">حذف</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("stats").textContent = `عدد السجلات: ${filtered.length}`;
  renderChart(filtered);
}

// حذف سجل
function deleteRecord(index) {
  if(confirm("هل أنت متأكد من الحذف؟")) {
    students.splice(index,1);
    localStorage.setItem("students", JSON.stringify(students));
    render();
  }
}

// عرض بيانات الطالب
function studentView() {
  const filterText = document.getElementById("studentSearch").value.toLowerCase();
  studentTable.innerHTML = "";

  let filtered = students.filter(s => 
    s.name.toLowerCase().includes(filterText) || s.seat.includes(filterText)
  );

  filtered.forEach(s => {
    const status = s.grade >= 50 ? "pass" : "fail";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.subject}</td>
      <td>${s.grade}</td>
      <td class="${status}">${status.toUpperCase()}</td>
    `;
    studentTable.appendChild(tr);
  });
}

// رسم البياني
let chart;
function renderChart(data) {
  const ctx = document.getElementById('chart').getContext('2d');
  const subjects = [...new Set(data.map(s=>s.subject))];
  const averages = subjects.map(sub => {
    const grades = data.filter(s=>s.subject===sub).map(s=>s.grade);
    return grades.reduce((a,b)=>a+b,0)/grades.length;
  });

  if(chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: subjects,
      datasets: [{
        label: 'متوسط الدرجة لكل مادة',
        data: averages,
        backgroundColor: '#28a745'
      }]
    },
    options: { responsive:true, plugins:{ legend:{ display:false } } }
  });
}

// طباعة السجلات
function printRecords() {
  let printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write("<h1>سجلات الطلاب</h1>");
  printWindow.document.write(document.getElementById("tbody").outerHTML);
  printWindow.print();
  printWindow.close();
}
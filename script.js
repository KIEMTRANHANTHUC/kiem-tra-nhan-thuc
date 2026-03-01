let quizData = {
  bo1: [],
  bo2: [],
  bo3: []
};

let currentBo = "";
let passScore = 18; // >=18 đạt
let totalQuestions = 20;

// =======================
// UPLOAD DOCX (ADMIN)
// =======================

async function uploadDocx() {
  const fileInput = document.getElementById("docxFile");
  const bo = document.getElementById("targetBo").value;

  if (!fileInput.files.length) {
    alert("Chọn file .docx trước!");
    return;
  }

  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();

  const mammoth = await import("https://cdn.jsdelivr.net/npm/mammoth@1.4.21/mammoth.browser.min.js");

  mammoth.extractRawText({ arrayBuffer: arrayBuffer })
    .then(result => {
      const text = result.value;
      quizData[bo] = parseDocxToQuiz(text);
      alert("Đã cập nhật bộ câu hỏi cho " + bo);
    });
}

// =======================
// PARSE DOCX TEXT
// =======================

function parseDocxToQuiz(text) {
  let questions = [];
  const blocks = text.split("\n\n");

  blocks.forEach(block => {
    const lines = block.split("\n");
    if (lines.length >= 5) {
      const question = lines[0];
      const answers = [];
      for (let i = 1; i <= 4; i++) {
        const isCorrect = lines[i].includes("*"); 
        answers.push({
          text: lines[i].replace("*",""),
          correct: isCorrect
        });
      }
      questions.push({ question, answers });
    }
  });

  return questions;
}

// =======================
// START QUIZ
// =======================

function startQuiz(bo) {
  if (!quizData[bo] || quizData[bo].length === 0) {
    alert("Bộ câu hỏi chưa được tải!");
    return;
  }

  currentBo = bo;

  document.getElementById("menu").style.display = "none";
  document.getElementById("quizForm").style.display = "block";
  document.getElementById("submitBtn").style.display = "block";
  document.getElementById("info").style.display = "block";

  renderQuestions();
}

function renderQuestions() {
  const form = document.getElementById("quizForm");
  form.innerHTML = "";

  quizData[currentBo].forEach((q, index) => {
    let html = `<div class="question-box">
    <div class="question-title">${q.question}</div>`;

    q.answers.forEach((a, i) => {
      html += `
      <label>
      <input type="radio" name="q${index}" value="${i}" onchange="updateProgress()">
      ${a.text}
      </label><br>`;
    });

    html += "</div>";
    form.innerHTML += html;
  });
}

// =======================
// PROGRESS
// =======================

function updateProgress() {
  const answered = document.querySelectorAll("input[type=radio]:checked").length;
  document.getElementById("answeredCount").innerText = answered;
  const percent = (answered / quizData[currentBo].length) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

// =======================
// SUBMIT
// =======================

function submitQuiz() {
  let score = 0;

  quizData[currentBo].forEach((q, index) => {
    const selected = document.querySelector(`input[name=q${index}]:checked`);
    if (selected) {
      if (q.answers[selected.value].correct) score++;
    }
  });

  const resultDiv = document.getElementById("result");

  if (score >= passScore) {
    resultDiv.innerHTML = `
      <div class="score">
      KẾT QUẢ: ${score}/${quizData[currentBo].length} <br><br>
      <span style="color:green">CHÚC MỪNG ĐÃ ĐẠT ĐƯỢC KẾT QUẢ CAO</span>
      </div>`;
  } else {
    resultDiv.innerHTML = `
      <div class="score">
      KẾT QUẢ: ${score}/${quizData[currentBo].length} <br><br>
      <span style="color:red">KHÔNG ĐẠT</span><br>
      Bạn cần ôn luyện thêm
      </div>`;
  }

  document.getElementById("submitBtn").style.display = "none";
}

let questionBank = {};
let currentQuestions = [];
let timerInterval;
let timeLeft = 1200;

function shuffle(array){
return array.sort(()=>Math.random()-0.5);
}

// Load câu hỏi từ file JSON
fetch('questions.json')
.then(response => response.json())
.then(data => {
questionBank = data;
})
.catch(error => {
alert("Lỗi tải ngân hàng câu hỏi!");
console.error(error);
});

function startQuiz(type){

if(!questionBank[type]){
alert("Chưa tải được câu hỏi!");
return;
}

document.getElementById("menu").style.display="none";
document.getElementById("quizForm").style.display="block";
document.getElementById("submitBtn").style.display="inline-block";
document.getElementById("info").style.display="block";
document.getElementById("result").innerHTML="";

currentQuestions = shuffle([...questionBank[type]]).slice(0,20);

renderQuestions();
startTimer();
}

function renderQuestions(){
let form=document.getElementById("quizForm");
form.innerHTML="";

currentQuestions.forEach((q,index)=>{

let div=document.createElement("div");
div.className="question-box";

div.innerHTML=`<div class="question-title">
Câu ${index+1}: ${q.question}
</div>`;

let shuffledAnswers = shuffle([...q.answers]);

shuffledAnswers.forEach((a,i)=>{
div.innerHTML+=`
<label>
<input type="radio" name="q${index}" value="${i}" onchange="updateProgress()">
${a.text}
</label><br>`;
});

q.answers = shuffledAnswers;

form.appendChild(div);
});
}

function updateProgress(){
let answered=document.querySelectorAll("input[type=radio]:checked").length;
document.getElementById("answeredCount").innerText=answered;
document.getElementById("progressBar").style.width=(answered/currentQuestions.length*100)+"%";
}

function startTimer(){
timeLeft=1200;
clearInterval(timerInterval);
timerInterval=setInterval(()=>{
let m=Math.floor(timeLeft/60);
let s=timeLeft%60;
document.getElementById("timer").innerHTML=
"Thời gian: "+m+":"+(s<10?"0":"")+s;
timeLeft--;
if(timeLeft<0){clearInterval(timerInterval);submitQuiz();}
},1000);
}

function submitQuiz(){
clearInterval(timerInterval);
let score=0;

currentQuestions.forEach((q,index)=>{
let selected=document.querySelector(`input[name="q${index}"]:checked`);
let labels=document.querySelectorAll(`input[name="q${index}"]`);

labels.forEach((input,i)=>{
let parent=input.parentElement;
parent.innerHTML=input.nextSibling.textContent;

if(q.answers[i].correct){
parent.innerHTML+=" <span class='correct-icon'>✓</span>";
}

if(selected && i==selected.value && !q.answers[i].correct){
parent.innerHTML+=" <span class='wrong-icon'>✗</span>";
}
});

if(selected && q.answers[selected.value].correct){
score++;
}
});

let status = score>=18
? "<div style='color:green;font-size:22px;font-weight:bold;'>KẾT QUẢ: ĐẠT</div>"
: "<div style='color:red;font-size:22px;font-weight:bold;'>KẾT QUẢ: KHÔNG ĐẠT</div>";

document.getElementById("submitBtn").style.display="none";

document.getElementById("result").innerHTML=`
<div class="score">Điểm số: ${score}/${currentQuestions.length}</div>
${status}
<button class="home-btn" onclick="goHome()">Quay về trang chủ</button>
`;
}

function goHome(){
document.getElementById("menu").style.display="block";
document.getElementById("quizForm").style.display="none";
document.getElementById("submitBtn").style.display="none";
document.getElementById("info").style.display="none";
document.getElementById("quizForm").innerHTML="";
document.getElementById("result").innerHTML="";
document.getElementById("answeredCount").innerText="0";
document.getElementById("progressBar").style.width="0%";
clearInterval(timerInterval);
}

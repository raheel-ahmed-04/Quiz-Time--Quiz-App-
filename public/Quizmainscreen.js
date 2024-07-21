const totalQuestionsText = document.querySelector("#totalQs");
const QuestionNumberText = document.querySelector("#QuestionNumber");

class Question {
  constructor(question, mark, option1, option2, option3, option4, answer) {
    this.question = question;
    this.mark = mark;
    this.option1 = option1;
    this.option2 = option2;
    this.option3 = option3;
    this.option4 = option4;
    this.answer = answer;
  }
}
function Student(email, acquiredMarks) {
  this.email = email;
  this.acquiredMarks = acquiredMarks;
}
class Quiz {
  constructor(name, subject, totalquestion) {
    this.name = name;
    this.subject = subject;
    this.questions = [];
    this.attempted = [];
    this.totalquestion = totalquestion;
    // this.acquiredMarks = 0;
  }

  addattempted(email, acquiredMarks) {
    this.attempted.push(new Student(email, acquiredMarks));
  }

  addQuestion(question) {
    if (question instanceof Question) {
      this.questions.push(question);
    } else {
      console.log("Only instances of Question can be added to the Quiz.");
    }
  }

  totalMarks() {
    return this.questions.reduce((total, question) => total + question.mark, 0);
  }

  // calculateMarks(question, userInput) {
  //   if (question.answer === userInput) {
  //     this.acquiredMarks += question.mark;
  //   }
  // }

  static fromObject(obj) {
    const quiz = new Quiz(obj.name, obj.subject, obj.totalquestion);
    quiz.questions = obj.questions.map(
      (q) =>
        new Question(
          q.question,
          q.mark,
          q.option1,
          q.option2,
          q.option3,
          q.option4,
          q.answer
        )
    );
    quiz.attempted = obj.attempted.map(
      (a) => new Student(a.email, a.acquiredMarks)
    );
    // quiz.acquiredMarks = obj.acquiredMarks;
    quiz.totalquestion = obj.totalquestion;
    return quiz;
  }
}

if (!localStorage.getItem("QuestionNumber")) {
  localStorage.setItem("QuestionNumber", "1");
}
if (!localStorage.getItem("lastIndex")) {
  localStorage.setItem("lastIndex", "0");
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname === "/Quiz_Creation") {
    // Load the last quiz from local storage
    let quiz = loadLastQuizFromLocalStorage();
    if (quiz) {
      // Update the totalQuestionsText element
      totalQuestionsText.textContent = quiz.totalquestion;
      let Q_no = parseInt(localStorage.getItem("QuestionNumber"), 10);
      QuestionNumberText.textContent = Q_no;
    }
  }
  if (window.location.pathname === "/Quizmainscreen") {
    // Load the last quiz from local storage
    fetchQuiz();

    // let q = loadLastQuizFromLocalStorage();

    // const newDiv = document.createElement("div");
    // const newDivquizname = document.createElement("div");
    // const newDivsubjectname = document.createElement("div");
    // const img = document.createElement("img");

    // // Set attributes and content
    // img.src = "images/Frame 251.svg";
    // newDiv.classList.add("quizbox");
    // newDivquizname.classList.add("quizname");
    // newDivsubjectname.classList.add("subject");
    // newDivquizname.textContent = q.name; // Assuming quiz.name contains the quiz name
    // newDivsubjectname.textContent = q.subject; // Assuming quiz.subject contains the subject name

    // // Append the children to the newDiv
    // newDiv.append(img);
    // newDiv.append(newDivquizname);
    // newDiv.append(newDivsubjectname);

    // // Append the newDiv to the parent container
    // const parentElement = document.querySelector(".dynamicquiz"); // Select the parent container
    // parentElement.append(newDiv);

    // --------------------------------------------------------------------------------------------

    // const srNo = document.createElement("p");
    // const quiz = document.createElement("p");
    // const totalMarks = document.createElement("p");
    // const obtainedMarks = document.createElement("p");
    // const dynamicresult = document.createElement("div");

    // dynamicresult.classList.add("dynamicresult");

    // srNo.textContent = "db";
    // quiz.textContent = q.name;
    // totalMarks.textContent = q.totalquestion;
    // obtainedMarks.textContent = "db";

    // dynamicresult.append(srNo, quiz, totalMarks, obtainedMarks);
    // const result = document.querySelector(".results"); // Select the parent container
    // result.append(dynamicresult);
  }

  if (window.location.pathname === "/Student_Quiz.html") {
    // Load the last quiz from local storage
    let quiz = loadLastQuizFromLocalStorage();
    if (quiz) {
      // Update the totalQuestionsText element
      totalQuestionsText.textContent = quiz.totalquestion;
      let Q_no = parseInt(localStorage.getItem("QuestionNumber"), 10);
      QuestionNumberText.textContent = Q_no;

      let Ques = document.querySelector(".Question");
      let opt1 = document.querySelector("#option1");
      let opt2 = document.querySelector("#option2");
      let opt3 = document.querySelector("#option3");
      let opt4 = document.querySelector("#option4");
      let correct_option = document.querySelector("#correct_option");

      let Quiz_Question = quiz.questions;
      Ques.textContent = Quiz_Question[0].question;
      opt1.textContent = Quiz_Question[0].option1;
      opt2.textContent = Quiz_Question[0].option2;
      opt3.textContent = Quiz_Question[0].option3;
      opt4.textContent = Quiz_Question[0].option4;
    }
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.classList.contains("form1")) {
    event.preventDefault();
    const quizname = document.querySelector("#Quizname");
    const subject = document.querySelector("#subject");
    const totalquestions = document.querySelector("#TotalQuestions");
    const btn = document.querySelector(".submit_btn");

    const form = document.querySelector("#quizForm");

    let quiz = new Quiz(quizname.value, subject.value, totalquestions.value);
    // ------------------------------------------------------------------------
    // sendQuiz(quiz);
    // ------------------------------------------------------------------------
    storeObjecttoLS(quiz);
    window.location.href = "http://localhost:4000/Quiz_Creation";
    console.log("new page");
  }
  if (event.target.classList.contains("form2")) {
    event.preventDefault();
    let Ques = document.querySelector(".Question");
    let option1 = document.querySelector("#option1");
    let option2 = document.querySelector("#option2");
    let option3 = document.querySelector("#option3");
    let option4 = document.querySelector("#option4");
    let correct_option = document.querySelector("#correct_option");

    let form = document.querySelector("#Quiz_Creation_form");

    let q = Ques.textContent.trim();
    let op1 = option1.value;
    let op2 = option2.value;
    let op3 = option3.value;
    let op4 = option4.value;
    let answer = correct_option.value;
    console.log(q, op1, op2, op3, op4, answer);

    if (q && op1 && op2 && op3 && op4 && answer) {
      let quiz = loadLastQuizFromLocalStorage();
      let constructedques = new Question(q, 1, op1, op2, op3, op4, answer);
      quiz.addQuestion(constructedques);
      console.log(quiz);
      storeObjectToLastIndex(quiz);

      let Q_no = parseInt(localStorage.getItem("QuestionNumber"), 10);
      Q_no += 1;
      if (Q_no > quiz.totalquestion) {
        //quiz creation completed
        console.log("Quiz Creation Completed");
        //RESET THE QUIZ COUNTER
        window.location.href = "http://localhost:4000/Quizmainscreen";
        sendQuiz(quiz);
        localStorage.setItem("QuestionNumber", "1");
      } else {
        localStorage.setItem("QuestionNumber", Q_no.toString());
        //move to next question
        Ques.textContent = "Write New Question?";
        option1.value = "";
        option2.value = "";
        option3.value = "";
        option4.value = "";
        correct_option = "";
        QuestionNumberText.textContent = localStorage.getItem("QuestionNumber");
      }
    } else {
      alert("Plz fill the required fields");
    }
  }

  if (event.target.classList.contains("form3")) {
    event.preventDefault();
    let quiz = loadLastQuizFromLocalStorage();
    if (quiz) {
      //check if correct option
      let Q_no = parseInt(localStorage.getItem("QuestionNumber"), 10);

      const radios = document.querySelectorAll('input[name="option"]');
      let selectedText = "";
      radios.forEach((radio) => {
        if (radio.checked) {
          selectedText = radio.nextElementSibling.textContent;
        }
      });
      // Compare the selected text with the correct answer
      try {
        if (selectedText === quiz.questions[Q_no - 1].answer) {
          // quiz.acquiredMarks += 1;
          quiz.attempted[email].acquiredMarks += 1;
        }
      } catch (error) {
        console.log("Quiz has been submitted already");
      }
      console.log("marks(updated)= ", quiz.attempted[email].acquiredMarks);

      Q_no += 1;

      if (Q_no > quiz.totalquestion) {
        //quiz creation completed
        console.log("Quiz Has Been Attempted");
        //RESET THE QUIZ COUNTER
        localStorage.setItem("QuestionNumber", "1");

        // window.location.href = "http://127.0.0.1:5500/Quizmainscreen.html";
      } else {
        localStorage.setItem("QuestionNumber", Q_no.toString());
        //move to next question
        QuestionNumberText.textContent = localStorage.getItem("QuestionNumber");
        let Ques = document.querySelector(".Question");
        let opt1 = document.querySelector("#option1");
        let opt2 = document.querySelector("#option2");
        let opt3 = document.querySelector("#option3");
        let opt4 = document.querySelector("#option4");
        let correct_option = document.querySelector("#correct_option");

        Ques.textContent = quiz.questions[Q_no - 1].question;
        opt1.textContent = quiz.questions[Q_no - 1].option1;
        opt2.textContent = quiz.questions[Q_no - 1].option2;
        opt3.textContent = quiz.questions[Q_no - 1].option3;
        opt4.textContent = quiz.questions[Q_no - 1].option4;
      }
    }
  }
});

function GetQuizContents(QuestionNumber, QuizObject) {
  let Ques = document.querySelector(".Question");
  let option1 = document.querySelector("#option1");
  let option2 = document.querySelector("#option2");
  let option3 = document.querySelector("#option3");
  let option4 = document.querySelector("#option4");
  let correct_option = document.querySelector("#correct_option");

  // Ques.textContent = QuizObject.Ques
}

function storeObjectToLastIndex(object) {
  let currentIndex = parseInt(localStorage.getItem("lastIndex"), 10);
  localStorage.setItem(`Quiz_${currentIndex - 1}`, JSON.stringify(object));
}

function storeObjecttoLS(object) {
  let currentIndex = parseInt(localStorage.getItem("lastIndex"), 10);

  localStorage.setItem(`Quiz_${currentIndex}`, JSON.stringify(object));

  // Increment the index and update the index counter in local storage
  currentIndex += 1;
  localStorage.setItem("lastIndex", currentIndex.toString());
}

function loadQuizFromLocalStorage() {
  const objects = [];
  const lastIndex = parseInt(localStorage.getItem("lastIndex"), 10);

  for (let i = 0; i < lastIndex; i++) {
    let jsonArray = localStorage.getItem(`Quiz_${i}`);
    if (jsonArray) {
      const quizObject = JSON.parse(jsonArray);
      objects.push(quizObject);
    }
  }
  console.log(objects);
}

function loadLastQuizFromLocalStorage() {
  let lastIndex = parseInt(localStorage.getItem("lastIndex"), 10);
  lastIndex -= 1;
  if (!isNaN(lastIndex)) {
    let lastQuiz = localStorage.getItem(`Quiz_${lastIndex}`);
    let newquiz = JSON.parse(lastQuiz);
    return Quiz.fromObject(newquiz);
  }
  return null; // Return null if lastIndex is not a number or doesn't exist
}

// -----------------------------------------------------------------------------
async function sendQuiz(quiz) {
  try {
    const response = await fetch("http://localhost:4000/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quiz),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}
async function fetchQuiz() {
  try {
    const response = await fetch("http://localhost:4000/quizzes");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const quiz = await response.json();
    quiz.forEach((quiz) => {
      displayquiz(quiz);
    });
    console.log(quiz);
  } catch (error) {
    console.error("Error:", error);
  }
}
function displayquiz(q) {
  // let newquiz = JSON.parse(q);
  let quiz = Quiz.fromObject(q);

  const newDiv = document.createElement("div");
  const newDivquizname = document.createElement("div");
  const newDivsubjectname = document.createElement("div");
  const img = document.createElement("img");

  // Set attributes and content
  img.src = "images/Frame 251.svg";
  newDiv.classList.add("quizbox");
  newDivquizname.classList.add("quizname");
  newDivsubjectname.classList.add("subject");
  newDivquizname.textContent = quiz.name; // Assuming quiz.name contains the quiz name
  newDivsubjectname.textContent = quiz.subject; // Assuming quiz.subject contains the subject name

  // Append the children to the newDiv
  newDiv.append(img);
  newDiv.append(newDivquizname);
  newDiv.append(newDivsubjectname);

  // Append the newDiv to the parent container
  const parentElement = document.querySelector(".dynamicquiz"); // Select the parent container
  parentElement.append(newDiv);
}

// -----------------------------------------------------------------------------

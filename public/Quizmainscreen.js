const totalQuestionsText = document.querySelector("#totalQs");
const QuestionNumberText = document.querySelector("#QuestionNumber");

let MAINSCREEN_QUIZZES = null;

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
  constructor(name, subject, totalquestion, classCode) {
    this.name = name;
    this.subject = subject;
    this.questions = [];
    this.attempted = [];
    this.totalquestion = totalquestion;
    this.acquiredMarks = 0;
    this.classCode = classCode;
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

  calculateMarks(question, userInput) {
    if (question.answer === userInput) {
      this.acquiredMarks += question.mark;
    }
  }

  static fromObject(obj) {
    const quiz = new Quiz(
      obj.name,
      obj.subject,
      obj.totalquestion,
      obj.classCode
    );
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
    // quiz.attempted = obj.attempted.map(
    //   (a) => new Student(a.email, a.acquiredMarks)
    // );
    quiz.acquiredMarks = obj.acquiredMarks;
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
    localStorage.clear();
    const entity = document.cookie.match(/Entity_cookie=([^;]*)/)[1];

    if (entity === "Teacher") {
      const classCode = document.cookie.match(/classCode_cookie=([^;]*)/)[1];
      const decodedClassCode = decodeURIComponent(classCode); //replacing %40 with @
      console.log("inside DOM content loaded");
      //loading quizzes and results
      fetchQuizzesByEmail(decodedClassCode)
        .then((result) => {
          MAINSCREEN_QUIZZES = result;
          console.log("MAINSCREEN_QUIZZES: ", MAINSCREEN_QUIZZES);
          MAINSCREEN_QUIZZES.forEach((quiz) => {
            dynamicResult(quiz);
          });
        })
        .catch((error) => {
          console.error("Error fetching quizzes: ", error);
        });
    } else if (entity === "Student") {
      // const StudentClassCode = document.cookie.match(
      //   /classCode_cookie=([^;]*)/
      // )[1];
      // Get the button element
      const button = document.querySelector(".AddQuiz");
      // Hide the button
      button.style.display = "none";

      const StudentClassCode = getCookie("Code_cookie");
      console.log("Class code cookie = ", StudentClassCode);
      // MAINSCREEN_QUIZZES = fetchQuizzesByEmail(StudentClassCode);
      // console.log("MAINSCREENQUIZ: ", MAINSCREEN_QUIZZES);
      fetchQuizzesByEmail(StudentClassCode)
        .then((result) => {
          MAINSCREEN_QUIZZES = result;
          console.log("MAINSCREEN_QUIZZES: ", MAINSCREEN_QUIZZES);
          MAINSCREEN_QUIZZES.forEach((quiz) => {
            dynamicResult(quiz);
          });
        })
        .catch((error) => {
          console.error("Error fetching quizzes: ", error);
        });
    }
  }

  if (window.location.pathname === "/Student_Quiz") {
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

    const classCode = document.cookie.match(/classCode_cookie=([^;]*)/)[1];
    const decodedClassCode = decodeURIComponent(classCode); //replacing %40 with @
    console.log("Email = ", decodedClassCode);

    let quiz = new Quiz(
      quizname.value,
      subject.value,
      totalquestions.value,
      decodedClassCode
    );
    // let quiz = new Quiz(quizname.value, subject.value, totalquestions.value);
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
          quiz.acquiredMarks += 1;
        }
      } catch (error) {
        console.log("Quiz has been submitted already");
      }
      console.log("marks(updated)= ", quiz.acquiredMarks);
      storeObjectToLastIndex(quiz);

      Q_no += 1;

      if (Q_no > quiz.totalquestion) {
        //quiz creation completed
        console.log("Quiz Has Been Attempted");
        //RESET THE QUIZ COUNTER
        const studentEmail = document.cookie.match(/studentEmail=([^;]*)/)[1];
        const updatedStudentEmail = studentEmail.replace("%40", "@"); //replacing %40 with @
        console.log("Email = ", updatedStudentEmail);

        quiz.addattempted(updatedStudentEmail, quiz.acquiredMarks);
        storeObjectToLastIndex(quiz);
        updateAttemptedArray(quiz);
        localStorage.setItem("QuestionNumber", "1");

        window.location.href = "http://localhost:4000/Quizmainscreen";
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
  if (event.target.classList.contains("form4")) {
    event.preventDefault();
    let StudentClassCode = document.querySelector(".StudentClassCode").value;

    setSessionCookie("Code_cookie", StudentClassCode);
    window.location.href = "http://localhost:4000/Quizmainscreen";
    // if (window.location.pathname === "/Quizmainscreen") {
    // MAINSCREEN_QUIZZES = fetchQuizzesByEmail(StudentClassCode);
    // console.log("MAINSCREENQUIZ: ", MAINSCREEN_QUIZZES);
    // sessionStorage.setItem(
    //   "MAINSCREEN_QUIZZES",
    //   JSON.stringify(MAINSCREEN_QUIZZES)
    // );
    // }
  }
});

document.addEventListener("click", (event) => {
  // Check if the clicked element or its parent has the class "quizbox"
  if (
    event.target.classList.contains("quizbox") ||
    event.target.parentElement.classList.contains("quizbox")
  ) {
    const quizbox = event.target.closest(".quizbox");
    const entity = document.cookie.match(/Entity_cookie=([^;]*)/)[1];

    if (quizbox && entity === "Student") {
      // Find the .quizname element within the closest .quizbox ancestor
      let quizname = quizbox.querySelector(".quizname").textContent;
      console.log(quizname);
      console.log("quizzes = ", MAINSCREEN_QUIZZES);
      if (MAINSCREEN_QUIZZES) {
        const studentEmail = document.cookie.match(/studentEmail=([^;]*)/)[1];
        const updatedStudentEmail = decodeURIComponent(studentEmail); // Decoding the email to handle "%40"

        let permissionToAttempt = true;
        let quizToStore = null;

        MAINSCREEN_QUIZZES.forEach((quiz) => {
          if (quiz.name === quizname) {
            if (permissionToAttempt) {
              for (let i = 0; i < quiz.attempted.length; i++) {
                if (quiz.attempted[i].email === updatedStudentEmail) {
                  alert(`You have already attempted the Quiz: ${quiz.name}`);
                  permissionToAttempt = false;
                  break;
                }
              }
            }
            // If the quiz is found and the student has no permission to attempt it
            if (permissionToAttempt) {
              quizToStore = quiz;
            }
          }
        });

        if (permissionToAttempt && quizToStore) {
          console.log("Quiz found Taha Ganfu:", quizToStore);
          storeObjectToLastIndex(quizToStore);
          window.location.href = "http://localhost:4000/Student_Quiz";
        }
      } else {
        console.log("No quizbox found");
      }
    }
  }
});
// if (MAINSCREEN_QUIZZES) {
//   MAINSCREEN_QUIZZES.forEach((quiz) => {
//     if (quiz.name === quizname) {
//       //quiz found now store in session storage
//       console.log("Quiz found Taha Ganfu:", quiz);
//       storeObjectToLastIndex(quiz);
//       window.location.href = "http://localhost:4000/Student_Quiz";
//     }
//   });
// } else {
//   console.log("No quizbox found");
// }
// if (MAINSCREEN_QUIZZES) {
//   const studentEmail = document.cookie.match(/studentEmail=([^;]*)/)[1];
//   const updatedStudentEmail = studentEmail.replace("%40", "@");
//   //check if quiz is already attempted by the student
//   let permissionToAttempt = true;
//   MAINSCREEN_QUIZZES.forEach((quiz) => {
//     if (permissionToAttempt && quiz.name === quizname) {
//       for (let i = 0; i < quiz.attempted.length; i++) {
//         if (quiz.attempted[i].email === updatedStudentEmail) {
//           alert(`You have already attempted the Quiz: ${quiz.name}`);
//           permissionToAttempt = false;
//           break;
//         }}}});
//   if (permissionToAttempt) {
//     MAINSCREEN_QUIZZES.forEach((quiz) => {
//       if (quiz.name === quizname) {
//         //quiz found now store in session storage
//         console.log("Quiz found Taha Ganfu:", quiz);
//         storeObjectToLastIndex(quiz);
//         window.location.href = "http://localhost:4000/Student_Quiz";
//       }});}
// } else {
//   console.log("No quizbox found");}

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
  let currentIndex = parseInt(localStorage.getItem("lastIndex"), 10) || 1;
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
  let lastIndex = parseInt(localStorage.getItem("lastIndex"), 10) || 1;
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
async function fetchQuizzesByEmail(class_N) {
  try {
    const classCode = encodeURIComponent(class_N);
    const response = await fetch(
      `http://localhost:4000/quizzes?classCode=${classCode}`
    );

    console.log("Fetching quizzes for classCode:", classCode); // Debug log
    console.log("Encoded classCode:", classCode); // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch error response text:", errorText); // Debug log
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const quizzes = await response.json();
    quizzes.forEach((quiz) => {
      displayquiz(quiz);
    });
    console.log("Quizzes found:", quizzes); // Debug log
    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error); // Debug log
    return null;
  }
}
async function updateAttemptedArray(quiz) {
  try {
    const quizName = quiz.name;
    const updateFields = { attempted: quiz.attempted };
    const response = await fetch("http://localhost:4000/quizzes", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: quizName,
        updateFields,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Quiz updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating quiz:", error);
    return null;
  }
}
function dynamicResult(q) {
  for (let i = 0; i < q.attempted.length; i++) {
    if (q.attempted) {
      const email = document.createElement("p");
      const quiz = document.createElement("p");
      const totalMarks = document.createElement("p");
      const obtainedMarks = document.createElement("p");
      const dynamicresult = document.createElement("div");

      dynamicresult.classList.add("dynamicresult");

      quiz.textContent = q.name;
      email.textContent = q.attempted[i].email;
      totalMarks.textContent = q.totalquestion;
      obtainedMarks.textContent = q.attempted[i].acquiredMarks;

      dynamicresult.append(email, quiz, totalMarks, obtainedMarks);
      const result = document.querySelector(".results"); // Select the parent container
      result.append(dynamicresult);
    }
  }
}
function setSessionCookie(name, value) {
  document.cookie = name + "=" + (value || "") + "; path=/";
}
function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// -----------------------------------------------------------------------------

/* I've placed all the functions linked to the viewQuiz file's buttons here, in a single file, rather than a bunch of smaller files. This just for convenience
    so this file might look junky. */

    async function getQuizData() {
        try 
        {
          const quizId = document.getElementById('quizId').value;
  
          // Validate if the entered quiz ID is not empty
          if (!quizId) 
          {
            alert('Please enter a Quiz ID');
            return;
          }
  
          // Check if the ID has been fetched before
          if (!quizWindows.includes(quizId)) 
          {
            // Fetch the quiz data using the provided route
            const fetchResponse = await fetch(`/getQuiz/${quizId}`);
            const returnedData = await fetchResponse.json();
  
            if (fetchResponse.ok) 
            {
              // Extract Quiz name and questions
              const quizName = returnedData.data.quizName;
              const questions = returnedData.data.quizForm;
  
              // Set the total number of questions in the quiz
              totalQuestions = questions.length;
  
              // Open a new window or tab
              const newWindow = window.open('', `displayQuizInNewWindow_${quizId}`);
  
              // Display Quiz name in the new window or tab
              displayQuizInfo(newWindow, quizName);
  
              // Create a list and append each question with its answers
              const form = document.createElement('form');
  
              questions.forEach((questionData, index) => {
                const questionText = questionData.question;
                const correctAnswer = questionData.correctAnswer;
                const fakeAnswers = questionData.fakeAnswers;
  
                // Combine correct answer and extracted fake answers into a new array
                const answers = [correctAnswer, ...fakeAnswers];
  
                // Shuffle the answers array using Fisher-Yates (Knuth) Shuffle algorithm
                for (let i = answers.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [answers[i], answers[j]] = [answers[j], answers[i]];
                }
  
                // Append each question and its answers to the form
                form.appendChild(document.createElement('hr'));
                form.appendChild(document.createElement('br'));
                form.appendChild(document.createElement('br'));
  
                const questionElement = document.createElement('p');
                questionElement.innerHTML = `<b>${index + 1}: ${questionText}</b>`;
                form.appendChild(questionElement);
  
                for (let answer of answers) {
                  const inputRadio = document.createElement('input');
                  inputRadio.type = 'radio';
                  inputRadio.value = answer;
                  inputRadio.name = `answers${index + 1}`;
  
                  const label = document.createElement('label');
                  label.innerHTML = answer;
  
                  form.appendChild(inputRadio);
                  form.appendChild(label);
                  form.appendChild(document.createElement('br'));
                }
              });
  
              newWindow.document.body.appendChild(form);
  
              // Create a submit button to check the selected answers
              const submitButton = newWindow.document.createElement('button');
              submitButton.textContent = 'Submit Answers';
              submitButton.addEventListener('click', () => {
                checkSelectedAnswers(newWindow, questions, quizName, submitButton);
                disableFetchQuizButton(quizId);
              });
  
              newWindow.document.body.appendChild(submitButton);
  
              // Initialize the score for the quiz
              quizScores[quizName] = 
              {
                total: 0,
                correct: 0,
                incorrect: 0
              };
  
              // Store the new window in the array
              quizWindows.push(quizId);
  
              // Attach onbeforeunload event to the new window
              newWindow.onbeforeunload = function() {
                // Remove the corresponding ID when the window is closed
                const indexToRemove = quizWindows.indexOf(quizId);

                if (indexToRemove !== -1) 
                {
                  quizWindows.splice(indexToRemove, 1);
                  // Reset the score when the window is closed
                  resetQuizScore(quizName);
                }
              };
  
            } 
            
            else 
            {
              alert('No Quiz by that ID was found!');
              console.error('Failed to fetch quiz data');
            }
          } 
          
          else 
          {
            alert('Quiz already fetched. Please enter a new Quiz ID.');
          }
        } 
        
        catch (err) 
        {
          console.error('Error fetching quiz data:', err);
        }
    }
  
    async function fetchAllQuizzes() {
        try 
        {
          // Fetch all quizzes from the database
          const fetchResponse = await fetch(`/getAllQuizzes`);
          const returnedData = await fetchResponse.json();
      
          if (fetchResponse.ok) 
          {
            // Open a new window or tab
            const newWindow = window.open('', `displayAllQuizzesInNewWindow`);
      
            // Display a list of quizzes in the new window or tab
            displayAllQuizzes(newWindow, returnedData);
          } 
          
          else 
          {
            alert(`Failed to fetch all quizzes: ${returnedData.message}`);
            console.error('Failed to fetch all quizzes:', returnedData.message);
          }
        } 
        
        catch (err) 
        {
          console.error('Error fetching all quizzes:', err);
        }
    }

    async function addQuestion() {
        try
        {
          const quizId = prompt('Enter the Quiz ID:');
          
          if (!quizId) 
          {
            return;
          }
      
          const quizData = await fetch(`/getQuiz/${quizId}`);
          const quiz = await quizData.json();
      
          if (!quizData.ok || !quiz.data) 
          {
            alert('No Quiz found with the provided ID.');
            return;
          }
      
          const maxQuestions = 25 - quiz.data.quizForm.length;
          const numQuestions = prompt(`How many questions do you want to add? (Max ${ maxQuestions })`);
      
          if ( numQuestions > maxQuestions || numQuestions == 0) 
          {
            alert(`Please enter a valid number between 1 and ${ maxQuestions }.`);
            return;
          }

          if ( !numQuestions || isNaN(numQuestions) )
          {
            return;
          }
      
          for (let i = 0; i < numQuestions; i++) {
            const question = prompt(`Enter question ${ i + 1 }:`);
            const correctAnswer = prompt('Enter correct answer:');
            const fakeAnswers = [];
      
            for (let j = 0; j < 3; j++) {
              fakeAnswers.push(prompt(`Enter fake answer ${ j + 1 }:`));
            }
      
            // Validation: Check if any field is null or blank
            if (!question || !correctAnswer || fakeAnswers.some(answer => !answer)) 
            {
              alert('Please fill out all fields before submitting.');
              return;
            }
      
            const quizForm = 
            {
              question,
              correctAnswer,
              fakeAnswers
            };
      
            const response = await fetch(`/updateQuiz/${quizId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(quizForm),
            });
      
            if (response.ok) 
            {
              alert(`Successfully added question ${i + 1} to the Quiz!`);
            } 
            
            else 
            {
              const errorData = await response.json();
              alert(`Uh oh, something went wrong adding question ${i + 1}: ${errorData.error}`);
            }
          }
        } 
        
        catch (err) 
        {
          console.error('Error adding quiz question:', err);
          alert('Error adding quiz question. Please try again.');
        }
    }
      
    async function modifyQuizQuestion() {
        try 
        {
          let storedQuizId = prompt('Enter the Quiz ID:');
      
          if (!storedQuizId) 
          {
            return;
          }
      
          while (true) {
            const quizData = await fetch(`/getQuiz/${storedQuizId}`);
            const quiz = await quizData.json();
      
            if (!quizData.ok || !quiz.data) 
            {
              alert('No Quiz found with the stored ID.');
              return;
            }
      
            const questions = quiz.data.quizForm;
            // console.log("question variable contents:", questions);
      
            const promptMessage = 'Select a question to update:\n\n' +
              questions.map((q, index) => `${index + 1}: ${q.question}`).join('\n');
      
            const questionIndex = prompt(promptMessage);
      
            // might change this later:
            if (!questionIndex || isNaN(questionIndex) || questionIndex < 1 || questionIndex > questions.length) 
            {
              // alert(`Please enter a valid question number between 1 and ${questions.length}.`);
              return;
            }
      
            const questionToUpdate = quiz.data.quizForm[questionIndex - 1];
      
            // Extract the questionId from the _id field
            const questionId = questionToUpdate._id;
      
            const updatedQuestion = prompt('Enter the updated question:', questionToUpdate.question);
            const updatedCorrectAnswer = prompt('Enter the updated correct answer:', questionToUpdate.correctAnswer);
            const updatedFakeAnswers = [];
      
            for (let j = 0; j < 3; j++) {
              updatedFakeAnswers.push(prompt(`Enter updated fake answer ${j + 1}:`, questionToUpdate.fakeAnswers[j]));
            }
      
            const quizForm = 
            {
              question: updatedQuestion,
              correctAnswer: updatedCorrectAnswer,
              fakeAnswers: updatedFakeAnswers
            };
      
            const response = await fetch(`/updateQuiz/${storedQuizId}/${questionId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(quizForm),
            });
      
            if (response.ok) 
            {
              alert(`Successfully updated question ${questionIndex} in the Quiz!`);
      
              const updateAnother = confirm('Do you want to update another question?');
      
              if (!updateAnother) 
              {
                break; // Exit the loop if the user does not want to update another question
              }
            }
          }
      
        } 
        
        catch (err) 
        {
          console.error('Error updating quiz question:', err);
          alert('Error updating quiz question. Please try again.');
        }
    }
    
    async function deleteQuestion() {
      try 
      {
        let storedQuizId = prompt('Enter the Quiz ID:');
    
        if (!storedQuizId) 
        {
          return;
        }
    
        const quizData = await fetch(`/getQuiz/${ storedQuizId }`);
        const quiz = await quizData.json();
    
        if (!quizData.ok || !quiz.data) 
        {
          alert('No Quiz found with the stored ID.');
          return;
        }
    
        const questions = quiz.data.quizForm;
    
        const promptMessage = 'Select a question to Delete:\n\n' +
          questions.map((q, index) => `${ index + 1 }: ${ q.question }`).join('\n');
    
        const questionIndex = prompt(promptMessage);
    
        if ( questionIndex > questions.length) 
        {
          alert(`Please enter a valid question number between 1 and ${ questions.length }.`);
          return;
        }

        if (!questionIndex || isNaN(questionIndex) || questionIndex < 1)
        {
          return;
        }
    
        const questionToDelete = quiz.data.quizForm[questionIndex - 1];
        const questionId = questionToDelete._id;
    
        const confirmDelete = confirm(`Are you sure you want to delete question ${ questionIndex } from the Quiz?`);
    
        if (!confirmDelete) 
        {
          return;
        }
    
        const response = await fetch(`/deleteQuestion/${ storedQuizId }/${ questionId }`, {
          method: 'DELETE',
        });
    
        if (response) 
        {
          alert(`Successfully deleted question ${ questionIndex } from the Quiz!`);
        } 
        
        else 
        {
          const errorData = await response.json();
          alert(`Error: ${ errorData.error }`);
        }
    
      } 
      
      catch (err) 
      {
        console.error('Error deleting quiz question:', err);
        alert('Error deleting quiz question. Please try again.');
      }
  }

    async function deleteQuiz() {
        try
        {
          let storedQuizId = prompt('Enter the Quiz ID:');
      
          if (!storedQuizId) 
          {
            return;
          }
      
          const quizData = await fetch(`/getQuiz/${storedQuizId}`);
          const quiz = await quizData.json();
          const quizName = quiz.data.quizName;
      
          if (!quizData.ok || !quiz.data) 
          {
            alert('No Quiz found with the stored ID.');
            return;
          }
      
          else
          {
            const confirmDelete = confirm(`Are you sure you want to delete this Quiz: "${ quizName }" from the collection?`);
              
            if (!confirmDelete) 
            {
              return;
            }
      
            else
            {
              const response = await fetch(`/deleteQuiz/${storedQuizId}`, {
                 method: 'DELETE',
              });
      
              if (response) 
              {
                alert(`Successfully deleted the Quiz: ${ quizName } from the collection!`);
              } 
                
              else 
              {
                const errorData = await response.json();
                alert(`Deletion Error: ${ errorData.error }`);
              }
            }
          }
        }
      
        catch (err)
        {
          alert(`There was an internal error when trying to delete the Quiz!`);
          console.error(`There was an internal error when trying to delete the Quiz!`, err);
        }
    }
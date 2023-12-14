const toLowerCaseKeys = obj =>
    Object.keys(obj).reduce((accumulator, key) => ({...accumulator, [key.toLowerCase()]: obj[key]}), {});

window.onload = () => {
    fetch('/getSurveys')
        .then(response => response.json())
        .then(data => {
            const surveysSection = document.getElementById('surveys');
            data.forEach(survey => {
                survey = toLowerCaseKeys(survey);
                const {options, votes, image, id, question} = survey;
                if (options && votes) {
                    const surveyDiv = document.createElement('div');
                    const questionH3 = document.createElement('h3');
                    questionH3.textContent = question;
                    surveyDiv.appendChild(questionH3);
                    if (image) {
                        const img = document.createElement('img');
                        img.src = image;
                        img.style.borderRadius = '10px';
                        surveyDiv.appendChild(img);
                    }
                    options.forEach((option, optionIndex) => {
                        const optionLabel = document.createElement('label');
                        const optionInput = document.createElement('input');
                        optionInput.type = 'radio';
                        optionInput.name = 'option' + id;
                        optionLabel.appendChild(optionInput);
                        optionLabel.appendChild(document.createTextNode(option));
                        surveyDiv.appendChild(optionLabel);
                    });
                    const voteButton = document.createElement('button');
                    voteButton.textContent = 'Проголосовать';
                    voteButton.onclick = () => {
                        const options = document.querySelectorAll(`input[name="option${id}"]`);
                        let optionIndex;
                        options.forEach((option, index) => {
                            if (option.checked) {
                                optionIndex = index;
                            }
                        });
                        if (optionIndex === undefined) {
                            alert('Пожалуйста, выберите вариант ответа перед голосованием.');
                            alert(survey.id);
                            return;
                        }
                        fetch('/vote', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                surveyId: survey.id,
                                optionIndex
                            })
                        }).then(() => {
                            updateStats(id);
                        });
                    };
                    surveyDiv.appendChild(voteButton);
                    const statsDiv = document.createElement('div');
                    statsDiv.id = 'stats' + id;
                    surveyDiv.appendChild(statsDiv);
                    surveysSection.appendChild(surveyDiv);
                }
            });
        });
};


function updateStats(surveyId) {
    fetch('/getSurveys')
        .then(response => response.json())
        .then(data => {
            const survey = data.find(s => s.id === surveyId);
            if (survey && survey.votes) {
                const statsDiv = document.getElementById('stats' + surveyId);
                statsDiv.innerHTML = '';
                survey.votes.forEach((vote, index) => {
                    const voteP = document.createElement('p');
                    voteP.textContent = `Вариант ответа ${index + 1}: ${vote} голосов`;
                    statsDiv.appendChild(voteP);
                });
            }
        });
}

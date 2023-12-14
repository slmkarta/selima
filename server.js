const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

let surveys = {};

fs.createReadStream('surveys.csv')
    .pipe(csv())
    .on('data', (row) => {
        row.OPTIONS = row.OPTIONS.split(','); // Преобразуем строку в массив
        row.VOTES = row.VOTES.split(',').map(Number); // Преобразуем строку в массив чисел
        surveys[row.ID] = row;
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });

app.post('/addSurvey', (req, res) => {
    const id = Date.now().toString();
    const survey = {
        id: id,
        question: req.body.question,
        image: req.body.image,
        options: [],
        votes: []
    };

    let i = 1;
    while(req.body['option' + i]) {
        survey.options.push(req.body['option' + i]);
        survey.votes.push(0);
        i++;
    }

    surveys[id] = survey;

    const csvWriter = createCsvWriter({
        path: 'surveys.csv',
        header: [
            {id: 'id', title: 'ID'},
            {id: 'question', title: 'QUESTION'},
            {id: 'image', title: 'IMAGE'},
            {id: 'options', title: 'OPTIONS'},
            {id: 'votes', title: 'VOTES'}
        ]
    });

    csvWriter
        .writeRecords(Object.values(surveys))
        .then(() => console.log('The CSV file was written successfully'));

    res.redirect('/');
});

app.get('/getSurveys', (req, res) => {
    res.json(Object.values(surveys));
});

app.post('/vote', (req, res) => {
    const surveyId = req.body.surveyId;
    const optionIndex = Number(req.body.optionIndex);

    if (surveys[surveyId]) {
        surveys[surveyId].votes[optionIndex]++;

        const csvWriter = createCsvWriter({
            path: 'surveys.csv',
            header: [
                {id: 'id', title: 'ID'},
                {id: 'question', title: 'QUESTION'},
                {id: 'image', title: 'IMAGE'},
                {id: 'options', title: 'OPTIONS'},
                {id: 'votes', title: 'VOTES'}
            ]
        });

        csvWriter
            .writeRecords(Object.values(surveys))
            .then(() => console.log('The CSV file was updated successfully'));

        res.redirect('/');
    } else {
        console.log(`Ошибка: Опрос с идентификатором ${surveyId} не найден или недопустимый optionIndex.`);
        res.status(400).send(`Ошибка: Опрос с идентификатором ${surveyId} не найден или недопустимый optionIndex.`);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

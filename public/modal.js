var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var form = document.getElementById("surveyForm");
var optionCount = 2;

function openModal() {
    modal.style.display = "block";
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function addOption() {
    optionCount++;
    var newOptionLabel = document.createElement("label");
    newOptionLabel.setAttribute("for", "option" + optionCount);
    newOptionLabel.textContent = "Вариант ответа " + optionCount + ":";
    var newOptionInput = document.createElement("input");
    newOptionInput.setAttribute("type", "text");
    newOptionInput.setAttribute("id", "option" + optionCount);
    newOptionInput.setAttribute("name", "option" + optionCount);
    newOptionInput.classList.add("option");
    var addButton = document.getElementById("addButton");
    form.insertBefore(newOptionLabel, addButton);
    form.insertBefore(newOptionInput, addButton);
    form.insertBefore(document.createElement("br"), addButton);
}

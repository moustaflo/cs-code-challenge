var addButton = document.getElementsByTagName("button")[0];
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");

var createNewTaskElement = function(taskString, arr) {
  listItem = document.createElement("li");
  checkBox = document.createElement("input");
  label = document.createElement("label");
  editInput = document.createElement("input");
  editButton = document.createElement("button");
  deleteButton = document.createElement("button");

  checkBox.type = "checkbox";
  editInput.type = "text";
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  label.innerText = taskString;

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
};

var focusFunction = function (x) {
  x.style.background = 'turquoise';
}

var blurFunction = function (x) {
  x.style.background = '#feff9c';
}

var keyDownFunction = function (e) {
  if(e.keyCode === 13) {
    if(e.target.parentNode.children[0].checked === true) {
      e.target.parentNode.children[0].checked = false;
      e.target.click();
      location.reload();
    } else {
      e.target.parentNode.children[0].checked = true;
      e.target.click();
      location.reload();
    }
  }
}

var newTaskKeyDownFunction = function (e) {
  if(e.keyCode === 13) {
    e.target.parentNode.children[1].click();
  }
}

var editKeyDownFunction = function (e) {
  if(e.keyCode === 13) {
    e.target.parentNode.children[3].click();
  }
}

var resetAll = function () {
  localStorage.clear();
  location.reload();
}

var addTask = function () {
    var taskInput = document.getElementById("new-task");
    if(taskInput.value) {
    var incompleteItems = [...JSON.parse(localStorage.getItem('incompleteItems')), taskInput.value];
    localStorage.setItem('incompleteItems', JSON.stringify(incompleteItems));
    var listItemName = taskInput.value;
    listItem = createNewTaskElement(listItemName);
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
    location.reload();
    } else {
    alert('The task cannot be an empty entry');
  }
};

var editTask = function () {
  var listItem = this.parentNode;
  var editInput = listItem.querySelectorAll("input[type=text")[0];
  var label = listItem.querySelector("label");
  var button = listItem.getElementsByTagName("button")[0];

  var containsClass = listItem.classList.contains("editMode");
  if (containsClass) {
      var initialText = label.innerText;
      label.innerText = editInput.value;
      button.innerText = "Edit";
      if(listItem.parentNode.id === 'incomplete-tasks') {
        var incompleteTasks = JSON.parse(localStorage.getItem('incompleteItems'));
        var taskName = initialText;
        var incompleteItemIndex = incompleteTasks.indexOf(taskName);
        incompleteTasks[incompleteItemIndex] = this.parentNode.children[1].innerHTML;
        localStorage.setItem('incompleteItems', JSON.stringify(incompleteTasks));
        location.reload();
      } else {
        var completedTasks = JSON.parse(localStorage.getItem('completeItems'));
        var completedTaskName = initialText;
        var completedItemIndex = completedTasks.indexOf(completedTaskName);
        completedTasks[completedItemIndex] = this.parentNode.children[1].innerHTML;
        localStorage.setItem('completeItems', JSON.stringify(completedTasks));
        location.reload();
      }
  } else {
     editInput.value = label.innerText;
     button.innerText = "Save";
  }
  listItem.classList.toggle("editMode");
  listItem.children[0].style.display = 'none';
  listItem.children[4].style.display = 'none';
  editInput.focus();
  editInput.addEventListener('keydown', editKeyDownFunction)
};

var deleteTask = function (el) {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  if(listItem.parentNode.id === 'incomplete-tasks') {
    var incompleteTasks = JSON.parse(localStorage.getItem('incompleteItems'));
    var taskName = listItem.children[1].innerHTML;
    var filteredIncompleteArray = incompleteTasks.filter(task => task !== taskName);
    localStorage.setItem('incompleteItems', JSON.stringify(filteredIncompleteArray));
    location.reload();
  } else {
    var completedTasks = JSON.parse(localStorage.getItem('completeItems'));
    var completedTaskName = listItem.children[1].innerHTML;
    var filteredCompleteArray = completedTasks.filter(task => task !== completedTaskName);
    localStorage.setItem('completeItems', JSON.stringify(filteredCompleteArray));
    location.reload();
  }
  ul.removeChild(listItem);
};

var taskCompleted = function (el) {
  var incompleteTasks = JSON.parse(localStorage.getItem('incompleteItems'));
  var taskName = this.parentNode.children[1].innerHTML;
  var newIncompleteArray = incompleteTasks.filter(task => task !== taskName);
  localStorage.setItem('incompleteItems', JSON.stringify(newIncompleteArray));

  var completedTasks = JSON.parse(localStorage.getItem('completeItems'));
  var newCompleteArray = [...completedTasks, taskName];
  localStorage.setItem('completeItems', JSON.stringify(newCompleteArray));
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
};

var taskIncomplete = function() {
  var incompleteTasks = JSON.parse(localStorage.getItem('incompleteItems'));
  var taskName = this.parentNode.children[1].innerHTML;
  var newIncompleteArray = [...incompleteTasks, taskName];
  localStorage.setItem('incompleteItems', JSON.stringify(newIncompleteArray))

  var completedTasks = JSON.parse(localStorage.getItem('completeItems'));
  var newCompleteArray = completedTasks.filter(task => task !== taskName);
  localStorage.setItem('completeItems', JSON.stringify(newCompleteArray))
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
};

var bindTaskEvents = function(taskListItem, checkBoxEventHandler, cb) {
  var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
  var label = taskListItem.querySelectorAll("label")[0];
  var editButton = taskListItem.querySelectorAll("button.edit")[0];
  var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  label.addEventListener('keydown', keyDownFunction);
  label.onclick = checkBoxEventHandler;
  checkBox.onchange = checkBoxEventHandler;
};

addButton.addEventListener("click", addTask);

if (!localStorage.getItem('incompleteItems')) {
  localStorage.setItem('incompleteItems', '[]')
}

if (!localStorage.getItem('completeItems')) {
  localStorage.setItem('completeItems', '[]')
}

for (var i = 0; i < JSON.parse(localStorage.getItem('incompleteItems')).length; i++) {
  var newLi = document.createElement('li');
  var newCheckbox = document.createElement('INPUT');
  newCheckbox.setAttribute('type', 'checkbox');
  newCheckbox.setAttribute('tabindex', '-1');
  var newLabel = document.createElement('label');
  newLabel.setAttribute('onclick', 'checkCheckbox(this)');
  newLabel.setAttribute('tabindex', '0');
  newLabel.setAttribute('onfocus', 'focusFunction(this)');
  newLabel.setAttribute('onblur', 'blurFunction(this)');
  newLabel.innerHTML = JSON.parse(localStorage.getItem('incompleteItems'))[i];
  var newTextInput = document.createElement('INPUT');
  newTextInput.setAttribute('type', 'text');
  var editButton = document.createElement('button');
  editButton.setAttribute('class', 'edit');
  editButton.setAttribute('tabindex', '0');
  editButton.setAttribute('onfocus', 'focusFunction(this)');
  editButton.setAttribute('onblur', 'blurFunction(this)');
  editButton.innerHTML = 'Edit';
  var deleteButton = document.createElement('button');
  deleteButton.setAttribute('class', 'delete');
  deleteButton.setAttribute('tabindex', '0');
  deleteButton.setAttribute('onfocus', 'focusFunction(this)');
  deleteButton.setAttribute('onblur', 'blurFunction(this)');
  deleteButton.innerHTML = 'Delete';
  newLi.appendChild(newCheckbox);
  newLi.appendChild(newLabel);
  newLi.appendChild(newTextInput);
  newLi.appendChild(editButton);
  newLi.appendChild(deleteButton);
  incompleteTasksHolder.appendChild(newLi);
}

for (var i = 0; i < JSON.parse(localStorage.getItem('completeItems')).length; i++) {
  var newLi = document.createElement('li');
  var newCheckbox = document.createElement('INPUT');
  newCheckbox.setAttribute('type', 'checkbox');
  newCheckbox.setAttribute('tabindex', '-1');
  newCheckbox.checked = true;
  var newLabel = document.createElement('label');
  newLabel.setAttribute('onclick', 'checkCheckbox(this)');
  newLabel.setAttribute('tabindex', '0');
  newLabel.setAttribute('onfocus', 'focusFunction(this)');
  newLabel.setAttribute('onblur', 'blurFunction(this)');
  newLabel.innerHTML = JSON.parse(localStorage.getItem('completeItems'))[i];
  var newTextInput = document.createElement('INPUT');
  newTextInput.setAttribute('type', 'text');
  var editButton = document.createElement('button');
  editButton.setAttribute('class', 'edit');
  editButton.setAttribute('tabindex', '0');
  editButton.setAttribute('onfocus', 'focusFunction(this)');
  editButton.setAttribute('onblur', 'blurFunction(this)');
  editButton.innerHTML = 'Edit';
  var deleteButton = document.createElement('button');
  deleteButton.setAttribute('class', 'delete');
  deleteButton.setAttribute('tabindex', '0');
  deleteButton.setAttribute('onfocus', 'focusFunction(this)');
  deleteButton.setAttribute('onblur', 'blurFunction(this)');
  deleteButton.innerHTML = 'Delete';
  newLi.appendChild(newCheckbox);
  newLi.appendChild(newLabel);
  newLi.appendChild(newTextInput);
  newLi.appendChild(editButton);
  newLi.appendChild(deleteButton);
  completedTasksHolder.appendChild(newLi);
}

for (var i = 0; i < incompleteTasksHolder.children.length ; i++) {
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

for (var i = 0; i < completedTasksHolder.children.length; i++) {
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}
document.getElementById('new-task').focus();
document.getElementById('new-task').addEventListener('keydown', newTaskKeyDownFunction)
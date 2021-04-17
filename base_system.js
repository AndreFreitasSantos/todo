

const coluns = document.querySelectorAll(".colun")

function addTodo(text,pai){
    let todo = document.createElement("input");
    todo.setAttribute("draggable","true");
    todo.classList.add("todo")
    todo.value = text

    todo.addEventListener("focusin", () => {
        todo.setAttribute("readonly", "true")
    })

    todo.addEventListener("dblclick", () => {
        todo.removeAttribute("readonly")
    })

    todo.addEventListener("focusout", () => {
        save()
    })

    todo.addEventListener("dragstart", () => {
        todo.classList.add("dragging");
    })

    todo.addEventListener("dragend", () => {
        save()
        todo.classList.remove("dragging")
    })

    let colun = document.getElementById(pai)
    
    if(colun.childNodes.length == 0){
        colun.appendChild(todo)
    }else{
        colun.insertBefore(todo ,colun.childNodes[0]) 
    }
}

coluns.forEach(colun => {
    colun.addEventListener('dragover', e => {
        const afterElement = getDragAfterElement(colun, e.clientY)
        const draggable = document.querySelector('.dragging')
        if(afterElement == null) {
            colun.appendChild(draggable)
        }else{
            colun.insertBefore(draggable,afterElement)
        }
    })
})

function getDragAfterElement(container, y){
    const draggableElements = [...container.querySelectorAll('.todo')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top  - box.height/2
        if(offset < 0 && offset > closest.offset){
            return { element: child }
        }else{
            return closest
        }

        }, {offset: Number.NEGATIVE_INFINITY}).element   
}


function save(){
    let todos = document.querySelectorAll('.todo');
    let i = 0

    todos.forEach(todo => {
        var todo = {
            text: todo.value,
            pai: todo.parentNode.id
        }
        localStorage.setItem(i,JSON.stringify(todo))
        i++
    })

    key = i
}

function load(){
    for(let i = localStorage.length-1; i>=0; i--){
        console.log(i)
        todo = JSON.parse(localStorage.getItem(i))   
        text = todo.text 
        addTodo(text, todo.pai)

    }
}

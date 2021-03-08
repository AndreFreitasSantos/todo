
var coluns = document.querySelectorAll(".colun");

class Bd{

    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return(parseInt(proximoId)+1)
    }

    gravar(a){
        let id = this.getProximoId()
        localStorage.setItem(id,JSON.stringify(a))
        localStorage.setItem('id',id) 
        return id
    }

    substituir(id, a){
        let obj = localStorage.getItem(id)
        let newObj = new Todo(a)
        obj = newObj
        localStorage.setItem(id,JSON.stringify(obj))
    }

    RecuperarValores(){

        let todos = Array()

        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {
            let todo = localStorage.getItem(i)
            
            if(todo === null){
                continue
            }

            todos.push(todo)
        }
        return todos
    }
}

let bd = new Bd()


class Todo{
    constructor(text, colun){
        this.text = text
        this.colun = colun
    }
}


function add(){
    const todoColun = document.querySelector("#todo-title");
    const newtodo = document.createElement('input');
    newtodo.setAttribute("draggable", "true")
    newtodo.classList.add('todo')
    todoColun.insertAdjacentElement('afterend',newtodo)
    let position = 1;
    let colun = "todo-colun";
    newtodo.setAttribute('id',position)
    
    atualizar(position,colun);

    container = new Array ()
    container.push(newtodo);
    events(container)
    let containers = new Todo(newtodo.value, todoColun)
    id = bd.gravar(containers)
    newtodo.setAttribute('id', id)

}

function atualizar(id,colun){
    todo = document.getElementById(id.toString());
    console.log(todo)
    if(todo !== null){
        id_todo = parseInt(todo.getAttribute('id'));
        id_todo += 1;
        todo.setAttribute('id',id_todo);
    }
}

function carregarTodos(){
    let todos = Array()

    todos = bd.RecuperarValores()

    todos.forEach(todos => {
        console.log(todos)
        const newtodo = document.createElement('input');
        newtodo.setAttribute("draggable", "true")
        newtodo.classList.add('todo')
        let todo = JSON.parse(todos)
        newtodo.setAttribute('value',todo.text)
        todoColun.insertAdjacentElement('afterend',newtodo)
        container = new Array ()
        container.push(newtodo);
        events(container)
    })
}


function events(containers){

    containers.forEach(container => {
        container.addEventListener('dragstart', () => {
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => {
            container.classList.remove('dragging')
        })

        container.addEventListener('dblclick', () => {
            container.removeAttribute('readonly')
        })

        container.addEventListener('focusin', () => {
            container.setAttribute('readonly', 'true')
        })

        container.addEventListener('focusout', () => {
            container.setAttribute('readonly', 'true')
            id = container.getAttribute('id')
            bd.substituir(id ,container.value)
        })
    })

    coluns.forEach(colun => {
        colun.addEventListener('dragover', e => {
            e.preventDefault()
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
        const draggableElements = [...container.querySelectorAll('.todo:not(.dragging)')]

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if(offset < 0 && offset > closest.offset){
                return { offsset: offset, element: child }
            }else{
                return closest
            }

            } , {offset: Number.NEGATIVE_INFINITY}).element   
    }
}


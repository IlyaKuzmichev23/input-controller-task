import { InputController } from "./input-controller.js";
import { KeyboardPlugin } from "./keyboard-pugin.js";
import { MousePlugin } from "./mouse-plugin.js";

const keyboard = new KeyboardPlugin();

const mouse = new MousePlugin();

const controller = new InputController([keyboard, mouse],
    {
    "left":{
        keys:[37,65],
        button:0,
    },
    "jump":{
        keys:[32],
        button:1
    },
    "right":{
        keys:[39,68],
        button:2
    }},
    window
)


const checkBind = () => {
    controller.bindActions({
        "left":{
            keys:[65]
        },
        "jump":{
            keys:[32]
        }
    });
    console.log(controllerKeyboard.actions);
}

const checkEnable = () => {
    controller.enableAction("left");

    console.log(controllerKeyboard.actions.left.enabled);
}

const checkDisable = () => {
    controller.disableAction("left");

    console.log(controllerKeyboard.actions.left.enabled);

}

const checkAttach = () => {
    controller.attach(window);

    console.log("successfull attached");
}

const checkDetach = () => {
    controller.detach();

    console.log("successfull detached");
}

const enableController = () =>{
    controller.enableController();
}

const disableController = () =>{
    controller.disableController();
}


//кнопки из html
const button1 = document.querySelector("#bindAction");
const button2 = document.querySelector("#enableAction");
const button3 = document.querySelector("#disableAction");
const button4 = document.querySelector("#attach");
const button5 = document.querySelector("#detach");
const button8 = document.querySelector("#enableController");
const button9 = document.querySelector("#disableController");

//добавление слушателей на событие клик
button1.addEventListener('click', checkBind);
button2.addEventListener('click', checkEnable);
button3.addEventListener('click', checkDisable);
button4.addEventListener('click', checkAttach);
button5.addEventListener('click', checkDetach);
button8.addEventListener('click', enableController);
button9.addEventListener('click', disableController);





//движение квадрата

const square = document.getElementById('square');

let x = square.offsetLeft;

//ивенты
window.addEventListener(InputController.ACTION_ACTIVATED, 
    (event) => {console.log('activate', event.detail)}
)

window.addEventListener(InputController.ACTION_DEACTIVATED, 
    (event) => {console.log('deactivate', event.detail)}
)



setInterval(() => {
        if(controller.isActionActive("left")){
            x-=10;
        }
        if(controller.isActionActive("right")){
            x+=10;
        }
        if(controller.isActionActive("jump"))
            square.style.backgroundColor = "green";

        square.style.left = x+"px";
},20)

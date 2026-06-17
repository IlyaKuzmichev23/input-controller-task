import { InputController } from "./input-controller.js";

const controller = new InputController({
    "left":{
        keys:[37,65],
        enabled: false
    },
    "right":{
        keys:[39,68],
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
    console.log(controller.actions);
}

const checkEnable = () => {
    controller.enableAction("left");

    console.log(controller.actions.left.enabled);
}

const checkDisable = () => {
    controller.disableAction("left");

    console.log(controller.actions.left.enabled);

}

const checkAttach = () => {
    controller.attach(window);

    console.log("successfull attached");
}

const checkDetach = () => {
    controller.detach();

    console.log("successfull detached");
}

const checkActionActive = () => {
    console.log(controller.isActionActive("left"));
}

const checkPressKey = () => {
    console.log(controller.isKeyPressed(65));
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
const button6 = document.querySelector("#isActionActive");
const button7 = document.querySelector("#isKeyPressed");
const button8 = document.querySelector("#enableController");
const button9 = document.querySelector("#disableController");

//добавление слушателей на событие клик
button1.addEventListener('click', checkBind);
button2.addEventListener('click', checkEnable);
button3.addEventListener('click', checkDisable);
button4.addEventListener('click', checkAttach);
button5.addEventListener('click', checkDetach);
button6.addEventListener('click', checkActionActive);
button7.addEventListener('click', checkPressKey);
button8.addEventListener('click', enableController);
button9.addEventListener('click', disableController);

//движение квадрата

const square = document.getElementById('square');

let x = square.offsetLeft;

setInterval(() => {
        // controller.focused = true;
        // controller.enabled = true;
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

//ивенты
window.addEventListener(InputController.ACTION_ACTIVATED, 
    (event) => {console.log('activate', event.detail)}
)

window.addEventListener(InputController.ACTION_DEACTIVATED, 
    (event) => {console.log('deactivate', event.detail)}
)


import { Controller } from "./input-controller.js";

const controller = new Controller({
    "left":{
        keys:[37,65],
        enabled: false
    },
    "right":{
        keys:[39,68],
    }
})


checkBind = (btn) => {
    controller.bindActions(btn);
}

checkEnable = (name) => {
    controller.enableAction(name);
}

checkDisable = (name) => {
    controller.disableAction(name);
}

checkAttach = (target) => {

}


controller.attach(window);

setInterval(()=>{
    console.log("A", controller.isKeyPressed(65));
    console.log("D", controller.isKeyPressed(68));
    console.log("left", controller.isActionActive("left"));
    console.log("right", controller.isActionActive("right"));
},100)


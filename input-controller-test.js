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
    controller.attach("window");

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


export class controller{
    static ACTION_ACTIVATED = "input-controller:action-activated"

    static ACTION_DEACTIVATED = "input-controller:action-deactivated"
    constructor(actionsToBind, target){
        this.enabled = true
        this.focused = true

        this.actions = {}
        this.pressedKeys = new Set()
    }

    bindActions(actionsToBind){

    }

    enableAction(actionName){

    }

    disableAction(actionName){

    }

    attach(target, dontEnable=false){

    }

    detach(){

    }

    isActionActive(action){

    }

    isKeyPressed(keyCode){

    }
}
export class Controller{
    static ACTION_ACTIVATED = "input-controller:action-activated"

    static ACTION_DEACTIVATED = "input-controller:action-deactivated"
    constructor(actionsToBind={}, target = null){
        this.enabled = true
        this.focused = true


        this.actions = {}
        this.pressedKeys = new Set()

        this.keyDown = (event) => {

            if(this.pressedKeys.has(event.keyCode))
                return

            this.pressedKeys.add(event.keyCode)
        }
        this.keyUp = (event) => {
            this.pressedKeys.delete(event.keyCode)
        }

        this.bindActions(actionsToBind)

        if(target)
            this.attach(target)
    }

    bindActions(actionsToBind){
        for(const actionName in actionsToBind){
            const action = actionsToBind[actionName]
            if(!this.actions[actionName]){
                this.actions[actionName] = {
                    keys:[],
                    enabled:true
                };
                this.actions[actionName].keys = action.keys || [];
                this.actions[actionName].enabled = action.enabled ?? true;
            }
            else{
                this.actions[actionName].keys = [...new Set([...this.actions[actionName].keys, ...action.keys])];
                this.actions[actionName].enabled = action.enabled ?? this.actions[actionName].enabled ?? true;
            }
        }
    }

    enableAction(actionName){
        this.actions[actionName].enabled = true;
    }

    disableAction(actionName){
        this.actions[actionName].enabled = false;
    }

    attach(target){
        this.target = target;
        this.target.addEventListener("keydown", this.keyDown);
        this.target.addEventListener("keyup", this.keyUp);
    }

    detach(){
        if(this.target){
            this.target.removeEventListener("keydown", this.keyDown);
            this.target.removeEventListener("keyup", this.keyUp);
        }
    }

    isActionActive(action){ 
        if(!this.actions[action])
            return false;
        const val = this.actions[action];
        // console.log(val.enabled)
        // console.log(this.actions)
        // console.log(this.pressedKeys)
        if(!val.enabled)
            return false;
        if(val.keys.some(key => this.pressedKeys.has(key))){
            return true;
        }
        else
            return false;
    }

    isKeyPressed(keyCode){
        if(this.pressedKeys.has(keyCode))
            return true;
        else
            return false;
    }
}
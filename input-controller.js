export class Controller{
    static ACTION_ACTIVATED = "input-controller:action-activated"

    static ACTION_DEACTIVATED = "input-controller:action-deactivated"
    constructor(actionsToBind={}, target =null){
        this.enabled = true
        this.focused = true

        this.actions = {}
        this.pressedKeys = new Set()
        this.bindActions(actionsToBind)
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
                this.actions[actionName].enabled = action.enabled || true;
            }
            else{
                this.actions[actionName].keys = [...new Set([...this.actions[actionName].keys, ...action.keys])];
                this.actions[actionName].enabled = action[actionName].enabled || true;
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
        target.addEventListener("keydown", (event)=>{this.pressedKeys.add(event.keyCode)});
        target.addEventListener("keyup", (event)=>{this.pressedKeys.delete(event.keyCode)});
    }

    detach(){
        this.target.removeEventListener("keydown", (event)=>{this.pressedKeys.add(event.keyCode)});
        this.target.removeEventListener("keyup", (event)=>{this.pressedKeys.add(event.keyCode)});
    }

    isActionActive(action){
        const val = this.actions[action];
        if(val.keys.some(key => this.pressedKeys.has(key)))
            return true;
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
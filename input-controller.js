export class InputController{
    static ACTION_ACTIVATED = "input-controller:action-activated"

    static ACTION_DEACTIVATED = "input-controller:action-deactivated"
    constructor(actionsToBind={}, target = null){
        this.enabled = true
        this.focused = document.hasFocus();

        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);

        this.onFocus = this.onFocus.bind(this);
        this.onBlure = this.onBlure.bind(this);


        this.actions = {}
        this.pressedKeys = new Set()

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
                    enabled:true,
                    active:false
                };
                this.actions[actionName].keys = action.keys || [];
                this.actions[actionName].enabled = action.enabled ?? true;
                this.actions[actionName].active = false;
            }
            else{
                this.actions[actionName].keys = [...new Set([...this.actions[actionName].keys, ...action.keys])];
                this.actions[actionName].enabled = action.enabled ?? this.actions[actionName].enabled ?? true;
                this.actions[actionName].active = false;
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

        window.addEventListener("focus", this.onFocus)
        window.addEventListener("blur", this.onBlure)
    }

    detach(){
        if(this.target){
            this.target.removeEventListener("keydown", this.keyDown);
            this.target.removeEventListener("keyup", this.keyUp);

            window.removeEventListener("focus", this.onFocus)
            window.removeEventListener("blur", this.onBlure)
        }
    }

    isActionActive(action){ 

        if(!this.enabled){
            return;
        }

        if(!this.actions[action])
            return false;
        const val = this.actions[action];
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

    keyDown(event){        
        if(!this.enabled){
            return;
        }

        if(this.pressedKeys.has(event.keyCode))
            return
        this.pressedKeys.add(event.keyCode)

        for(const actionName in this.actions){
            const action = this.actions[actionName]
            if(!action.enabled)
                continue;
            if(action.keys.includes(event.keyCode)){
                if(action.active)
                    continue
                action.active = true;
                this.target.dispatchEvent(
                    new CustomEvent(
                        InputController.ACTION_ACTIVATED,
                        {
                            detail:actionName
                        }
                    )
                )
            }
        }
    }

    keyUp(event){
        
        if(!this.enabled){
            return;
        }
        
        if(!this.pressedKeys.has(event.keyCode))
            return

        this.pressedKeys.delete(event.keyCode)

        for(const actionName in this.actions){
            const action = this.actions[actionName]
            if(!action.enabled)
                continue
            
            const temp = action.keys.some(key =>this.pressedKeys.has(key))

            if(temp)
                continue;

            action.active = false;

            if(action.keys.includes(event.keyCode)){
                this.target.dispatchEvent(
                    new CustomEvent(
                        InputController.ACTION_DEACTIVATED,
                        {
                            detail:actionName
                        }
                    )
                )
            }
        }
    }

    onFocus(){
        this.focused = true
    }

    onBlure(){
        this.focused = false
        this.pressedKeys.clear();
    }

    enableController(){
        this.enabled = true
    }

    disableController(){
        this.enabled = false
        this.pressedKeys.clear()
        for(const actionName in this.actions)
            this.actions[actionName].active = false;
    }
}
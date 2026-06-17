export class InputController{
    static ACTION_ACTIVATED = "input-controller:action-activated"

    static ACTION_DEACTIVATED = "input-controller:action-deactivated"
    constructor(plugin, actionsToBind={}, target = null){
        this.plugin = plugin;

        this.enabled = true;
        this.focused = document.hasFocus();

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.onFocus = this.onFocus.bind(this);
        this.onBlure = this.onBlure.bind(this);


        this.actions = {}

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
        this.target.addEventListener("keydown", this.handleKeyDown);
        this.target.addEventListener("keyup", this.handleKeyUp);

        window.addEventListener("focus", this.onFocus)
        window.addEventListener("blur", this.onBlure)
    }

    detach(){
        if(this.target){
            this.target.removeEventListener("keydown", this.handleKeyDown);
            this.target.removeEventListener("keyup", this.handleKeyUp);

            window.removeEventListener("focus", this.onFocus)
            window.removeEventListener("blur", this.onBlure)

            this.plugin.pressedKeys.clear()
            for(const actionName in this.actions)
                this.actions[actionName].active = false;
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
        return this.plugin.isActionActive(val);
    }

    isKeyPressed(keyCode){
        if(this.plugin.pressedKeys.has(keyCode))
            return true;
        else
            return false;
    }

    onFocus(){
        this.focused = true
    }

    onBlure(){
        this.focused = false
        this.plugin.pressedKeys.clear();
    }

    enableController(){
        this.enabled = true
    }

    disableController(){
        this.enabled = false
        this.plugin.pressedKeys.clear()
        for(const actionName in this.actions)
            this.actions[actionName].active = false;
    }

    handleKeyDown(event){
        const change = this.plugin.keyDown(event);
        if(!change)
            return;
        this.updateActions();
    }
    handleKeyUp(event){
        const change = this.plugin.keyUp(event);
        if(!change)
            return;
        this.updateActions();
    }

    updateActions(){
        if(!this.enabled){
            return;
        }

        for(const actionName in this.actions){
            const action = this.actions[actionName];

            if(!action.enabled)
                continue;

            const activeNow = this.plugin.isActionActive(action);

            if(activeNow && !action.active){
                action.active = true;
                this.target.dispatchEvent(
                    new CustomEvent(
                        InputController.ACTION_ACTIVATED,
                        {
                            detail:actionName
                        }
                    )
                );
            }
            else if(!activeNow && action.active){
                action.active = false;
                this.target.dispatchEvent(
                    new CustomEvent(
                        InputController.ACTION_DEACTIVATED,
                        {
                            detail:actionName
                        }
                    )
                );
            }
        }
    }
}
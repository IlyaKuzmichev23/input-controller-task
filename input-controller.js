export class InputController{
    static ACTION_ACTIVATED = "input-controller:action-activated"

    static ACTION_DEACTIVATED = "input-controller:action-deactivated"
    constructor(plugins, actionsToBind={}, target = null){
        this.plugins = plugins;

        this.enabled = true;
        this.focused = document.hasFocus();

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
                    ...action,
                    enabled:true,
                    active:false
                };
                Object.assign(this.actions[actionName], action)
            }
            else{
                Object.assign(this.actions[actionName], action)
            }
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
        this.updateActions();
        for(const numb in this.plugins)
            if(this.plugins[numb].isActionActive(val))
                return true;
        return false;
    }

    enableAction(actionName){
        this.actions[actionName].enabled = true;
    }

    disableAction(actionName){
        this.actions[actionName].enabled = false;
    }

    attach(target){
        this.target = target;
        for (const numb in this.plugins){
            this.plugins[numb].attach(target);
        }
        window.addEventListener("focus", this.onFocus)
        window.addEventListener("blur", this.onBlure)
    }

    detach(){
        if(this.target){
            for(const numb in this.plugins)
                this.plugins[numb].detach(this.target)

            for(const actionName in this.actions)
                this.actions[actionName].active = false;
            window.removeEventListener("focus", this.onFocus)
            window.removeEventListener("blur", this.onBlure)
        }
    }

    onFocus(){
        this.focused = true
    }

    onBlure(){
        this.focused = false
        for(const numb in this.plugins)
            this.plugins[numb].reset();
    }

    enableController(){
        this.enabled = true
    }

    disableController(){
        this.enabled = false
        for(const numb in this.plugins)
            this.plugins[numb].reset();
        for(const actionName in this.actions)
            this.actions[actionName].active = false;
    }

    updateActions(){
        if(!this.enabled){
            return;
        }

        for(const actionName in this.actions){
            const action = this.actions[actionName];

            if(!action.enabled)
                continue;

            let activeNow = null;
            
            for(const numb in this.plugins){
                if(this.plugins[numb].isActionActive(action))
                    activeNow = true;
            }
            if(!activeNow)
                activeNow = false;

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
export class InputController{
    static ACTION_ACTIVATED = "input-controller:action-activated"

    static ACTION_DEACTIVATED = "input-controller:action-deactivated"
    constructor(plugin, actionsToBind={}, target = null){
        this.plugin = plugin;

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
        return this.plugin.isActionActive(val);
    }

    enableAction(actionName){
        this.actions[actionName].enabled = true;
    }

    disableAction(actionName){
        this.actions[actionName].enabled = false;
    }

    attach(target){
        this.target = target;
        this.plugin.attach(target);

        window.addEventListener("focus", this.onFocus)
        window.addEventListener("blur", this.onBlure)
    }

    detach(){
        if(this.target){
            this.plugin.detach(this.target)

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
        this.plugin.reset();
    }

    enableController(){
        this.enabled = true
    }

    disableController(){
        this.enabled = false
        this.plugin.reset();
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
export class MousePlugin{
    constructor(){
        this.pressedButtons = new Set();

        this.buttonDown = this.buttonDown.bind(this);
        this.buttonUp = this.buttonUp.bind(this);
    }

    isActionActive(action){
        return this.pressedButtons.has(action.button);
    }

    buttonDown(event){
        if(this.pressedButtons.has(event.button))
            return false;
        this.pressedButtons.add(event.button);
        return true;
    }

    buttonUp(event){
        if(!this.pressedButtons.has(event.button))
            return false;
        this.pressedButtons.delete(event.button);
        return true;
    }

    attach(target){
        target.addEventListener("mousedown", this.buttonDown);
        target.addEventListener("mouseup", this.buttonUp)
    }

    detach(target){
        target.removeEventListener("mousedown", this.buttonDown)
        target.removeEventListener("mouseup", this.buttonUp)
    }

    reset(){
        this.pressedButtons.clear();
    }
}
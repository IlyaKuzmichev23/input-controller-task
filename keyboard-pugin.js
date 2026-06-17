export class KeyboardPlugin{
    constructor(){
        this.pressedKeys = new Set();

        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }

    isActionActive(action){
        return action.keys.some(key => this.pressedKeys.has(key))
    }

    keyDown(event){
        if(this.pressedKeys.has(event.keyCode))
            return false;
        this.pressedKeys.add(event.keyCode);
        return true;
    }

    keyUp(event){
        if(!this.pressedKeys.has(event.keyCode))
            return false;
        this.pressedKeys.delete(event.keyCode);
        return true;
    }

    attach(target){
        target.addEventListener("keydown", this.keyDown);
        target.addEventListener("keyup", this.keyUp);
    }

    detach(target){
        target.removeEventListener("keydown", this.keyDown);
        target.removeEventListener("keyup", this.keyUp);

        this.reset();
    }

    reset(){
        this.pressedKeys.clear();
    }
}
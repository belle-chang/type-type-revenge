class HighScore {
	constructor() {
        this.element = document.createElement("DIV");
        this.score = 0;
		this.element.innerText = "Score: 0";
		document.body.appendChild(this.element);
	}

	update() {
        this.score += 1;
		this.element.innerText = "Score: " + this.score;
    }
    
    reset() {
        this.score = 0;
        this.element.innerText = "Score: 0";
    }
}
export default HighScore;
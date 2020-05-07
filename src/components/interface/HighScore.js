class HighScore {
  constructor() {
    this.element = document.createElement("DIV");
    this.element.classList.add("score");
    this.element.classList.add("score-container");
    this.score = 0;
    this.streak = 0;
    this.element.innerText = "Score: 0\n Streak: 0";
    document.body.appendChild(this.element);
  }

  update() {
    this.score += 1;
    this.streak += 1;
    this.element.innerText =
      "Score: " + this.score + "\nStreak: " + this.streak;
  }

  reset() {
    this.streak = 0;
    this.element.innerText =
      "Score: " + this.score + "\nStreak: " + this.streak;
  }

  fullReset() {
    this.score = 0;
    this.streak = 0;
    this.element.innerText =
      "Score: " + this.score + "\nStreak: " + this.streak;
  }
}
export default HighScore;

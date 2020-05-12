class HighScore {
  constructor() {
    this.element = document.createElement("DIV");
    this.element.classList.add("score");
    this.element.classList.add("score-container");
    this.element.classList.add("score-glow");
    this.score = 0;
    this.streak = 0;
    this.element.innerText = "Score: 0\n Streak: 0";
    document.body.appendChild(this.element);
  }

  update() {
    this.streak += 1;

    // streak multiplier
    if (this.streak < 5) this.score += 1;
    else if (this.streak < 10) this.score += 2;
    else if (this.streak < 15) this.score += 3;
    else if (this.streak < 20) this.score += 4;
    else this.score += 5;

    this.element.innerText =
      "Score: " + this.score + "\nStreak: " + this.streak;

    if (this.streak == 10) {
      document.getElementById("message").innerHTML = "perfect!";
      setTimeout(function () {
        document.getElementById("message").innerHTML = "";
      }, 1500);
    }
    if (this.streak == 20) {
      document.getElementById("message").innerHTML = "wow!";
      setTimeout(function () {
        document.getElementById("message").innerHTML = "";
      }, 1500);
    }
    if (this.streak == 30) {
      document.getElementById("message").innerHTML = "amazing!";
      setTimeout(function () {
        document.getElementById("message").innerHTML = "";
      }, 1500);
    }
    if (this.streak == 40) {
      document.getElementById("message").innerHTML = "wowowowowowow!";
      setTimeout(function () {
        document.getElementById("message").innerHTML = "";
      }, 1500);
    }
    if (this.streak == 50) {
      document.getElementById("message").innerHTML = "don't screw up now lmao!";
      setTimeout(function () {
        document.getElementById("message").innerHTML = "";
      }, 1500);
    }
    if (this.score == 60) {
      document.getElementById("message").innerHTML = "awesome!";
      setTimeout(function () {
        document.getElementById("message").innerHTML = "";
      }, 1500);
    }
    if (this.score == 75 && this.streak == 75) {
      document.getElementById("message").innerHTML = "literal perfection";
      setTimeout(function () {
        document.getElementById("message").innerHTML = "";
      }, 1500);
    }
  }

  // reset streak
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

  displayScore() {
    document.getElementById("final-score").innerHTML =
      "Final score: " + this.score;
    document.getElementById("game-over").className = "instructions";
  }
}
export default HighScore;

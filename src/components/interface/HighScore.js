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

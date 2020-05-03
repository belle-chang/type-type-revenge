class PositionFinder {
    constructor(minx, maxx) {
      let arr = []
      // this.allPositions.length = maxx - minx;
      for (var i = 0; i < (maxx - minx); i++) {
        arr.push(false);
      }
      this.allPositions = arr;
      this.minx = minx;
      this.maxx = maxx;
    }
    add() {
      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max) + 1;
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
      }
      let random = getRandomInt(this.minx, this.maxx);
      // debugger;
      while (this.allPositions[random + this.maxx]) {
        random = getRandomInt(this.minx, this.maxx);
      }
      this.allPositions[random + this.maxx] = true;
      return random;
    }
    clear(index) {
      this.allPositions[index + this.maxx] = false;
    }
}
export default PositionFinder;
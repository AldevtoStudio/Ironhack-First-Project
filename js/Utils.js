CanvasRenderingContext2D.prototype.fillVerticalText = function (text, x, y, verticalSpacing) {
  for (var i = 0; i < text.length; i++) {
    this.fillText(text[i], x, y + i * verticalSpacing);
  }
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Round(number) {
  return +(Math.round(number + 'e+2') + 'e-2');
}

function Clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

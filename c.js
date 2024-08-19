var c = document.getElementById("c");
var ctx = c.getContext("2d");
var cw = c.width = window.innerWidth;
var ch = c.height = window.innerHeight;
var cX = cw / 2,
  cY = ch / 2;
var rad = Math.PI / 180;
var howMany = 100;
var t = 1 / 5;

ctx.strokeStyle = "white";
ctx.shadowBlur = 5;
ctx.shadowColor = "#333";
ctx.globalAlpha = .85;

var colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#fffffc"];
var flowers = [];
for (var hm = 0; hm < howMany; hm++) {
  flowers[hm] = {
    cx: Math.random() * cw,
    cy: Math.random() * ch,
    R: randomIntFromInterval(20, 50),
    Ri: randomIntFromInterval(5, 7) / 10,
    k: randomIntFromInterval(5, 10) / 10,
    ki: randomIntFromInterval(2, 7) / 100,
    K: randomIntFromInterval(5, 16) / 10,
    fs: colors[randomIntFromInterval(0, colors.length - 1)],
    cs: colors[randomIntFromInterval(0, colors.length - 1)],
    nP: randomIntFromInterval(4, 10),
    spacing: randomIntFromInterval(4, 10)
  };
}

function buildRy(R, k, cx, cy, nP, spacing) {
  var r = R * k;
  var A = 360 / nP; //nP num petals
  var petals = [];
  for (var i = 0; i < nP; i++) {
    var ry = [];

    ry[ry.length] = {
      x: cx,
      y: cy
    }

    var a1 = i * A + spacing;
    var x1 = ~~(cx + R * Math.cos(a1 * rad));
    var y1 = ~~(cy + R * Math.sin(a1 * rad));

    ry[ry.length] = {
      x: x1,
      y: y1,
      a: a1
    }

    var a2 = i * A + A / 2;
    var x2 = ~~(cx + r * Math.cos(a2 * rad));
    var y2 = ~~(cy + r * Math.sin(a2 * rad));

    ry[ry.length] = {
      x: x2,
      y: y2,
      a: a2
    }

    var a3 = i * A + A - spacing
    var x3 = ~~(cx + R * Math.cos(a3 * rad));
    var y3 = ~~(cy + R * Math.sin(a3 * rad));

    ry[ry.length] = {
      x: x3,
      y: y3,
      a: a3
    }

    ry[ry.length] = {
      x: cx,
      y: cy
    }

    petals[i] = ry;

  }
  return petals
}

function update() {
  ctx.clearRect(0, 0, cw, ch);
  flowers.forEach(function (flower) {
    if (flower.k < flower.K) {
      flower.R += flower.Ri;
      flower.k += flower.ki;
    }
    var petals = buildRy(flower.R, flower.k, flower.cx, flower.cy, flower.nP, flower.spacing);
    petals.forEach(drawCurve);
    drawCenter(flower.k, flower.cx, flower.cy, flower.cs);
  });
  requestId = window.requestAnimationFrame(update);
}

function drawCenter(k, cx, cy, cs) {
  ctx.beginPath();
  ctx.fillStyle = cs;
  ctx.arc(cx, cy, k * 10, 0, 2 * Math.PI)
  ctx.fill();
}

function drawCurve(p) {

  var pc = controlPoints(p); // the control points array

  ctx.beginPath();
  ctx.moveTo(p[0].x, p[0].y);
  // the first & the last curve are quadratic Bezier
  // because I'm using push(), pc[i][1] comes before pc[i][0]
  ctx.quadraticCurveTo(pc[1][1].x, pc[1][1].y, p[1].x, p[1].y);

  if (p.length > 2) {
    // central curves are cubic Bezier
    for (var i = 1; i < p.length - 2; i++) {
      ctx.bezierCurveTo(pc[i][0].x, pc[i][0].y, pc[i + 1][1].x, pc[i + 1][1].y, p[i + 1].x, p[i + 1].y);
    }
    // the first & the last curve are quadratic Bezier
    var n = p.length - 1;
    ctx.quadraticCurveTo(pc[n - 1][0].x, pc[n - 1][0].y, p[n].x, p[n].y);
  }
  ctx.fill();
}

function controlPoints(p) {
  // given the points array p calculate the control points
  var pc = [];
  for (var i = 1; i < p.length - 1; i++) {
    var dx = p[i - 1].x - p[i + 1].x; // difference x
    var dy = p[i - 1].y - p[i + 1].y; // difference y
    // the first control point
    var x1 = p[i].x - dx * t;
    var y1 = p[i].y - dy * t;
    var o1 = {
      x: x1,
      y: y1
    };

    // the second control point
    var x2 = p[i].x + dx * t;
    var y2 = p[i].y + dy * t;
    var o2 = {
      x: x2,
      y: y2
    };

    // building the control points array
    pc[i] = [];
    pc[i].push(o1);
    pc[i].push(o2);
  }
  return pc;
}

function randomIntFromInterval(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1)) + mn;
}

window.addEventListener('scroll', function() {
  var scrollY = window.scrollY;
  flowers.forEach(function (flower) {
    flower.cy += scrollY * 0.05;
  });
});

for (var f = 0; f < flowers.length; f++) {
  var petals = buildRy(flowers[f].R, flowers[f].k, flowers[f].cx, flowers[f].cy, flowers[f].nP, flowers[f].spacing);
  petals.forEach(drawCurve);
  drawCenter(flowers[f].k, flowers[f].cx, flowers[f].cy, flowers[f].cs);
}

requestId = window.requestAnimationFrame(update);

window.setTimeout(function() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
  }
}, 6000);

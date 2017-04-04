import _ from 'lodash';

const contentElement = document.getElementById('content');
const randomNumber = (min, max) => Math.floor(Math.random() * max) + min;
let COUNTER = 1;
const MAX_CIRCLE_AMOUNT = 20;

const COLORS = [
  '#FF9E9E',
  '#9EFFC6',
  '#9EEFFF',
  '#D8CEFF',
  '#B6FF9E',
];

const makeCircle = (event) => {
  const circle = document.createElement('div');
  circle.id = `circle-${ COUNTER }`;
  circle.className = 'circle';

  COUNTER++;

  const randomDimension = randomNumber(100, 250);

  // The top, left, translateX & translateY values should be set
  // to ensure that the sphere appears when the user clicked, but its position
  // is correctly transformed.

  // For the sphere to appear where the user clicked, its position should be:
  // Its absolute position + any transformations based on the coords of the click

  circle.setAttribute('style', `
    width: ${ randomDimension }px;
    height: ${ randomDimension }px;
    position: fixed;
    top: ${ event.pageY - (randomDimension / 2) }px;
    left: ${ event.pageX - (randomDimension / 2) }px;
    background: linear-gradient(${ randomNumber(0, 90) }deg, #FEB522 0%, ${ COLORS[randomNumber(0, COLORS.length)] } 100%);
  `);

  if (COUNTER > MAX_CIRCLE_AMOUNT) {
    const circleToDelete = document.getElementById(`circle-${ COUNTER - MAX_CIRCLE_AMOUNT }`);
    circleToDelete.classList.add('scale-down');
    setTimeout(() => circleToDelete.remove(), 990);
  }

  contentElement.appendChild(circle);
};

const mouseMove = (event) => {
  const coordinatesFromCentre = {
    x: event.pageX - (window.innerWidth / 2),
    y: (window.innerHeight / 2) - event.pageY,
  };

  const circles = document.getElementsByClassName('circle');

  _.map(circles, (circle, index) => {
    const translateXAmount = -(coordinatesFromCentre.x * (index + 2)) / 100;
    const translateYAmount = (coordinatesFromCentre.y * (index + 2)) / 100;

    // console.log('translateXAmount, translateYAmount', translateXAmount, translateYAmount);

    circle.style.transform = `
      scale(1) translateX(${ translateXAmount }px) translateY(${ translateYAmount }px)
    `;
  });
};

const throttledMouseMove = _.throttle(mouseMove, 10);

contentElement.addEventListener('click', makeCircle, true);
contentElement.addEventListener('mousemove', throttledMouseMove, true);

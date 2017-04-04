import _ from 'lodash';

// TODO
//
// Prevent anymore transitions on shrinking circles
// Once circles start getting deleted, think COUNTER is messing up the distances

const contentElement = document.getElementById('content');
const randomNumber = (min, max) => Math.floor(Math.random() * max) + min;
let COUNTER = 0;
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
  circle.classList.add('has-transitions');

  const randomDimension = randomNumber(100, 250);

  const coordinatesFromCentre = {
    x: event.pageX - (window.innerWidth / 2),
    y: (window.innerHeight / 2) - event.pageY,
  };

  const counterForTranslate = COUNTER > MAX_CIRCLE_AMOUNT ? MAX_CIRCLE_AMOUNT : COUNTER;

  const translateXAmount = -(coordinatesFromCentre.x * (counterForTranslate + 2)) / 100;
  const translateYAmount = (coordinatesFromCentre.y * (counterForTranslate + 2)) / 100;

  COUNTER++;

  circle.setAttribute('style', `
    width: ${ randomDimension }px;
    height: ${ randomDimension }px;
    position: fixed;
    opacity: 0;
    transform: translateX(${ translateXAmount }px) translateY(${ translateYAmount }px);
    top: ${ event.pageY - translateYAmount - (randomDimension / 2) }px;
    left: ${ event.pageX - translateXAmount - (randomDimension / 2) }px;
    background: linear-gradient(${ randomNumber(0, 90) }deg, #FEB522 0%, ${ COLORS[randomNumber(0, COLORS.length)] } 100%);
  `);

  if (COUNTER > MAX_CIRCLE_AMOUNT) {
    const circleToDelete = document.getElementById(`circle-${ COUNTER - MAX_CIRCLE_AMOUNT }`);
    // const toDeleteTranslateXAmount = -(coordinatesFromCentre.x * (COUNTER - MAX_CIRCLE_AMOUNT + 2)) / 100;
    // const toDeleteTranslateYAmount = (coordinatesFromCentre.y * (COUNTER - MAX_CIRCLE_AMOUNT + 2)) / 100;

    setTimeout(() => {
      circleToDelete.classList.add('has-slow-transitions');
      circleToDelete.style.opacity = '0';

      setTimeout(() => {
        circleToDelete.remove();
      }, 990);
    }, 50);
  }

  contentElement.appendChild(circle);

  setTimeout(() => {
    circle.style.opacity = '1';

    setTimeout(() => {
      circle.classList.remove('has-transitions');
    }, 400);
  }, 50);
};

const mouseMove = (event) => {
  console.log('mouseMove()');
  const coordinatesFromCentre = {
    x: event.pageX - (window.innerWidth / 2),
    y: (window.innerHeight / 2) - event.pageY,
  };

  const circles = document.getElementsByClassName('circle');

  _.map(circles, (circle, index) => {
    const translateXAmount = -(coordinatesFromCentre.x * (index + 2)) / 100;
    const translateYAmount = (coordinatesFromCentre.y * (index + 2)) / 100;

    circle.style.transform = `
      scale(1) translateX(${ translateXAmount }px) translateY(${ translateYAmount }px)
    `;
  });
};

const throttledMouseMove = _.throttle(mouseMove, 10);

contentElement.addEventListener('click', makeCircle, true);
contentElement.addEventListener('mousemove', throttledMouseMove, true);

import _ from 'lodash';

const contentElement = document.getElementById('content');
const randomNumber = (min, max) => Math.floor(Math.random() * max) + min;

let COUNTER = 0;

const MAX_CIRCLE_AMOUNT = 15;
const PARALLAX_AMOUNT_DIVISOR = 80;
const LONG_ANIMATION_DURATION = 1000;
const SHORT_ANIMATION_DURATION = 200;

const COLORS = ['#FF9E9E', '#9EFFC6', '#9EEFFF', '#D8CEFF', '#B6FF9E'];

const getPointerCoordinatesFromCentre = (positionX, positionY) => {
  return {
    x: positionX - (window.innerWidth / 2),
    y: (window.innerHeight / 2) - positionY,
  };
};

const getTranslateAmountsFromCoordinates = (coordinates, multiplierFromZero, divisor) => {
  const MULTIPLIER_BUFFER = 2;
  // multiplier comes from the counter, or the array index of a circle element, so
  // will sometimes be 0 or 1 but we don't want to multiply by these

  return {
    translateX: -(coordinates.x * (multiplierFromZero + MULTIPLIER_BUFFER)) / divisor,
    translateY: (coordinates.y * (multiplierFromZero + MULTIPLIER_BUFFER)) / divisor,
  };
};

const makeCircle = (event) => {
  const circle = document.createElement('div');
  circle.id = `circle-${ COUNTER }`;
  circle.className = 'circle';
  circle.classList.add('has-transitions');

  const randomDimension = randomNumber(100, 250);

  const multiplierForTranslateAmounts = COUNTER > MAX_CIRCLE_AMOUNT ? MAX_CIRCLE_AMOUNT : COUNTER;

  const { translateX, translateY } = getTranslateAmountsFromCoordinates(
    getPointerCoordinatesFromCentre(event.pageX, event.pageY),
    multiplierForTranslateAmounts,
    PARALLAX_AMOUNT_DIVISOR
  );

  COUNTER++;

  circle.setAttribute('style', `
    width: ${ randomDimension }px;
    height: ${ randomDimension }px;
    position: fixed;
    opacity: 0;
    transform: translateX(${ translateX }px) translateY(${ translateY }px);
    top: ${ event.pageY - translateY - (randomDimension / 2) }px;
    left: ${ event.pageX - translateX - (randomDimension / 2) }px;
    background: linear-gradient(${ randomNumber(0, 90) }deg, #FEB522 0%, ${ COLORS[randomNumber(0, COLORS.length)] } 100%);
  `);

  if (COUNTER > MAX_CIRCLE_AMOUNT) {
    const circleToDelete = document.getElementById(`circle-${ COUNTER - MAX_CIRCLE_AMOUNT }`);

    setTimeout(() => {
      circleToDelete.classList.add('has-slow-transitions');
      circleToDelete.style.opacity = '0';
      setTimeout(() => circleToDelete.remove(), LONG_ANIMATION_DURATION);
    }, 0);
  }

  contentElement.appendChild(circle);

  setTimeout(() => {
    circle.style.opacity = '1';
    setTimeout(() => circle.classList.remove('has-transitions'), SHORT_ANIMATION_DURATION);
  }, 0);
};

const mouseMove = (event) => {
  const circles = document.getElementsByClassName('circle');

  _.map(circles, (circle, index) => {
    const { translateX, translateY } = getTranslateAmountsFromCoordinates(
      getPointerCoordinatesFromCentre(event.pageX, event.pageY),
      index,
      PARALLAX_AMOUNT_DIVISOR
    );

    circle.style.transform = `
      scale(1) translateX(${ translateX }px) translateY(${ translateY }px)
    `;
  });
};

const throttledMouseMove = _.throttle(mouseMove, 10);
contentElement.addEventListener('click', makeCircle, true);
contentElement.addEventListener('mousemove', throttledMouseMove, true);

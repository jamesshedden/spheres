import _ from 'lodash';

const contentElement = document.getElementById('content');
const randomNumber = (min, max) => Math.floor(Math.random() * max) + min;

let COUNTER = 0;

const MAX_CIRCLE_AMOUNT = 20;
const PARALLAX_AMOUNT_DIVISOR = 80;
const LONG_ANIMATION_DURATION = 1000;
const SHORT_ANIMATION_DURATION = 200;

const COLORS = ['#FF9E9E', '#9EFFC6', '#9EEFFF', '#D8CEFF', '#B6FF9E'];

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
  const translateXAmount = -(coordinatesFromCentre.x * (counterForTranslate + 2)) / PARALLAX_AMOUNT_DIVISOR;
  const translateYAmount = (coordinatesFromCentre.y * (counterForTranslate + 2)) / PARALLAX_AMOUNT_DIVISOR;

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
  const coordinatesFromCentre = {
    x: event.pageX - (window.innerWidth / 2),
    y: (window.innerHeight / 2) - event.pageY,
  };

  const circles = document.getElementsByClassName('circle');

  _.map(circles, (circle, index) => {
    const translateXAmount = -(coordinatesFromCentre.x * (index + 2)) / PARALLAX_AMOUNT_DIVISOR;
    const translateYAmount = (coordinatesFromCentre.y * (index + 2)) / PARALLAX_AMOUNT_DIVISOR;

    circle.style.transform = `
      scale(1) translateX(${ translateXAmount }px) translateY(${ translateYAmount }px)
    `;
  });
};

const throttledMouseMove = _.throttle(mouseMove, 10);
contentElement.addEventListener('click', makeCircle, true);
contentElement.addEventListener('mousemove', throttledMouseMove, true);

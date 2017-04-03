// import _ from 'lodash';

const contentElement = document.getElementById('content');
const randomNumber = (min, max) => Math.floor(Math.random() * max) + min;
let COUNTER = 1;

const COLORS = [
  'lightblue',
  'lightgreen',
  'yellow',
  'orange',
  'purple',
  'pink',
];

const makeCircles = (posX, posY, discElement) => {
  const circle = document.createElement('div');
  circle.className = 'circle';
  const randomDimension = randomNumber(100, 250);

  circle.setAttribute('style', `
    width: ${ randomDimension }px;
    height: ${ randomDimension }px;
    position: fixed;
    top: ${ posY - (randomDimension / 2) }px;
    left: ${ posX - (randomDimension / 2) }px;
    background: ${ COLORS[randomNumber(0, COLORS.length)] };
  `);

  discElement.appendChild(circle);
};

const makeDisc = (event) => {
  const disc = document.createElement('div');
  disc.id = `disc-${ COUNTER }`;

  [...Array(5)].map(() => makeCircles(event.pageX, event.pageY, disc));
  COUNTER++;

  if (COUNTER > 15) {
    const discToDelete = document.getElementById(`disc-${ COUNTER - 15 }`);
    discToDelete.classList.add('scale-down');
    setTimeout(() => discToDelete.remove(), 1000);
  }

  contentElement.appendChild(disc);
};

contentElement.addEventListener('click', makeDisc, true);

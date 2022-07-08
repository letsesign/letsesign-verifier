export const routes = {
  init: '/',
  examine: '/examine',
  verify: '/verify'
};

export const scaleOptions = [
  { key: '1', value: 0.67, text: '50%' },
  { key: '2', value: 1.0, text: '75%' },
  { key: '3', value: 1.33, text: '100%' },
  { key: '4', value: 1.67, text: '125%' },
  { key: '5', value: 2.0, text: '150%' },
  { key: '6', value: 2.67, text: '200%' },
  { key: '7', value: 5.33, text: '400%' }
];

export const fitScaleOption = {
  key: '8',
  value: 0,
  text: 'examine.dropdown.fitToWidth'
};

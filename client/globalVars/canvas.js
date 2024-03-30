export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);
ctx.shadowColor = 'white';

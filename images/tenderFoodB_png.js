/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;

/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;
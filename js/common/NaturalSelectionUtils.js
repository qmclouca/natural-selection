// Copyright 2019-2020, University of Colorado Boulder

//TODO should any of these be migrated to common?
/**
 * NaturalSelectionUtils defines utility functions that are specific to this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import naturalSelection from '../naturalSelection.js';

const NaturalSelectionUtils = {

  /**
   * Determines the time that it takes to execute a specified function.
   * @param {function} someFunction - a function with no parameters and no return value
   * @returns {number} the time to complete someFunction, in ms
   * @public
   */
  time( someFunction ) {
    const tBefore = performance.now();
    someFunction();
    return performance.now() - tBefore;
  },

  /**
   * Logs the time that it takes to execute a specified function.
   * For example, if you want to time this:
   *   this.step( dt );
   * Wrap it like this:
   *   logTime( 'step', () => this.step( dt ) );
   * Console output will look like this:
   *   step took 56.68500000001586 ms
   *
   * @param {string} name
   * @param {function} someFunction - a function with no parameters and no return value
   * @public
   */
  logTime( name, someFunction ) {
    console.log( `${name} took ${NaturalSelectionUtils.time( someFunction )} ms` );
  },

  /**
   * Determines whether an array is sorted. Duplicates are allowed, and an empty array is considered sorted.
   * @param {number[]} array
   * @param {function(value1:*,value2:*):boolean} [compare] - defaults to ascending numbers
   * @returns {boolean}
   * @public
   */
  isSorted( array, compare ) {
    assert && assert( Array.isArray( array ), 'invalid array' );
    assert && assert( !compare || typeof compare === 'function', 'invalid array' );

    compare = compare || ( ( value1, value2 ) => value1 <= value2 );
    let isSorted = true;
    for ( let i = 1; i < array.length - 1 && isSorted; i++ ) {
      isSorted = compare( array[ i ], array[ i + 1 ] );
    }
    return isSorted;
  },

  /**
   * Determines whether a value is a positive number.
   * @param {*} value
   * @returns {boolean}
   * @public
   */
  isPositive( value ) {
    return ( typeof value === 'number' && value > 0 );
  },

  /**
   * Determines whether a value is a non-negative number.
   * @param {*} value
   * @returns {boolean}
   * @public
   */
  isNonNegative( value ) {
    return ( typeof value === 'number' ) && ( value >= 0 );
  },

  //TODO cannot use Utils.isInteger because it fails assert for non-numbers
  /**
   * Determines what a value is an integer.
   * @param {*} value
   * @returns {boolean}
   */
  isInteger( value ) {
    return ( typeof value === 'number' ) && ( value % 1 === 0 );
  },

  /**
   * Determines whether a value is a positive integer.
   * @param {*} value
   * @returns {boolean}
   * @public
   */
  isPositiveInteger( value ) {
    return NaturalSelectionUtils.isPositive( value ) && NaturalSelectionUtils.isInteger( value );
  },

  /**
   * Determines whether a value is a non-negative integer.
   * @param {*} value
   * @returns {boolean}
   */
  isNonNegativeInteger( value ) {
    return NaturalSelectionUtils.isNonNegative( value ) && NaturalSelectionUtils.isInteger( value );
  },

  /**
   * Gets the next random double in a Range.
   * For min < max, the return value is [min,max), between min (inclusive) and max (exclusive).
   * For min === max, the return value is min.
   * @param {Range} range
   * @returns {number}
   * @public
   */
  nextInRange( range ) {
    if ( range.min < range.max ) {
      return phet.joist.random.nextDoubleBetween( range.min, range.max );
    }
    else {
      // because random.nextDoubleBetween requires min < max
      return range.min;
    }
  }
};

naturalSelection.register( 'NaturalSelectionUtils', NaturalSelectionUtils );
export default NaturalSelectionUtils;
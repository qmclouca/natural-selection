// Copyright 2020, University of Colorado Boulder

/**
 * ProportionsCounts is a data structure used by the Proportions model. It describes the bunny population at
 * the start and end of a generation. This is static, immutable data.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyCounts from './BunnyCounts.js';
import createIOType from './createIOType.js';

class ProportionsCounts {

  /**
   * @param {number} generation
   * @param {BunnyCounts} startCounts
   * @param {BunnyCounts} endCounts
   */
  constructor( generation, startCounts, endCounts ) {

    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( generation ), 'invalid generation' );
    assert && assert( startCounts instanceof BunnyCounts, 'invalid startCounts' );
    assert && assert( endCounts instanceof BunnyCounts, 'invalid endCounts' );

    // @public (read-only)
    this.generation = generation;
    this.startCounts = startCounts;
    this.endCounts = endCounts;
  }

  //--------------------------------------------------------------------------------------------------------------------
  // Below here are methods used by ProportionsCountsIO to serialize PhET-iO state.
  //--------------------------------------------------------------------------------------------------------------------

  /**
   * Serializes this ProportionsCounts instance.
   * @returns {Object}
   * @public
   */
  toStateObject() {
    return {
      generation: NumberIO.toStateObject( this.generation ),
      startCounts: BunnyCounts.BunnyCountsIO.toStateObject( this.startCounts ),
      endCounts: BunnyCounts.BunnyCountsIO.toStateObject( this.endCounts )
    };
  }

  /**
   * Deserializes a ProportionsCounts instance.
   * @param {Object} stateObject - return value from toStateObject
   * @returns {ProportionsCounts}
   * @public
   */
  static fromStateObject( stateObject ) {
    return new ProportionsCounts(
      NumberIO.fromStateObject( stateObject.generation ),
      BunnyCounts.BunnyCountsIO.fromStateObject( stateObject.startCounts ),
      BunnyCounts.BunnyCountsIO.fromStateObject( stateObject.endCounts )
    );
  }
}

ProportionsCounts.ProportionsCountsIO = createIOType( 'ProportionsCountsIO', ProportionsCounts, {
  toStateObject: proportionsCounts => proportionsCounts.toStateObject(),
  fromStateObject: stateObject => ProportionsCounts.fromStateObject( stateObject )
} );

naturalSelection.register( 'ProportionsCounts', ProportionsCounts );
export default ProportionsCounts;
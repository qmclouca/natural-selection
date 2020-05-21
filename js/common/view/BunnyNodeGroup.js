// Copyright 2020, University of Colorado Boulder

/**
 * BunnyNodeGroup is the PhetioGroup for BunnyNode.  It manages dynamic instances of BunnyNode, as required by PhET-iO.
 * All BunnyNode instances are created and disposed via this group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import PhetioGroupIO from '../../../../tandem/js/PhetioGroupIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from '../model/Bunny.js';
import BunnyCollection from '../model/BunnyCollection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';
import BunnyNode from './BunnyNode.js';
import BunnyNodeIO from './BunnyNodeIO.js';

class BunnyNodeGroup extends PhetioGroup {

  /**
   * @param {BunnyCollection} bunnyCollection
   * @param {Property.<Bunny|null>} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( bunnyCollection, selectedBunnyProperty, options ) {

    assert && assert( bunnyCollection instanceof BunnyCollection, 'invalid bunnyCollection' );
    assert && NaturalSelectionUtils.assertPropertyPredicate( selectedBunnyProperty,
        value => value instanceof Bunny || value === null );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: PhetioGroupIO( BunnyNodeIO ),
      supportsDynamicState: false,
      phetioDocumentation: 'manages dynamic PhET-iO elements of type BunnyNode'
    }, options );

    /**
     * Called to instantiate a BunnyNode.
     * @param {Tandem} tandem - PhetioGroup requires tandem to be the first param
     * @param {Bunny} bunny
     * @returns {Bunny}
     */
    const createElement = ( tandem, bunny ) => {
      return new BunnyNode( bunny, selectedBunnyProperty, {
        tandem: tandem
      } );
    };

    // defaultArguments, passed to createElement during API harvest (when running 'grunt generate-phet-io-api').
    // Note that bunnyCollection.getArchetype is non-null only during API harvest.
    const defaultArguments = [ bunnyCollection.getArchetype() ];

    super( createElement, defaultArguments, options );
  }
}

naturalSelection.register( 'BunnyNodeGroup', BunnyNodeGroup );
export default BunnyNodeGroup;
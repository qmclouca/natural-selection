// Copyright 2020, University of Colorado Boulder

/**
 * Food is the model of one item of food.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Sprite = require( 'NATURAL_SELECTION/common/model/Sprite' );

  class Food extends Sprite {

    /**
     * @param {string} debugLabel
     * @param {HTMLImageElement} toughImage
     * @param {HTMLImageElement} tenderImage
     * @param {Object} [options]
     */
    constructor( debugLabel, toughImage, tenderImage, options ) {

      assert && assert( !options.tandem, 'Food instances should not be instrumented' );

      super( options );

      // @public (read-only)
      this.debugLabel = debugLabel;
      this.toughImage = toughImage;
      this.tenderImage = tenderImage;

      // @public
      this.isToughProperty = new BooleanProperty( false );

      // @public whether the food is visible, used to hide food when the food supply is limited
      this.visibleProperty = new BooleanProperty( true );
    }

    /**
     * @public
     */
    reset() {
      super.reset();
      this.visibleProperty.reset();
      this.isToughProperty.reset();
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'Food does not support dispose' );
    }
  }

  return naturalSelection.register( 'Food', Food );
} );
// Copyright 2019-2020, University of Colorado Boulder

/**
 * DataProbeDragListener is the drag listener for the data probe on the Population graph.
 * Historical information and requirements can be found in https://github.com/phetsims/natural-selection/issues/14.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Property = require( 'AXON/Property' );

  class DataProbeDragListener extends DragListener {

    /**
     * @param {Property.<Vector2>} positionProperty
     * @param {Range} xRange
     * @param {Object} [options]
     */
    constructor( positionProperty, xRange, options ) {

      options = merge( {}, options );

      assert && assert( !options.dragBoundsProperty, 'DataProbeDragListener sets dragBoundsProperty' );
      options.dragBoundsProperty = new Property( new Bounds2( xRange.min, 0, xRange.max, 0 ) );

      assert && assert( !options.positionProperty, 'DataProbeDragListener sets positionProperty' );
      options.positionProperty = positionProperty;

      super( options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'DataProbeDragListener does not support dispose' );
    }
  }

  return naturalSelection.register( 'DataProbeDragListener', DataProbeDragListener );
} );
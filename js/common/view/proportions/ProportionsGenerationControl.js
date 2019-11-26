// Copyright 2019, University of Colorado Boulder

/**
 * ProportionsGenerationControl is used to choose the generation number displayed in the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  
  // strings
  const generationNumberString = require( 'string!NATURAL_SELECTION/generationNumber' );
  
  class ProportionsGenerationControl extends HBox {

    /**
     * @param {Property.<number>} generationProperty
     * @param {Object} [options]
     */
    constructor( generationProperty, options ) {

      options = merge( {
        spacing: 10
      }, options );

      const generationNode = new Text( '', {
        font: NaturalSelectionConstants.TEXT_FONT,
        maxWidth: 150 // determined empirically
      } );

      const previous = () => generationProperty.value--;
      const previousButton = new ArrowButton( 'left', previous, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS );

      const next = () => generationProperty.value++;
      const nextButton = new ArrowButton( 'right', next, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS );

      assert && assert( !options.children, 'ProportionsGenerationControl sets children' );
      options.children = [ previousButton, generationNode, nextButton ];

      super( options );

      generationProperty.link( generation => {
        previousButton.enabled = ( generation > 0 );
        generationNode.text = StringUtils.fillIn( generationNumberString, { number: generation } );
      } );
    }
  }

  return naturalSelection.register( 'ProportionsGenerationControl', ProportionsGenerationControl );
} );
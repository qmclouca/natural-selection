// Copyright 2019, University of Colorado Boulder

/**
 * GraphRadioButtonGroup is the radio button group for selecting a graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  const populationString = require( 'string!NATURAL_SELECTION/population' );
  const proportionsString = require( 'string!NATURAL_SELECTION/proportions' );
  const pedigreeString = require( 'string!NATURAL_SELECTION/pedigree' );

  // constants
  const TEXT_OPTIONS = {
    font: NaturalSelectionConstants.RADIO_BUTTON_FONT,
    maxWidth: 175 // determined empirically
  };

  class GraphRadioButtonGroup extends VerticalAquaRadioButtonGroup {

    /**
     * @param {EnumerationProperty.<Graphs>} graphProperty
     * @param {Object} [options]
     */
    constructor( graphProperty, options ) {

      options = merge( {
        radius: 8,
        xSpacing: 10,
        spacing: 12
      }, options );

      // Create the description of the buttons
      const items = [
        { value: Graphs.POPULATION, node: new Text( populationString, TEXT_OPTIONS ) },
        { value: Graphs.PROPORTIONS, node: new Text( proportionsString, TEXT_OPTIONS ) },
        { value: Graphs.PEDIGREE, node: new Text( pedigreeString, TEXT_OPTIONS ) }
      ];

      super( graphProperty, items, options );
    }
  }

  return naturalSelection.register( 'GraphRadioButtonGroup', GraphRadioButtonGroup );
} );
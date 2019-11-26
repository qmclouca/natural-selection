// Copyright 2019, University of Colorado Boulder

//TODO create a UI per generation, so that we can 'wipe' between them
//TODO change "Currently" to "End of Generation" after selection agents have been applied
/**
 * ProportionGraphNode displays the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ProportionsBarNode = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsBarNode' );
  const ProportionsGenerationControl = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsGenerationControl' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const countBunniesString = require( 'string!NATURAL_SELECTION/countBunnies' );
  const earsString = require( 'string!NATURAL_SELECTION/ears' );
  const endOfGenerationString = require( 'string!NATURAL_SELECTION/endOfGeneration' );
  const furString = require( 'string!NATURAL_SELECTION/fur' );
  const oneBunnyString = require( 'string!NATURAL_SELECTION/oneBunny' );
  const startOfGenerationString = require( 'string!NATURAL_SELECTION/startOfGeneration' );
  const teethString = require( 'string!NATURAL_SELECTION/teeth' );

  // constants
  const COLUMNS_SPACING = 20;
  const LABEL_FONT = new PhetFont( 14 );
  const VALUE_FONT = new PhetFont( 14 );

  class ProportionsGraphNode extends Node {

    /**
     * @param {ProportionsModel} proportionsModel
     * @param {Object} [options]
     */
    constructor( proportionsModel, options ) {

      options = merge( {
        graphWidth: 100,
        graphHeight: 100
      }, options );

      const backgroundNode = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
        fill: 'white',
        stroke: NaturalSelectionColors.GRAPHS_STROKE
      } );

      const generationControl = new ProportionsGenerationControl( proportionsModel.generationProperty, {
        top: backgroundNode.top + 8
      } );
      generationControl.on( 'bounds', () => {
        generationControl.centerX = backgroundNode.centerX;
      } );

      const labelColumnAlignGroup = new AlignGroup();
      const barColumnsAlignGroup = new AlignGroup( { matchVertical: false } );

      // Column labels
      const columnLabelOptions = {
        font: LABEL_FONT,
        maxWidth: 120 // determined empirically
      };
      const columnLabels = new HBox( {
        spacing: COLUMNS_SPACING,
        children: [
          new AlignBox( new Text( '', columnLabelOptions ), { group: barColumnsAlignGroup } ),
          new AlignBox( new Text( furString, columnLabelOptions ), { group: barColumnsAlignGroup } ),
          new AlignBox( new Text( earsString, columnLabelOptions ), { group: barColumnsAlignGroup } ),
          new AlignBox( new Text( teethString, columnLabelOptions ), { group: barColumnsAlignGroup } )
        ]
      } );

      // Rows
      const startRow = new ProportionsGraphRow( startOfGenerationString, proportionsModel.startCountProperty,
        labelColumnAlignGroup, barColumnsAlignGroup, proportionsModel.valuesVisibleProperty );
      const currentRow = new ProportionsGraphRow( endOfGenerationString, proportionsModel.endCountProperty,
        labelColumnAlignGroup, barColumnsAlignGroup, proportionsModel.valuesVisibleProperty );
      const rows = new VBox( {
        spacing: 30,
        align: 'left',
        children: [ startRow, currentRow ]
      } );

      // Column labels above rows
      const graph = new VBox( {
        spacing: 20,
        align: 'left',
        children: [ columnLabels, rows ],
        centerX: backgroundNode.centerX,
        centerY: backgroundNode.centerY
      } );

      assert && assert( !options.children, 'ProportionGraphNode sets children' );
      options.children = [ backgroundNode, generationControl, graph ];

      super( options );
    }
  }

  /**
   * ProportionsGraphRow is a row in the Proportions graph.
   */
  class ProportionsGraphRow extends HBox {

    /**
     * @param {string} labelString
     * @param {Property.<number>} countProperty
     * @param {AlignGroup} valueAlignGroup
     * @param {AlignGroup} barColumnsAlignGroup
     * @param {Property.<boolean>} valuesVisibleProperty
     */
    constructor( labelString, countProperty, valueAlignGroup, barColumnsAlignGroup, valuesVisibleProperty ) {

      const labelNode = new Text( labelString, {
        font: LABEL_FONT,
        maxWidth: 120 // determined empirically
      } );

      // {{count}} bunnies
      const countNode = new Text( '', {
        font: VALUE_FONT,
        maxWidth: 120 // determined empirically
      } );

      const valueVBox = new VBox( {
        spacing: 2,
        align: 'left',
        children: [
          labelNode,
          countNode
        ]
      } );

      //TODO temporary Properties
      const furBarNode = new ProportionsBarNode( NaturalSelectionColors.FUR, new NumberProperty( 990 ), new NumberProperty( 1 ), valuesVisibleProperty );
      const earsBarNode = new ProportionsBarNode( NaturalSelectionColors.EARS, new NumberProperty( 40 ), new NumberProperty( 60 ), valuesVisibleProperty );
      const teethBarNode = new ProportionsBarNode( NaturalSelectionColors.TEETH, new NumberProperty( 100 ), new NumberProperty( 0 ), valuesVisibleProperty );

      super( {
        spacing: COLUMNS_SPACING,
        align: 'bottom', //TODO this looks lousy for ?stringTest=long
        children: [
          new AlignBox( valueVBox, { group: valueAlignGroup, xAlign: 'left' } ),
          new AlignBox( furBarNode, { group: barColumnsAlignGroup, xAlign: 'center' } ),
          new AlignBox( earsBarNode, { group: barColumnsAlignGroup, xAlign: 'center' } ),
          new AlignBox( teethBarNode, { group: barColumnsAlignGroup, xAlign: 'center' } )
        ]
      } );

      countProperty.link( count => {
        if ( count === 1 ) {
          countNode.text = oneBunnyString;
        }
        else {
          countNode.text = StringUtils.fillIn( countBunniesString, { count: count } );
        }
      } );
    }
  }

  return naturalSelection.register( 'ProportionsGraphNode', ProportionsGraphNode );
} );
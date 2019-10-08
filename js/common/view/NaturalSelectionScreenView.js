// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AddAMateButton = require( 'NATURAL_SELECTION/common/view/AddAMateButton' );
  const AddMutationPanel = require( 'NATURAL_SELECTION/common/view/AddMutationPanel' );
  const ClimateRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/ClimateRadioButtonGroup' );
  const GraphRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/GraphRadioButtonGroup' );
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const LimitedFoodCheckbox = require( 'NATURAL_SELECTION/common/view/LimitedFoodCheckbox' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionTimeControlNode = require( 'NATURAL_SELECTION/common/view/NaturalSelectionTimeControlNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PedigreeControlPanel = require( 'NATURAL_SELECTION/common/view/PedigreeControlPanel' );
  const PedigreeGraphNode = require( 'NATURAL_SELECTION/common/view/PedigreeGraphNode' );
  const PopulationControlPanel = require( 'NATURAL_SELECTION/common/view/PopulationControlPanel' );
  const PopulationGraphNode = require( 'NATURAL_SELECTION/common/view/PopulationGraphNode' );
  const ProportionControlPanel = require( 'NATURAL_SELECTION/common/view/ProportionControlPanel' );
  const ProportionGraphNode = require( 'NATURAL_SELECTION/common/view/ProportionGraphNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SelectionAgentsPanel = require( 'NATURAL_SELECTION/common/view/SelectionAgentsPanel' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const ViewportNode = require( 'NATURAL_SELECTION/common/view/ViewportNode' );

  class NaturalSelectionScreenView extends ScreenView {

    /**
     * @param {NaturalSelectionModel} model
     * @param {NaturalSelectionViewProperties} viewProperties
     * @param {{label:string, property:Property.<Boolean>}[]} traits
     * @param {{label:string, property:Property.<Boolean>}[]} alleles
     * @param {Tandem} tandem
     */
    constructor( model, viewProperties, traits, alleles, tandem ) {

      super( {
        tandem: tandem
      } );

      const viewportNode = new ViewportNode( model.climateProperty,
        0.75 * this.layoutBounds.width, 0.5 * this.layoutBounds.height, {
          left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      const limitedFoodCheckbox = new LimitedFoodCheckbox( model.limitFoodProperty, {
        left: viewportNode.left + NaturalSelectionConstants.VIEWPORT_NODE_X_MARGIN,
        top: viewportNode.top + NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const climateRadioButtonGroup = new ClimateRadioButtonGroup( model.climateProperty, {
        right: viewportNode.right - NaturalSelectionConstants.VIEWPORT_NODE_X_MARGIN,
        top: viewportNode.top + NaturalSelectionConstants.VIEWPORT_NODE_Y_MARGIN
      } );

      const addAMateButton = new AddAMateButton( {
        listener: () => {
          this.addAMateButton.visible = false;
          //TODO
        },
        centerX: viewportNode.centerX,
        bottom: viewportNode.bottom - 30 // determined empirically
      } );

      const rightOfWorldWidth = this.layoutBounds.width - viewportNode.width -
                                 ( 2 * NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN ) -
                                 NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const addMutationPanel = new AddMutationPanel( {
        fixedWidth: rightOfWorldWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        top: viewportNode.top
      } );

      const selectionAgentsPanel = new SelectionAgentsPanel( model.selectionAgents, {
        fixedWidth: rightOfWorldWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        bottom: viewportNode.bottom
      } );

      const graphWidth = 0.75 * viewportNode.width;
      const graphHeight = this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
                          viewportNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

      const leftOfGraphWidth = viewportNode.width - graphWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const populationGraphNode = new PopulationGraphNode( graphWidth, graphHeight, {
        right: viewportNode.right,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      } );

      const populationControlPanel = new PopulationControlPanel(
        viewProperties.populationTotalVisibleProperty,
        viewProperties.populationValuesMarkerVisibleProperty,
        traits, {
          fixedWidth: leftOfGraphWidth,
          maxHeight: graphHeight,
          right: populationGraphNode.left - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          centerY: populationGraphNode.centerY
        } );

      const populationParent = new Node( {
        children: [ populationControlPanel, populationGraphNode ]
      } );

      const proportionGraphNode = new ProportionGraphNode( graphWidth, graphHeight, {
        right: viewportNode.right,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      } );

      const proportionControlPanel = new ProportionControlPanel(
        viewProperties.proportionValuesVisibleProperty,
        traits, {
          fixedWidth: leftOfGraphWidth,
          maxHeight: graphHeight,
          right: proportionGraphNode.left - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          centerY: proportionGraphNode.centerY
        } );

      const proportionParent = new Node( {
        children: [ proportionControlPanel, proportionGraphNode ]
      } );

      const pedigreeGraphNode = new PedigreeGraphNode( graphWidth, graphHeight, {
        right: viewportNode.right,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      } );

      const pedigreeControlPanel = new PedigreeControlPanel(
        alleles, {
          fixedWidth: leftOfGraphWidth,
          maxHeight: graphHeight,
          right: pedigreeGraphNode.left - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
          centerY: pedigreeGraphNode.centerY
        } );

      const pedigreeParent = new Node( {
        children: [ pedigreeControlPanel, pedigreeGraphNode ]
      } );

      const graphRadioButtonGroup = new GraphRadioButtonGroup( viewProperties.graphProperty, {
        maxWidth: rightOfWorldWidth,
        left: populationGraphNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        centerY: populationGraphNode.centerY
      } );

      const timeControlNode = new NaturalSelectionTimeControlNode( model.isPlayingProperty, {
        left: proportionGraphNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN
      } );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          this.interruptSubtreeInput();
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.right - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );

      // layering
      this.children = [
        viewportNode,
        limitedFoodCheckbox,
        climateRadioButtonGroup,
        addAMateButton,
        addMutationPanel,
        selectionAgentsPanel,
        timeControlNode,
        populationParent,
        proportionParent,
        pedigreeParent,
        graphRadioButtonGroup,
        resetAllButton
      ];

      // @private
      this.addAMateButton = addAMateButton;

      viewProperties.graphProperty.link( graph => {
        populationParent.visible = ( graph === Graphs.POPULATION );
        proportionParent.visible = ( graph === Graphs.PROPORTION );
        pedigreeParent.visible = ( graph === Graphs.PEDIGREE );
      } );
    }

    /**
     * @public
     */
    reset() {
      this.addAMateButton.visible = true;
      //TODO
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }
  }

  return naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
} );
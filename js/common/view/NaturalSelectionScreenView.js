// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AddMutationsPanel = require( 'NATURAL_SELECTION/common/view/AddMutationsPanel' );
  // const DiedDialog = require( 'NATURAL_SELECTION/common/view/DiedDialog' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const EnvironmentalFactorsPanel = require( 'NATURAL_SELECTION/common/view/EnvironmentalFactorsPanel' );
  const GraphRadioButtonGroup = require( 'NATURAL_SELECTION/common/view/GraphRadioButtonGroup' );
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const MutationAlertsNode = require( 'NATURAL_SELECTION/common/view/MutationAlertsNode' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const PedigreeNode = require( 'NATURAL_SELECTION/common/view/pedigree/PedigreeNode' );
  const PopulationNode = require( 'NATURAL_SELECTION/common/view/population/PopulationNode' );
  const ProportionsNode = require( 'NATURAL_SELECTION/common/view/proportions/ProportionsNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );
  const ViewportNode = require( 'NATURAL_SELECTION/common/view/ViewportNode' );
  // const WorldDialog = require( 'NATURAL_SELECTION/common/view/WorldDialog' );

  class NaturalSelectionScreenView extends ScreenView {

    /**
     * @param {NaturalSelectionModel} model
     * @param {NaturalSelectionViewProperties} viewProperties
     * @param {Tandem} tandem
     */
    constructor( model, viewProperties, tandem ) {

      super( {
        tandem: tandem
      } );

      //TODO
      // Dialogs, displayed when the 'game' ends because bunnies have taken over the world, or all bunnies have died.
      // const diedDialog = new DiedDialog();
      // const worldDialog = new WorldDialog();

      const viewportNode = new ViewportNode( model, {
        left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'viewportNode' )
      } );

      // Available width to the right of viewportNode, used to size control panels
      const rightOfViewportWidth = this.layoutBounds.width - viewportNode.width -
                                   ( 2 * NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN ) -
                                   NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

      const addMutationsPanel = new AddMutationsPanel( {
        fixedWidth: rightOfViewportWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        top: viewportNode.top
      } );

      const mutationAlertsNode = new MutationAlertsNode( addMutationsPanel );

      const environmentalFactorsPanel = new EnvironmentalFactorsPanel(
        model.wolves.enabledProperty, model.toughFood.enabledProperty, model.limitedFood.enabledProperty, {
          fixedWidth: rightOfViewportWidth,
          left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
          top: addMutationsPanel.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
        } );

      // The graphs and their related controls fill the space below the viewport.
      const graphAreaSize = new Dimension2(
        viewportNode.width,
        this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
        viewportNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      );

      // Options common to the Population, Proportions, and Pedigree views
      const viewOptions = {
        left: viewportNode.left,
        top: viewportNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
      };

      const populationNode = new PopulationNode( model.populationModel, graphAreaSize, viewOptions );
      const proportionsNode = new ProportionsNode( model.proportionsModel, graphAreaSize, viewOptions );
      const pedigreeNode = new PedigreeNode( model.pedigreeModel, graphAreaSize, viewOptions );

      const graphRadioButtonGroup = new GraphRadioButtonGroup( viewProperties.graphProperty, {
        maxWidth: rightOfViewportWidth,
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
        centerY: populationNode.centerY
      } );

      viewProperties.graphProperty.link( graph => {
        populationNode.visible = ( graph === Graphs.POPULATION );
        proportionsNode.visible = ( graph === Graphs.PROPORTIONS );
        pedigreeNode.visible = ( graph === Graphs.PEDIGREE );
      } );

      const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
        stepOptions: {
          listener: () => model.stepOnce( NaturalSelectionConstants.SECONDS_PER_STEP )
        },
        left: viewportNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
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
        addMutationsPanel,
        environmentalFactorsPanel,
        graphRadioButtonGroup,
        timeControlNode,
        populationNode,
        proportionsNode,
        pedigreeNode,
        resetAllButton,
        mutationAlertsNode
      ];

      // @private
      this.resetNaturalSelectionScreenView = () => {
        viewportNode.reset();
        addMutationsPanel.reset();
        mutationAlertsNode.reset();
        populationNode.reset();
        //TODO
      };
    }

    /**
     * @public
     */
    reset() {
      this.resetNaturalSelectionScreenView();
    }

    /**
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      //TODO
    }

    /**
     * Cancels a scheduled mutation.
     * @private
     */
    cancelMutation() {
      //TODO
    }
  }

  return naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
} );
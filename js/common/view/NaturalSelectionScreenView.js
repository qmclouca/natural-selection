// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionScreenView is the base class for all ScreenViews in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionModel from '../model/NaturalSelectionModel.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import AddAMateButton from './AddAMateButton.js';
import AddMutationsPanel from './AddMutationsPanel.js';
import DiedDialog from './DiedDialog.js';
import EnvironmentalFactorsPanel from './EnvironmentalFactorsPanel.js';
import EnvironmentNode from './EnvironmentNode.js';
import Graphs from './Graphs.js';
import GraphsRadioButtonGroup from './GraphsRadioButtonGroup.js';
import MutationAlertsNode from './MutationAlertsNode.js';
import NaturalSelectionViewProperties from './NaturalSelectionViewProperties.js';
import PedigreeNode from './pedigree/PedigreeNode.js';
import PlayAgainButton from './PlayAgainButton.js';
import PlayButton from './PlayButton.js';
import PopulationNode from './population/PopulationNode.js';
import ProportionsNode from './proportions/ProportionsNode.js';
import WorldDialog from './WorldDialog.js';

class NaturalSelectionScreenView extends ScreenView {

  /**
   * @param {NaturalSelectionModel} model
   * @param {NaturalSelectionViewProperties} viewProperties
   * @param {Object} [options]
   */
  constructor( model, viewProperties, options ) {

    assert && assert( model instanceof NaturalSelectionModel, 'invalid model' );
    assert && assert( viewProperties instanceof NaturalSelectionViewProperties, 'invalid viewProperties' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    const environmentNode = new EnvironmentNode( model.environmentModel, {
      left: this.layoutBounds.left + NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'environmentNode' )
    } );

    // Available width to the right of environmentNode, used to size control panels
    const rightOfViewportWidth = this.layoutBounds.width - environmentNode.width -
                                 ( 2 * NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN ) -
                                 NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

    const addMutationsPanel = new AddMutationsPanel( {
      fixedWidth: rightOfViewportWidth,
      tandem: options.tandem.createTandem( 'addMutationsPanel' )
    } );

    const environmentalFactorsPanel = new EnvironmentalFactorsPanel( model.environmentModel, {
      fixedWidth: rightOfViewportWidth,
      tandem: options.tandem.createTandem( 'environmentalFactorsPanel' )
    } );

    const panelsParent = new VBox( {
      children: [ addMutationsPanel, environmentalFactorsPanel ],
      spacing: NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      left: environmentNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      top: environmentNode.top
    } );

    const mutationAlertsNode = new MutationAlertsNode( addMutationsPanel );

    // The graphs and their related controls fill the space below the viewport.
    const graphAreaSize = new Dimension2(
      environmentNode.width,
      this.layoutBounds.height - ( 2 * NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN ) -
      environmentNode.height - NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING
    );
    const graphAreaLeft = environmentNode.left;
    const graphAreaTop = environmentNode.bottom + NaturalSelectionConstants.SCREEN_VIEW_Y_SPACING;

    // Population
    const populationNode = new PopulationNode( model.populationModel, graphAreaSize, {
      left: graphAreaLeft,
      y: graphAreaTop,
      tandem: options.tandem.createTandem( 'populationNode' )
    } );

    // Proportions
    const proportionsNode = new ProportionsNode( model.proportionsModel, graphAreaSize, {
      left: graphAreaLeft,
      top: graphAreaTop,
      tandem: options.tandem.createTandem( 'proportionsNode' )
    } );

    // Pedigree
    const pedigreeNode = new PedigreeNode( model.pedigreeModel, graphAreaSize, {
      left: graphAreaLeft,
      top: graphAreaTop,
      tandem: options.tandem.createTandem( 'pedigreeNode' )
    } );

    // Population, Proportions, Pedigree radio buttons
    const graphsRadioButtonGroup = new GraphsRadioButtonGroup( viewProperties.graphProperty, {
      maxWidth: rightOfViewportWidth,
      left: environmentNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      centerY: populationNode.centerY,
      tandem: options.tandem.createTandem( 'graphsRadioButtonGroup' )
    } );

    // Visibility of graphs is mutually exclusive
    viewProperties.graphProperty.link( graph => {
      populationNode.visible = ( graph === Graphs.POPULATION );
      proportionsNode.visible = ( graph === Graphs.PROPORTIONS );
      pedigreeNode.visible = ( graph === Graphs.PEDIGREE );
    } );

    // Play/pause/step time controls
    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {

          //TODO Should this step such that generationClock.timeProperty.value is a multiple of SECONDS_PER_STEP?
          listener: () => model.stepOnce( NaturalSelectionConstants.SECONDS_PER_STEP )
        }
      },
      left: environmentNode.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'timeControlNode' )
    } );

    // Reset All push button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that are in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.right - NaturalSelectionConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.bottom - NaturalSelectionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    const playButtonGroupTandem = options.tandem.createTandem( 'playButtonGroup' );

    // 'Add a Mate' push button, for when the initial population consists of a single bunny
    const addAMateButton = new AddAMateButton( {
      listener: () => {
        addAMateButton.visible = false;
        model.environmentModel.addAMate();
      },
      visible: ( model.environmentModel.bunnyGroup.numberOfBunniesProperty.value === 1 ),
      tandem: playButtonGroupTandem.createTandem( 'addAMateButton' )
    } );

    // 'Play' push button, for when the initial population consists of more than one bunny
    const playButton = new PlayButton( {
      listener: () => {
        playButton.visible = false;
        model.environmentModel.generationClock.isRunningProperty.value = true;
      },
      visible: ( model.environmentModel.bunnyGroup.numberOfBunniesProperty.value > 1 ),
      center: addAMateButton.center,
      tandem: playButtonGroupTandem.createTandem( 'playButton' )
    } );

    // 'Play Again' push button, displayed after the game ends, while the user is reviewing the final state
    const playAgainButton = new PlayAgainButton( {
      listener: () => {
        model.reset();

        // set state of buttons
        playAgainButton.visible = false;
        addAMateButton.visible = ( model.environmentModel.bunnyGroup.numberOfBunniesProperty.value === 1 );
        playButton.visible = ( model.environmentModel.bunnyGroup.numberOfBunniesProperty.value > 1 );

        // enable things that were disabled when the 'game' ended
        addMutationsPanel.setContentEnabled( true );
        environmentalFactorsPanel.setContentEnabled( true );
        timeControlNode.enabledProperty.value = true;
      },
      visible: false,
      center: addAMateButton.center,
      tandem: playButtonGroupTandem.createTandem( 'playAgainButton' )
    } );

    // Parent for the 3 buttons that are related to playing the 'game'
    const playButtonGroup = new Node( {
      children: [ addAMateButton, playButton, playAgainButton ],
      centerX: environmentNode.centerX,
      bottom: environmentNode.bottom - NaturalSelectionConstants.ENVIRONMENT_DISPLAY_Y_MARGIN,
      tandem: playButtonGroupTandem
    } );

    // layering
    this.children = [
      environmentNode,
      playButtonGroup,
      panelsParent,
      graphsRadioButtonGroup,
      timeControlNode,
      populationNode,
      proportionsNode,
      pedigreeNode,
      resetAllButton,
      mutationAlertsNode
    ];

    // @private
    this.resetNaturalSelectionScreenView = () => {
      environmentNode.reset();
      addMutationsPanel.reset();
      mutationAlertsNode.reset();
      populationNode.reset();
      //TODO
    };

    // Dialogs, displayed when the 'game' ends because bunnies have taken over the world, or all bunnies have died.
    const dialogOptions = {

      // When the dialog is shown...
      showCallback: () => {
        model.isPlayingProperty.value = false;
        addMutationsPanel.setContentEnabled( false );
        environmentalFactorsPanel.setContentEnabled( false );
        timeControlNode.enabledProperty.value = false;
      },

      // When the dialog is hidden...
      hideCallback: () => {
        playAgainButton.visible = true;
      }
    };
    const diedDialog = new DiedDialog( dialogOptions );
    const worldDialog = new WorldDialog( dialogOptions );

    model.environmentModel.bunnyGroup.allBunniesHaveDiedEmitter.addListener( () => {
      diedDialog.show();
    } );
    model.environmentModel.bunnyGroup.bunniesHaveTakenOverTheWorldEmitter.addListener( () => {
      worldDialog.show();
    } );

    // @private
    this.model = model;
    this.environmentNode = environmentNode;
  }

  /**
   * @public
   */
  reset() {
    this.resetNaturalSelectionScreenView();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'NaturalSelectionScreenView does not support dispose' );
  }

  /**
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    if ( this.model.isPlayingProperty.value ) {
      this.environmentNode.step( dt );
    }
  }
}

naturalSelection.register( 'NaturalSelectionScreenView', NaturalSelectionScreenView );
export default NaturalSelectionScreenView;
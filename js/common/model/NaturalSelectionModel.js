// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCollection from './BunnyCollection.js';
import Environment from './Environment.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Food from './Food.js';
import GenePool from './GenePool.js';
import GenerationClock from './GenerationClock.js';
import parseInitialPopulation from './parseInitialPopulation.js';
import PedigreeModel from './PedigreeModel.js';
import PopulationModel from './PopulationModel.js';
import ProportionsModel from './ProportionsModel.js';
import SimulationMode from './SimulationMode.js';
import Wolves from './Wolves.js';

class NaturalSelectionModel {

  /**
   * @param {string} mutationsQueryParameterName
   * @param {string} populationQueryParameterName
   * @param {Object} [options]
   */
  constructor( mutationsQueryParameterName, populationQueryParameterName, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public the transform between 3D model coordinates and 2D view coordinates
    this.modelViewTransform = new EnvironmentModelViewTransform();

    // @public see SimulationMode
    this.simulationModeProperty = new EnumerationProperty( SimulationMode, SimulationMode.STAGED, {
      tandem: options.tandem.createTandem( 'simulationModeProperty' ),
      phetioDocumentation: 'for internal PhET use only', // see https://github.com/phetsims/phet-io/issues/1660
      phetioReadOnly: true
    } );

    // @public whether the sim is playing
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: 'whether time is advancing in the simulation, controlled by the Play/Pause buttons'
    } );

    // @public (read-only)
    this.generationClock = new GenerationClock( {
      tandem: options.tandem.createTandem( 'generationClock' )
    } );

    // @pubic (read-only) pool of genes for the bunny population
    this.genePool = new GenePool( {
      tandem: options.tandem.createTandem( 'genePool' )
    } );

    // @private {BunnyVariety[]} describes the initial population
    this.initialBunnyVarieties =
      parseInitialPopulation( this.genePool, mutationsQueryParameterName, populationQueryParameterName );

    // @public (read-only) the collection of Bunny instances
    this.bunnyCollection = new BunnyCollection( this.modelViewTransform, this.genePool, {
      tandem: options.tandem.createTandem( 'bunnyCollection' )
    } );
    this.initializeGenerationZero();

    // @public
    this.environmentProperty = new EnumerationProperty( Environment, Environment.EQUATOR, {
      tandem: options.tandem.createTandem( 'environmentProperty' )
    } );

    // @public (read-only)
    this.wolves = new Wolves( this.modelViewTransform, {
      tandem: options.tandem.createTandem( 'wolves' )
    } );

    // @public (read-only)
    this.food = new Food( this.modelViewTransform, {
      tandem: options.tandem.createTandem( 'food' )
    } );

    // @public whether any environmental factor is enabled
    this.environmentalFactorEnabledProperty = new DerivedProperty(
      [ this.wolves.enabledProperty, this.food.isToughProperty, this.food.isLimitedProperty ],
      ( wolvesEnabled, isTough, isLimited ) => ( wolvesEnabled || isTough || isLimited )
    );

    // @public (read-only)
    this.populationModel = new PopulationModel( this.genePool, this.generationClock.generationsProperty,
      this.isPlayingProperty, {
        tandem: options.tandem.createTandem( 'populationModel' )
      } );

    // @public (read-only)
    this.proportionsModel = new ProportionsModel( this.genePool, this.generationClock.currentGenerationProperty,
      this.isPlayingProperty, this.simulationModeProperty, {
        tandem: options.tandem.createTandem( 'proportionsModel' )
      } );

    // @public (read-only)
    this.pedigreeModel = new PedigreeModel( {
      tandem: options.tandem.createTandem( 'pedigreeModel' )
    } );

    // When the simulation state changes...
    this.simulationModeProperty.link( simulationMode => {
      phet.log && phet.log( `simulationMode=${simulationMode}` );

      //TODO skip if isSettingPhetioStateProperty ?
      if ( simulationMode === SimulationMode.ACTIVE ) {

        // When the simulation begins, record the first 'start of generation' data for the Proportions graph.
        const currentGeneration = this.generationClock.currentGenerationProperty.value;
        this.proportionsModel.recordStartData( currentGeneration, this.bunnyCollection.createCountsSnapshot()
        );
      }

      // SimulationMode indicates which mode the simulation is in. It does not describe a full state of that mode.
      // Do nothing when PhET-iO is restoring state, or saved state will be overwritten.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

        // Adjust the sim playback and generation clock
        if ( simulationMode === SimulationMode.STAGED ) {
          this.isPlayingProperty.value = true;
          this.generationClock.isRunningProperty.value = false;
        }
        else if ( simulationMode === SimulationMode.ACTIVE ) {
          this.generationClock.isRunningProperty.value = true;
        }
        else if ( simulationMode === SimulationMode.COMPLETED ) {
          this.isPlayingProperty.value = false;
          this.generationClock.isRunningProperty.value = false;
        }
        else {
          throw new Error( `unsupported simulationMode: ${simulationMode}` );
        }
      }
    } );

    // When the generation changes...
    this.generationClock.currentGenerationProperty.lazyLink( currentGeneration => {

      if ( currentGeneration !== 0 ) {

        // Record 'end of generation' data for the previous generation.
        //TODO disable if isSettingPhetioStateProperty?
        this.proportionsModel.recordEndData( currentGeneration - 1, this.bunnyCollection.createCountsSnapshot() );

        // When restoring PhET-iO state, don't step the generation, as downstream elements of that call are already stateful.
        if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
          this.bunnyCollection.stepGeneration( currentGeneration );
        }

        // Record 'start of generation' data for the current generation.
        //TODO skip if isSettingPhetioStateProperty?
        this.proportionsModel.recordStartData( currentGeneration, this.bunnyCollection.createCountsSnapshot() );
      }
    } );
  }

  /**
   * Resets the entire model.
   * @public
   */
  reset() {

    this.startOver();

    // environmental factors
    this.environmentProperty.reset();
    this.wolves.reset();
    this.food.reset();
  }

  /**
   * Similar to reset, but does not reset environmental factors or graphs.
   * @public
   */
  startOver() {

    this.simulationModeProperty.reset();
    this.isPlayingProperty.reset(); // see https://github.com/phetsims/natural-selection/issues/55
    this.generationClock.reset();

    this.genePool.reset();

    this.bunnyCollection.reset();
    this.initializeGenerationZero();

    this.populationModel.reset();
    this.proportionsModel.reset();
    this.pedigreeModel.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'NaturalSelectionModel does not support dispose' );
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   * @override
   */
  step( dt ) {
    if ( this.isPlayingProperty.value ) {
      this.stepOnce( dt );
    }
  }

  /**
   * Steps the model one time step. Used by the time controls Step button.
   * @param {number} dt - time step, in seconds
   * @public
   */
  stepOnce( dt ) {

    // step the generation clock
    this.generationClock.step( dt );

    // move the bunnies
    this.bunnyCollection.moveBunnies( dt );
  }

  /**
   * Adds a mate for a lone bunny.
   * @private
   */
  addAMate() {
    assert && assert( this.bunnyCollection.liveBunnies.length === 1, 'there should only be 1 live bunny' );
    assert && assert( this.generationClock.currentGenerationProperty.value === 0, 'unexpected generation' );

    this.bunnyCollection.createBunnyZero();
  }

  /**
   * Initializes the generation-zero bunny population.
   * @private
   */
  initializeGenerationZero() {

    phet.log && phet.log( 'EnvironmentModel.initializeGenerationZero' );
    assert && assert( this.bunnyCollection.liveBunnies.length === 0, 'bunnies already exist' );
    assert && assert( this.generationClock.currentGenerationProperty.value === 0, 'unexpected generation' );

    // For each {BunnyVariety} in the initial population, create bunnies of that variety.
    this.initialBunnyVarieties.forEach( variety => {
      phet.log && phet.log( `creating ${variety.count} bunnies with genotype '${variety.genotypeString}'` );
      for ( let i = 0; i < variety.count; i++ ) {
        this.bunnyCollection.createBunnyZero( {
          alleles: variety.alleles
        } );
      }
    } );
  }
}

naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
export default NaturalSelectionModel;
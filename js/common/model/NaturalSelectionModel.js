// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionModel is the base class model for all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import BunnyCollection from './BunnyCollection.js';
import BunnyIO from './BunnyIO.js';
import Environment from './Environment.js';
import EnvironmentModelViewTransform from './EnvironmentModelViewTransform.js';
import Food from './Food.js';
import GenePool from './GenePool.js';
import GenerationClock from './GenerationClock.js';
import PedigreeModel from './PedigreeModel.js';
import PopulationModel from './PopulationModel.js';
import ProportionsModel from './ProportionsModel.js';
import SimulationMode from './SimulationMode.js';
import Wolves from './Wolves.js';

class NaturalSelectionModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      initialMutations: '', // value of the ?mutations query parameter
      initialPopulation: [ '1' ], // value of the ?population query parameter

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @private
    this.initialPopulation = options.initialPopulation;
    this.initialMutations = options.initialMutations;

    // @public
    this.modelViewTransform = new EnvironmentModelViewTransform();

    // @public
    this.simulationModeProperty = new EnumerationProperty( SimulationMode, SimulationMode.STAGED, {
      tandem: options.tandem.createTandem( 'simulationModeProperty' ),
      phetioDocumentation: 'for internal PhET use only',
      phetioReadOnly: true
    } );

    // @public whether the sim is playing
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' )
    } );

    // @public (read-only)
    this.generationClock = new GenerationClock( {
      tandem: options.tandem.createTandem( 'generationClock' )
    } );

    // @pubic (read-only) pool of genes for the bunny population
    this.genePool = new GenePool( {
      tandem: options.tandem.createTandem( 'genePool' )
    } );

    // @public (read-only) the collection of Bunny instances
    this.bunnyCollection = new BunnyCollection( this.modelViewTransform, this.genePool, {
      tandem: options.tandem.createTandem( 'bunnyCollection' )
    } );
    this.initializeGenerationZero();

    // @public {Property.<Bunny|null>} a reference to a Bunny instance in BunnyCollection, null if no selection
    this.selectedBunnyProperty = new Property( null, {
      tandem: options.tandem.createTandem( 'selectedBunnyProperty' ),
      phetioType: PropertyIO( NullableIO( ReferenceIO( BunnyIO ) ) ),
      phetioDocumentation: 'bunny selected in environmentNode, whose pedigree is displayed by pedigreeNode'
    } );
    phet.log && this.selectedBunnyProperty.link( selectedBunny => {
      phet.log( `selectedBunny=${selectedBunny}` );
    } );

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
    this.populationModel = new PopulationModel( this.genePool, this.generationClock.generationsProperty, this.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'populationModel' )
    } );

    // @public (read-only)
    this.proportionsModel = new ProportionsModel( this.genePool, this.generationClock.currentGenerationProperty, this.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'proportionsModel' )
    } );

    // @public (read-only)
    this.pedigreeModel = new PedigreeModel( {
      tandem: options.tandem.createTandem( 'pedigreeModel' )
    } );

    // When the generation changes...
    this.generationClock.currentGenerationProperty.lazyLink( currentGeneration => {
      if ( currentGeneration !== 0 ) {
        this.bunnyCollection.stepGeneration( currentGeneration );
      }
    } );

    // When the simulation state changes, adjust the model.
    this.simulationModeProperty.link( simulationMode => {
      phet.log && phet.log( `simulationMode=${simulationMode}` );

      // SimulationMode indicates which mode the simulation is in. It does not describe a full state of that mode.
      // Do nothing when PhET-iO is restoring state, or saved state will be overwritten.
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
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

    // graph models
    this.populationModel.reset();
    this.proportionsModel.reset();
    this.pedigreeModel.reset();
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
    this.selectedBunnyProperty.reset();
    this.bunnyCollection.reset();
    this.initializeGenerationZero();
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

  //TODO #9, detect errors when assertions are disabled, display error dialog, fallback?
  //TODO #9, can we do the parsing once, then keep a description that is used to initialize and reset?
  /**
   * Initializes the generation-zero bunny population. This relies on the value of query parameters that were used to
   * set this.initialMutations and this.initialPopulation. Those query parameters are specified using untranslated
   * (English) strings, per https://github.com/phetsims/natural-selection/issues/9.
   * @private
   */
  initializeGenerationZero() {

    phet.log && phet.log( 'EnvironmentModel.initializeGenerationZero' );
    assert && assert( this.bunnyCollection.liveBunnies.length === 0, 'bunnies already exist' );
    assert && assert( this.generationClock.currentGenerationProperty.value === 0, 'unexpected generation' );

    if ( this.initialMutations.length === 0 ) {

      // If there are no mutations, then population must be a positive integer
      const countString = this.initialPopulation[ 0 ];
      assert && assert( !isNaN( countString ), `population must be a number: ${countString}` );
      const count = parseFloat( countString );
      assert && assert( Utils.isInteger( count ) && count > 0, `population must be a positive integer: ${count}` );

      // Create a set of bunnies with no mutations.
      for ( let i = 0; i < count; i++ ) {
        this.bunnyCollection.createBunnyZero();
      }
    }
    else {

      // Split mutations into individual characters, e.g. 'FeT' -> [ 'F', 'e', 'T' ]
      const mutationChars = this.initialMutations.split( '' );

      // Compile a list of all allele abbreviations
      const alleleAbbreviations = [];

      const genes = this.genePool.genes;
      genes.forEach( gene => {

        const dominantAbbreviation = gene.dominantAbbreviationEnglish;
        const recessiveAbbreviation = gene.recessiveAbbreviationEnglish;
        alleleAbbreviations.push( dominantAbbreviation );
        alleleAbbreviations.push( recessiveAbbreviation );

        // Dominant and recessive abbreviations for the same gene are mutually exclusive
        assert && assert( !( mutationChars.indexOf( dominantAbbreviation ) !== -1 && mutationChars.indexOf( recessiveAbbreviation ) !== -1 ),
          `${dominantAbbreviation} and ${recessiveAbbreviation} are mutually exclusive: ${this.initialMutations}` );

        // If one of the abbreviations is specified, then make the mutant gene dominant or recessive
        if ( mutationChars.indexOf( dominantAbbreviation ) !== -1 ) {
          gene.dominantAlleleProperty.value = gene.mutantAllele;
        }
        else if ( mutationChars.indexOf( recessiveAbbreviation ) !== -1 ) {
          gene.dominantAlleleProperty.value = gene.normalAllele;
        }
      } );

      // Check for non-allele characters
      assert && assert( _.every( mutationChars, char => alleleAbbreviations.indexOf( char ) !== -1 ),
        `invalid character in mutations: ${this.initialMutations}` );

      // The total number of bunnies to be created
      let totalCount = 0;

      // The population is described as expressions that indicate the number of bunnies per genotype, e.g. '35:FeT'.
      assert && assert( this.initialPopulation.length > 0, 'at least 1 population expression is required' );
      for ( let i = 0; i < this.initialPopulation.length; i++ ) {

        // Get an entry from the array, e.g. '35:FFeEtt'
        const expression = this.initialPopulation[ i ];

        // Split into 2 tokens (count and genotype) based on the ':' separator, e.g. '35:FFeEtt' -> '35' and 'FFeEtt'
        const tokens = expression.split( /[\s:]+/ );
        assert && assert( tokens.length === 2, `malformed population expression: ${expression}` );
        const countString = tokens[ 0 ];
        const genotype = tokens[ 1 ];

        // Count must be a positive integer
        assert && assert( !isNaN( countString ), `${countString} is not a number` );
        const count = parseFloat( countString );
        assert && assert( Utils.isInteger( count ) && count > 0, `${count} must be a positive integer` );

        // Total of all counts must be < maximum population
        totalCount += count;
        assert && assert( totalCount < NaturalSelectionConstants.MAX_POPULATION,
          `total population must be < ${NaturalSelectionConstants.MAX_POPULATION}` );

        // Genotype must contain 2 alleles for each gene represented in mutations
        assert && assert( genotype.length === 2 * mutationChars.length, `invalid genotype: ${genotype}` );
        assert && genes.forEach( gene => {

          const dominantAbbreviation = gene.dominantAbbreviationEnglish;
          const recessiveAbbreviation = gene.recessiveAbbreviationEnglish;

          if ( mutationChars.indexOf( dominantAbbreviation ) !== -1 || mutationChars.indexOf( recessiveAbbreviation ) !== -1 ) {
            const countDominant = _.filter( genotype.split( '' ), char => char === dominantAbbreviation ).length;
            const countRecessive = _.filter( genotype.split( '' ), char => char === recessiveAbbreviation ).length;
            assert && assert( countDominant + countRecessive === 2, `invalid genotype: ${genotype}` );
          }
        } );

        // Create a set of bunnies with this genotype.
        for ( let i = 0; i < count; i++ ) {
          this.bunnyCollection.createBunnyZero( {
            //TODO #9 specify the Bunny's genotype
          } );
        }
      }

      assert && assert( totalCount > 0, 'total population must be > 0' );
    }
  }
}

naturalSelection.register( 'NaturalSelectionModel', NaturalSelectionModel );
export default NaturalSelectionModel;
// Copyright 2019-2020, University of Colorado Boulder

/**
 * DataProbe is the model for the data probe on the Population graph. It shows population (y-axis) values at a specific
 * generation (x-axis) value on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import naturalSelection from '../../naturalSelection.js';
import BunnyCounts from './BunnyCounts.js';
import BunnyCountsIO from './BunnyCountsIO.js';
import PopulationModel from './PopulationModel.js';

class DataProbe extends PhetioObject {

  /**
   * @param {PopulationModel} populationModel
   * @param {Object} [options]
   */
  constructor( populationModel, options ) {
    assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false // to prevent serialization, because we don't have an IO type
    }, options );

    super( options );

    // @private
    this.populationModel = populationModel;

    // @public the initial offset, as requested in https://github.com/phetsims/natural-selection/issues/173
    // While we only need x (generations) offset, DragListener requires a {Property.<Vector2>}, and y offset will
    // be constrained to 0.
    this.offsetProperty = new Vector2Property( new Vector2( 1.5, 0 ), {
      tandem: options.tandem.createTandem( 'offsetProperty' ),
      phetioDocumentation: 'offset of the data probe from the left edge of the graph'
    } );

    // @public
    this.generationProperty = new DerivedProperty(
      [ populationModel.xRangeProperty, this.offsetProperty ],
      ( xRange, offset ) => xRange.min + offset.x, {
        tandem: options.tandem.createTandem( 'generationProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'the generation (x-axis) value where the data probe is positioned'
      } );

    // @public Set BunnyCounts based on position of the data probe. dispose is not necessary.
    this.countsProperty = new DerivedProperty( [ this.generationProperty, populationModel.timeInGenerationsProperty ],
      ( generation, timeInGenerations ) => this.getCounts( generation, timeInGenerations ), {
        tandem: options.tandem.createTandem( 'countsProperty' ),
        phetioType: DerivedPropertyIO( NullableIO( BunnyCountsIO ) ),
        phetioDocumentation: 'counts displayed by the data probe'
      } );

    // @public visibility of the probe
    assert && assert( !this.visibleProperty, 'attempt to redefine visibleProperty' );
    this.visibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'visibleProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.offsetProperty.reset();
    this.visibleProperty.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  //TODO generation and generations is confusing! There are too many Properties in this sim with "generation" name.
  /**
   * Gets the bunny counts for a specific generation value.
   * @param {number} generation - current position of the data probe on the x axis
   * @param {number} timeInGenerations - current time on the generation clock, in generations
   * @returns {BunnyCounts|null}
   * @private
   */
  getCounts( generation, timeInGenerations ) {
    let counts = null;
    if ( generation <= timeInGenerations && timeInGenerations > 0 ) {
      counts = new BunnyCounts( {
        totalCount: this.getCount( generation, this.populationModel.totalPoints ),
        whiteFurCount: this.getCount( generation, this.populationModel.whiteFurPoints ),
        brownFurCount: this.getCount( generation, this.populationModel.brownFurPoints ),
        straightEarsCount: this.getCount( generation, this.populationModel.straightEarsPoints ),
        floppyEarsCount: this.getCount( generation, this.populationModel.floppyEarsPoints ),
        shortTeethCount: this.getCount( generation, this.populationModel.shortTeethPoints ),
        longTeethCount: this.getCount( generation, this.populationModel.longTeethPoints )
      } );
    }
    return counts;
  }

  /**
   * Gets the population count (y value) for a specific generation (x value).
   * @param {number} generation - current position of the data probe on the x axis
   * @param {ObservableArray.<Vector2>} points - data points, x (generation) and y (population)
   * @returns {number}
   * @private
   */
  getCount( generation, points ) {
    let count = 0;

    // Optimize for scrolling graph. Start with most recent points and work backwards in time.
    for ( let i = points.length - 1; i >=0; i-- ) {
      const point = points.get( i );
      if ( generation >= point.x ) {
        count = point.y;
        break;
      }
    }
    return count;
  }
}

naturalSelection.register( 'DataProbe', DataProbe );
export default DataProbe;
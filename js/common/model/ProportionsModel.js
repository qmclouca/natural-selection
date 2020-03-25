// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsModel is the sub-model used by the Proportion view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';

class ProportionsModel extends PhetioObject {

  /**
   * @param {Property.<number>} currentGenerationProperty
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Tandem} tandem
   */
  constructor( currentGenerationProperty, isPlayingProperty, tandem ) {

    assert && assert( currentGenerationProperty instanceof Property, 'invalid currentGenerationProperty' );
    assert && assert( isPlayingProperty instanceof Property, 'invalid isPlayingProperty' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {

      // phet-io
      tandem: tandem,
      phetioState: false, // to prevent serialization, because we don't have an IO type
      phetioDocumentation: 'portion of the model that deals with the Proportions graph'
    } );

    // @public
    this.currentGenerationProperty = currentGenerationProperty;

    // @public
    this.valuesVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' )
    } );

    // @public the generation that is displayed by the Proportions graph
    this.generationProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      tandem: tandem.createTandem( 'generationProperty' ),
      phetioStudioControl: false //TODO range is dynamic
    } );

    //TODO phet-io instrumentation
    //TODO these should be derived from other model state
    // @public
    this.startCountProperty = new NumberProperty( 1, {
      numberType: 'Integer'
    } );
    this.endCountProperty = new NumberProperty( 50, {
      numberType: 'Integer'
    } );

    // Pause the sim when a generation other than the current generation is being viewed.
    this.generationProperty.link( generation => {
      if ( generation !== currentGenerationProperty.value ) {
        isPlayingProperty.value = false;
      }
    } );

    // When the sim starts playing or the current generation changes, show the current generation immediately.
    Property.multilink(
      [ isPlayingProperty, currentGenerationProperty ],
      ( isPlaying, currentGeneration ) => {
        if ( isPlaying ) {
          this.generationProperty.value = currentGeneration;
        }
      }
    );
  }

  /**
   * @public
   */
  reset() {
    this.valuesVisibleProperty.reset();
    this.generationProperty.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ProportionsModel does not support dispose' );
  }
}

naturalSelection.register( 'ProportionsModel', ProportionsModel );
export default ProportionsModel;
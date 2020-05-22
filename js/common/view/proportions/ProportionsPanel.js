// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsPanel is the panel that contains controls for the 'Proportions' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import HSeparator from '../../../../../sun/js/HSeparator.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import GenePool from '../../model/GenePool.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';
import NaturalSelectionPanel from '../NaturalSelectionPanel.js';
import ProportionsLegendNode from './ProportionsLegendNode.js';

class ProportionsPanel extends NaturalSelectionPanel {

  /**
   * @param {GenePool} genePool
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Object} [options]
   */
  constructor( genePool, valuesVisibleProperty, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( valuesVisibleProperty, 'boolean' );

    options = merge( {
      fixedWidth: 100,
      xMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    const legendNode = new ProportionsLegendNode( genePool, {
      tandem: options.tandem.createTandem( 'legendNode' )
    } );

    const separator =  new HSeparator( options.fixedWidth - 2 * options.xMargin, {
      stroke: NaturalSelectionColors.SEPARATOR_STROKE,
      tandem: options.tandem.createTandem( 'separator' )
    } );

    const valuesCheckbox = new Checkbox(
      new Text( naturalSelectionStrings.values, {
        font: NaturalSelectionConstants.CHECKBOX_FONT,
        maxWidth: 100 // determined empirically
      } ),
      valuesVisibleProperty,
      merge( {
        tandem: options.tandem.createTandem( 'valuesCheckbox' )
      }, NaturalSelectionConstants.CHECKBOX_OPTIONS )
    );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [
        legendNode,
        separator,
        valuesCheckbox
      ]
    } ) );

    super( content, options );

    // @public for configuring ScreenViews only
    this.legendNode = legendNode;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ProportionsPanel does not support dispose' );
  }
}

naturalSelection.register( 'ProportionsPanel', ProportionsPanel );
export default ProportionsPanel;
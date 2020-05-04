// Copyright 2019-2020, University of Colorado Boulder

/**
 * PopulationPanel is the panel that contains controls for the 'Population' graph.
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
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionPanel from '../NaturalSelectionPanel.js';
import PopulationLegendCheckbox from './PopulationLegendCheckbox.js';

class PopulationPanel extends NaturalSelectionPanel {

  /**
   * @param {PopulationModel} populationModel
   * @param {Object} [options]
   */
  constructor( populationModel, options ) {

    assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );

    options = merge( {
      fixedWidth: 100,
      xMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    const furGene = populationModel.genePool.furGene;
    const earsGene = populationModel.genePool.earsGene;
    const teethGene = populationModel.genePool.teethGene;

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [

        // Total
        new PopulationLegendCheckbox( populationModel.totalVisibleProperty, naturalSelectionStrings.total, {
          color: NaturalSelectionColors.TOTAL_POPULATION,
          tandem: options.tandem.createTandem( 'totalCheckbox' )
        } ),

        // White Fur
        new PopulationLegendCheckbox( populationModel.whiteFurVisibleProperty, furGene.normalAllele.name, {
            color: furGene.color,
            tandem: options.tandem.createTandem( 'whiteFurCheckbox' )
          } ),

        // Brown Fur
        new PopulationLegendCheckbox( populationModel.brownFurVisibleProperty, furGene.mutantAllele.name, {
          color: furGene.color,
          isMutant: true,
          tandem: options.tandem.createTandem( 'brownFurCheckbox' )
        } ),

        // Straight Ears
        new PopulationLegendCheckbox( populationModel.straightEarsVisibleProperty, earsGene.normalAllele.name, {
          color: earsGene.color,
          tandem: options.tandem.createTandem( 'straightEarsCheckbox' )
        } ),

        // Floppy Ears
        new PopulationLegendCheckbox( populationModel.floppyEarsVisibleProperty, earsGene.mutantAllele.name, {
          color: earsGene.color,
          isMutant: true,
          tandem: options.tandem.createTandem( 'floppyEarsCheckbox' )
        } ),

        // Short Teeth
        new PopulationLegendCheckbox( populationModel.shortTeethVisibleProperty, teethGene.normalAllele.name, {
          color: teethGene.color,
          tandem: options.tandem.createTandem( 'shortTeethCheckbox' )
        } ),

        // Long Teeth
        new PopulationLegendCheckbox( populationModel.longTeethVisibleProperty, teethGene.mutantAllele.name, {
          color: teethGene.color,
          isMutant: true,
          tandem: options.tandem.createTandem( 'longTeethCheckbox' )
        } ),

        // ------
        new HSeparator( options.fixedWidth - 2 * options.xMargin, {
          stroke: NaturalSelectionColors.SEPARATOR_STROKE,
          tandem: options.tandem.createTandem( 'separator' )
        } ),

        // Data Probe
        new Checkbox(
          new Text( naturalSelectionStrings.dataProbe, {
            font: NaturalSelectionConstants.CHECKBOX_FONT,
            maxWidth: 135 // determined empirically
          } ),
          populationModel.dataProbe.visibleProperty,
          merge( {
            tandem: options.tandem.createTandem( 'dataProbeCheckbox' )
          }, NaturalSelectionConstants.CHECKBOX_OPTIONS )
        )
      ]
    } ) );

    super( content, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'PopulationPanel does not support dispose' );
  }
}

naturalSelection.register( 'PopulationPanel', PopulationPanel );
export default PopulationPanel;
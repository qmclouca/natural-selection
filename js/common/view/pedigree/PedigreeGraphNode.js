// Copyright 2019-2020, University of Colorado Boulder

/**
 * PedigreeGraphNode displays the pedigree for an individual.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import PedigreeModel from '../../model/PedigreeModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import PedigreeBranchNode from './PedigreeBranchNode.js';

// constants
const TREE_DEPTH = 4;
const SELECTED_BUNNY_SCALE = 0.35;

class PedigreeGraphNode extends Node {


  /**
   * @param {PedigreeModel} pedigreeModel
   * @param {Object} [options]
   */
  constructor( pedigreeModel, options ) {

    assert && assert( pedigreeModel instanceof PedigreeModel, 'invalid pedigreeModel' );

    options = merge( {
      graphWidth: 100,
      graphHeight: 100,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    }, options );

    const backgroundNode = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
      fill: NaturalSelectionColors.PEDIGREE_GRAPH_FILL,
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    const selectABunnyText = new Text( naturalSelectionStrings.selectABunny, {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT,
      centerX: backgroundNode.centerX,
      centerY: backgroundNode.top + ( backgroundNode.height / 6 )
    } );

    assert && assert( !options.children, 'PedigreeGraphNode sets children' );
    options.children = [ backgroundNode, selectABunnyText ];

    super( options );

    let branchNode = null;

    pedigreeModel.selectedBunnyProperty.link( bunny => {
      selectABunnyText.visible = !bunny;

      if ( branchNode ) {
        branchNode.dispose();
        branchNode = null;
      }

      if ( bunny ) {
        branchNode = new PedigreeBranchNode( bunny, TREE_DEPTH, {
          bunnyIsSelected: true,
          scale: SELECTED_BUNNY_SCALE,
          center: backgroundNode.center
        } );
        this.addChild( branchNode );
      }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'PedigreeGraphNode does not support dispose' );
  }
}

naturalSelection.register( 'PedigreeGraphNode', PedigreeGraphNode );
export default PedigreeGraphNode;
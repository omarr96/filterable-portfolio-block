<?php
/**
 * Plugin Name:       Df Filterable Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            Divi Flash
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       df-filterable-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Defines constent.
define( 'DF_FG_VERSION', '0.1.0' );
define( 'DF_FG_TEXT_DOMAIN', 'df-filterable-block' );
define( 'DF_FG_INC_PATH', plugin_dir_path( __FILE__ ) . '/includes' );
define( 'DF_FG_BUILD_DIR', plugin_dir_path( __FILE__ ) . '/build' );

require_once DF_FG_INC_PATH . '/init.php';

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_df_filterable_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_df_filterable_block_block_init' );
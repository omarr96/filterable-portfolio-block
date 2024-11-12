<?php
/**
 * Initialize files 
 *
 * @since   1.0.0
 * @package df-filterable-block
 */

/**
 * Initialize
 */
class DF_FG_Initialization { 

	public $currentPage = '';

	public function __construct() {
		$this->register_post_type();
	}

	public function register_post_type(){
		require_once DF_FG_INC_PATH . '/post-type/showcase.php';
		require_once DF_FG_INC_PATH . '/post-type/layout.php';
		require_once DF_FG_INC_PATH . '/post-type/module.php';
	}

}
new DF_FG_Initialization();
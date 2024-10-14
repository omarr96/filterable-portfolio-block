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

    /**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'post_type' ], 10 );
		add_action( 'init', [ $this, 'register_taxonomy' ] );
		// add_action( 'wp_enqueue_scripts', [ $this, 'scripts' ] );
		add_action('add_meta_boxes', [ $this, 'add_custom_url_meta_box' ] );
		add_action('save_post', [ $this, 'save_custom_url_meta_box' ] );
		add_action( 'init', [ $this, 'register_custom_url_meta' ] );
		add_action( 'wp_head', [ $this, 'add_noindex_to_post_type' ] );
	}

	/**
	 * Enqueue and register scripts
	 *
	 * Only the styles for front-end should load here
	 */
	// public function scripts() {
	// 	wp_enqueue_script( 'df_fb-frontend-scripts', plugin_dir_url( __DIR__ ) . 'build/view.js', array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'lodash' ), DF_FG_VERSION, true );
	// }

	/**
	 * Register Custom Post Type
	 *
	 */
	function post_type() {
        // // Labels for the Custom Post Type
        $labels = [
            'name'               => __('DF Filterable Projects', DF_FG_TEXT_DOMAIN),
            'singular_name'      => __('DF Filterable Project', DF_FG_TEXT_DOMAIN),
            'menu_name'          => __('DF Showcase', DF_FG_TEXT_DOMAIN),
            'name_admin_bar'     => __('DF Showcase', DF_FG_TEXT_DOMAIN),
            'add_new'            => __('Add New', DF_FG_TEXT_DOMAIN),
            'add_new_item'       => __('Add Project', DF_FG_TEXT_DOMAIN),
            'new_item'           => __('New Project', DF_FG_TEXT_DOMAIN),
            'edit_item'          => __('Edit Project', DF_FG_TEXT_DOMAIN),
            'view_item'          => __('View Project', DF_FG_TEXT_DOMAIN),
            'all_items'          => __('All Projects', DF_FG_TEXT_DOMAIN),
            'search_items'       => __('Search Project', DF_FG_TEXT_DOMAIN),
            'not_found'          => __('No Projects found.', DF_FG_TEXT_DOMAIN),
            'not_found_in_trash' => __('No Projects found in Trash.', DF_FG_TEXT_DOMAIN)
		];

		$args   = [
			'labels'                => $labels,
			'public'                => true,
			'show_ui'               => true,
			'menu_icon'             => 'dashicons-screenoptions',
			'publicly_queryable'    => false,
			'menu_position'         => 5,
			'supports'           	=> array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'comments'),
			'capability_type'    	=> 'post',
			'has_archive'           => true,
			'show_in_admin_bar'     => true,
			'show_in_nav_menus'     => true,
			'query_var'             => true,
			'rewrite'            	=> array('slug' => 'df-filterable-gallery'),
			'show_in_rest'          => true,  // For Gutenberg editor support
			'rest_controller_class' => 'WP_REST_Posts_Controller',
		];

		register_post_type( 'dffilterableblock', $args );
    }

	// register custom taxonomy
	public function register_taxonomy() {
		$labels = [
			'name'              => __('DF Filter Categories', 'taxonomy general name', DF_FG_TEXT_DOMAIN),
			'singular_name'     => __('DF Filter Category', 'taxonomy singular name', DF_FG_TEXT_DOMAIN),
			'search_items'      => __('Search DF Filter Categories', DF_FG_TEXT_DOMAIN),
			'all_items'         => __('All DF Filter Categories', DF_FG_TEXT_DOMAIN),
			'parent_item'       => __('Parent DF Filter Category', DF_FG_TEXT_DOMAIN),
			'parent_item_colon' => __('Parent DF Filter Category:', DF_FG_TEXT_DOMAIN),
			'edit_item'         => __('Edit DF Filter Category', DF_FG_TEXT_DOMAIN),
			'update_item'       => __('Update DF Filter Category', DF_FG_TEXT_DOMAIN),
			'add_new_item'      => __('Add New Category', DF_FG_TEXT_DOMAIN),
			'new_item_name'     => __('New DF Filter Category Name', DF_FG_TEXT_DOMAIN),
			'menu_name'         => __('Categories', DF_FG_TEXT_DOMAIN),
		];
	
		$args = [
			'hierarchical'      => true, // Like categories, can be set to false for tag-like behavior
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => ['slug' => 'df-filter-category'],
			'show_in_rest'      => true, // Enable for Gutenberg editor
		];
	
		// Register the custom taxonomy and associate it with the custom post type
		register_taxonomy('df_filter_category', ['dffilterableblock'], $args);
	}


	public function add_custom_url_meta_box() {
		add_meta_box(
			'custom_url_meta_box',            // Unique ID for the meta box
			__('Project URL', 'df-filterable-block'),   // Meta box title
			[$this, 'custom_url_meta_box_html'],   // Correct callback function name
			'dffilterableblock',              // Post type
			'side',                         // Location (normal, side, advanced)
			'high'                            // Priority (high, low)
		);
	}

	public function custom_url_meta_box_html($post) {
		$custom_url = get_post_meta($post->ID, 'df_fb_custom_url', true); // Get current URL value
		?>
		<label for="custom_url_field"><?php _e('Enter URL', 'df-filterable-block'); ?></label>
		<input type="text" id="custom_url_field" name="custom_url_field" value="<?php echo esc_attr($custom_url); ?>" size="25" />
		<?php
	}

	public function save_custom_url_meta_box($post_id) {
		if (array_key_exists('custom_url_field', $_POST)) {
			update_post_meta(
				$post_id,
				'df_fb_custom_url',
				sanitize_text_field($_POST['custom_url_field'])
			);
		}
	}

	function register_custom_url_meta() {
		register_post_meta( 'dffilterableblock', 'df_fb_custom_url', [
			'show_in_rest' => true, // Make it accessible in the REST API
			'type'         => 'string',
			'single'       => true,
			'sanitize_callback' => 'esc_url',
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
		]);
	}

	function add_noindex_to_post_type() {
		// Check if it's a single post of your custom post type
		if ( is_singular( 'dffilterableblock' ) ) {
			echo '<meta name="robots" content="noindex, nofollow" />' . "\n";
		}
	}

}
new DF_FG_Initialization();
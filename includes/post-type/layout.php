<?php

class Layout {

    public function __construct() {
		add_action( 'init', [ $this, 'post_type' ], 10 );
		add_action( 'init', [ $this, 'register_taxonomy' ] );
		add_action( 'add_meta_boxes', [ $this, 'add_custom_url_meta_box' ] );
		add_action( 'save_post', [ $this, 'save_custom_url_meta_box' ] );
		add_action( 'init', [ $this, 'register_custom_url_meta' ] );
	}

    /**
	 * Register Custom Post Type
	 *
	 */
	function post_type() {
        // // Labels for the Custom Post Type
        $labels = [
            'name'               => __('DF Filterable Layouts', DF_FG_TEXT_DOMAIN),
            'singular_name'      => __('DF Filterable Layout', DF_FG_TEXT_DOMAIN),
            'menu_name'          => __('DF Layout', DF_FG_TEXT_DOMAIN),
            'name_admin_bar'     => __('DF Layout', DF_FG_TEXT_DOMAIN),
            'add_new'            => __('Add New', DF_FG_TEXT_DOMAIN),
            'add_new_item'       => __('Add Layout', DF_FG_TEXT_DOMAIN),
            'new_item'           => __('New Layout', DF_FG_TEXT_DOMAIN),
            'edit_item'          => __('Edit Layout', DF_FG_TEXT_DOMAIN),
            'view_item'          => __('View Layout', DF_FG_TEXT_DOMAIN),
            'all_items'          => __('All Layouts', DF_FG_TEXT_DOMAIN),
            'search_items'       => __('Search Layout', DF_FG_TEXT_DOMAIN),
            'not_found'          => __('No Layouts found.', DF_FG_TEXT_DOMAIN),
            'not_found_in_trash' => __('No Layouts found in Trash.', DF_FG_TEXT_DOMAIN)
		];

		$args   = [
			'labels'                => $labels,
			'public'                => true,
			'show_ui'               => true,
			'menu_icon'             => 'dashicons-grid-view',
			'publicly_queryable'    => true,
			'menu_position'         => 5,
			'supports'           	=> array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'comments'),
			'capability_type'    	=> 'post',
			'has_archive'           => true,
			'show_in_admin_bar'     => true,
			'show_in_nav_menus'     => true,
			'query_var'             => true,
			'rewrite'            	=> array('slug' => 'df-filterable-layout'),
			'show_in_rest'          => true,  // For Gutenberg editor support
			'rest_base' 			=> 'dffilterablelayout', // Base path in the REST API
			'rest_controller_class' => 'WP_REST_Posts_Controller',
		];

		register_post_type( 'dffilterablelayout', $args );
    }

	// register custom taxonomy
	public function register_taxonomy() {
		$labels = [
			'name'              => __('DF Layout Categories', 'taxonomy general name', DF_FG_TEXT_DOMAIN),
			'singular_name'     => __('DF Layout Category', 'taxonomy singular name', DF_FG_TEXT_DOMAIN),
			'search_items'      => __('Search Layout Categories', DF_FG_TEXT_DOMAIN),
			'all_items'         => __('All Layout Categories', DF_FG_TEXT_DOMAIN),
			'parent_item'       => __('Parent Layout Category', DF_FG_TEXT_DOMAIN),
			'parent_item_colon' => __('Parent Layout Category:', DF_FG_TEXT_DOMAIN),
			'edit_item'         => __('Edit Layout Category', DF_FG_TEXT_DOMAIN),
			'update_item'       => __('Update Layout Category', DF_FG_TEXT_DOMAIN),
			'add_new_item'      => __('Add New Category', DF_FG_TEXT_DOMAIN),
			'new_item_name'     => __('New Layout Category Name', DF_FG_TEXT_DOMAIN),
			'menu_name'         => __('Categories', DF_FG_TEXT_DOMAIN),
		];
	
		$args = [
			'hierarchical'      => true, // Like categories, can be set to false for tag-like behavior
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => ['slug' => 'df-layout-category'],
			'public'            => true,
			'show_in_rest'      => true, // Enable for Gutenberg editor
		];
	
		// Register the custom taxonomy and associate it with the custom post type
		register_taxonomy('df_layout_category', ['dffilterablelayout'], $args);
	}


	public function add_custom_url_meta_box() {
        add_meta_box(
            'layout_preview_url_meta_box',            // Unique ID for the meta box
            __('Project URL', DF_FG_TEXT_DOMAIN),   // Meta box title
            [$this, 'layout_preview_url_meta_box_html'],   // Correct callback function name
            'dffilterablelayout',              // Post type
            'side',                         // Location (normal, side, advanced)
            'high'                            // Priority (high, low)
        );
    }
    
    public function layout_preview_url_meta_box_html($post) {
        // Get current URL values
        $preview_url = get_post_meta($post->ID, 'df_fb_preview_url', true); 
        $download_url = get_post_meta($post->ID, 'df_fb_download_url', true); 
        ?>
        <label for="preview_url_field"><?php _e('Enter Preview URL', DF_FG_TEXT_DOMAIN); ?></label>
        <input type="text" id="preview_url_field" name="preview_url_field" value="<?php echo esc_attr($preview_url); ?>" size="25" />
        <br><br>
        <label for="download_url_field"><?php _e('Enter Download URL', DF_FG_TEXT_DOMAIN); ?></label>
        <input type="text" id="download_url_field" name="download_url_field" value="<?php echo esc_attr($download_url); ?>" size="25" />
        <?php
    }
    
    public function save_custom_url_meta_box($post_id) {
        // Check if the preview URL field is set
        if (array_key_exists('preview_url_field', $_POST)) {
            update_post_meta(
                $post_id,
                'df_fb_preview_url',
                sanitize_text_field($_POST['preview_url_field'])
            );
        }
    
        // Check if the download URL field is set
        if (array_key_exists('download_url_field', $_POST)) {
            update_post_meta(
                $post_id,
                'df_fb_download_url',
                sanitize_text_field($_POST['download_url_field'])
            );
        }
    }
    
    function register_custom_url_meta() {
        // Register preview URL meta
        register_post_meta('dffilterablelayout', 'df_fb_preview_url', [
            'show_in_rest' => true, // Make it accessible in the REST API
            'type'         => 'string',
            'single'       => true,
            'sanitize_callback' => 'esc_url',
            'auth_callback' => '__return_true',
        ]);
    
        // Register download URL meta
        register_post_meta('dffilterablelayout', 'df_fb_download_url', [
            'show_in_rest' => true, // Make it accessible in the REST API
            'type'         => 'string',
            'single'       => true,
            'sanitize_callback' => 'esc_url',
            'auth_callback' => '__return_true',
        ]);
    }    
    
}
new Layout();
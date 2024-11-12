<?php

class Module {

    public $moduleParentID = '';

    public function __construct() {
        add_action( 'init', [ $this, 'register_taxonomy' ] );

        add_action( 'add_meta_boxes', [ $this, 'add_short_desc_meta_box' ] );
        add_action( 'save_post', [ $this, 'module_save_meta_box_data' ] );

        add_action( 'init', [ $this, 'register_custom_meta_fields' ] );
    }

    public function register_taxonomy() {
		$labels = [
			'name'              => __('DF Module Categories', 'taxonomy general name', DF_FG_TEXT_DOMAIN),
			'singular_name'     => __('DF Module Category', 'taxonomy singular name', DF_FG_TEXT_DOMAIN),
			'search_items'      => __('Search Module Categories', DF_FG_TEXT_DOMAIN),
			'all_items'         => __('All Module Categories', DF_FG_TEXT_DOMAIN),
			'parent_item'       => __('Parent Module Category', DF_FG_TEXT_DOMAIN),
			'parent_item_colon' => __('Parent Module Category:', DF_FG_TEXT_DOMAIN),
			'edit_item'         => __('Edit Module Category', DF_FG_TEXT_DOMAIN),
			'update_item'       => __('Update Module Category', DF_FG_TEXT_DOMAIN),
			'add_new_item'      => __('Add New Category', DF_FG_TEXT_DOMAIN),
			'new_item_name'     => __('New Module Category Name', DF_FG_TEXT_DOMAIN),
			'menu_name'         => __('Categories', DF_FG_TEXT_DOMAIN),
		];
	
		$args = [
			'hierarchical'      => true, // Like categories, can be set to false for tag-like behavior
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => ['slug' => 'difl-page-category'],
			'public'            => true,
			'show_in_rest'      => true, // Enable for Gutenberg editor
		];
	
		// Register the custom taxonomy and associate it with the custom post type
		register_taxonomy('difl_page_category', ['page'], $args);
	}

    public function add_short_desc_meta_box() {
        global $post;

        // Check if this page has the parent with ID (...)
        if ( $post->post_parent == 273145 ) {
            add_meta_box(
                'module_meta_box_id',             // ID of the meta box
                'Module Info',                      // Title of the meta box
                [$this, 'module_short_desc_callback'],    // Callback function to display the input field
                'page',                        // Post type (in this case, page)
                'side',                      // Context (where the box should appear)
                'default'                      // Priority
            );
        }
        
    }

    function module_short_desc_callback( $post ) {
        // Retrieve current meta value for short description
        $module_icon = get_post_meta( $post->ID, 'module_icon', true );
        $icon_alt_text = get_post_meta( $post->ID, 'icon_alt_text', true );
        $short_description = get_post_meta( $post->ID, 'module_short_description', true );
        $module_badge = get_post_meta($post->ID, 'module_badge_selection', true);

        $badge_types = [
            ''   => __('Default', DF_FG_TEXT_DOMAIN),
            'new'   => __('New', DF_FG_TEXT_DOMAIN),
            'popular'   => __('Popular', DF_FG_TEXT_DOMAIN),
            'upcoming'  => __('Upcoming', DF_FG_TEXT_DOMAIN),
        ];
        // Output the input field for the short description
        ?>
        <label for="module_icon" style="margin-bottom: 6px;display: inline-block;font-weight: 600;">Upload Icon</label>
        <input type="file" id="module_icon" name="module_icon" value="<?php echo esc_attr( $module_icon ); ?>" style="width:100%;" />
        <?php if($module_icon) {
            echo '<img src="'.$module_icon.'" width="80px" />';
        }?>
        <br>
        <label for="icon_alt_text" style="margin-bottom: 6px;display: inline-block;font-weight: 600;">Alt Text:</label>
        <input type="text" id="icon_alt_text" name="icon_alt_text" value="<?php echo esc_attr( $icon_alt_text ); ?>" style="width:100%;" />
        <br><br>
        <label for="short_description" style="margin-bottom: 6px;display: inline-block;font-weight: 600;">Short Description:</label>
        <input type="text" id="short_description" name="module_short_description" value="<?php echo esc_attr( $short_description ); ?>" style="width:100%;" />
        <br><br>
        <label for="short_description" style="margin-bottom: 6px;display: inline-block;font-weight: 600;">Select Bagde Type:</label><br>
        <?php 
            foreach ($badge_types as $value => $label){
                ?>
                    <div style="display: flex; align-items:center; padding: 4px 0px;">
                        <input type="radio" style="margin-top: 0.5px;" id="badge_type_<?php echo esc_attr($value); ?>" name="module_badge_selection" 
                            value="<?php echo esc_attr($value); ?>" <?php checked($module_badge, $value); ?> />
                        <label for="badge_type_<?php echo esc_attr($value); ?>"><?php echo esc_html($label); ?></label>
                    </div>
                <?php
            }
        ?>
        <?php
    }
    
    // Save the meta box data
    function module_save_meta_box_data( $post_id ) {
        // Check if the preview URL field is set
        if (array_key_exists('module_badge_selection', $_POST)) {
            update_post_meta(
                $post_id,
                'module_badge_selection',
                sanitize_text_field($_POST['module_badge_selection'])
            );
        }
    
        // Check if the download URL field is set
        if (array_key_exists('module_short_description', $_POST)) {
            update_post_meta(
                $post_id,
                'module_short_description',
                sanitize_text_field($_POST['module_short_description'])
            );
        }

        // Check if the icon_alt_text
        if (array_key_exists('icon_alt_text', $_POST)) {
            update_post_meta(
                $post_id,
                'icon_alt_text',
                sanitize_text_field($_POST['icon_alt_text'])
            );
        }

         // Handle the file upload for module_icon
        if ( ! empty( $_FILES['module_icon']['name'] ) ) {
            // Check for file upload errors
            if ( ! function_exists( 'wp_handle_upload' ) ) {
                require_once( ABSPATH . 'wp-admin/includes/file.php' );
            }

            // Define the overrides to not validate the form for uploads
            $upload_overrides = array( 'test_form' => false );

            // Handle the file upload
            $uploaded_file = wp_handle_upload( $_FILES['module_icon'], $upload_overrides );

            // Check for any upload error
            if ( isset( $uploaded_file['error'] ) ) {
                wp_die( 'Error uploading file: ' . $uploaded_file['error'] );
            } else {
                // Save the file URL in the post meta
                update_post_meta(
                    $post_id,
                    'module_icon',
                    esc_url( $uploaded_file['url'] ) // Save the file URL
                );
            }
        }
       
    }

    function register_custom_meta_fields() {
        register_post_meta( 'page', 'module_icon', array(
            'show_in_rest' => true,  // Enable REST API support
            'single' => true,        // Single meta value per post
            'type' => 'string',      // The type of the meta field
        ));

        register_post_meta( 'page', 'icon_alt_text', array(
            'show_in_rest' => true,  
            'single' => true,       
            'type' => 'string',  
        ));
    
        register_post_meta( 'page', 'module_short_description', array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
        ));
    
        register_post_meta( 'page', 'module_badge_selection', array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
        ));
    }
}
new Module();

<?php
function df_filterable_block_render_callback( $attributes ) {
    
    // final output to show
    $output = '';
    // Access attributes safely
    $postType = isset($attributes['query']) ? $attributes['query']['postType'] : 'page';
    $catTaxonomy = $attributes['query']['taxonomy'];
    $module_parent_id = $attributes['query']['parent'];

    $output = '<div class="wp-block-create-block-df-filterable-block" id="df_fb-showcase">
            <div class="df_fb-wrapper">';

            if($postType === 'dffilterablelayout'){
                
                // HEADER CONTENT
                $output .= '<div class="df_fb-header '.$postType.'-header"><div class="df_fb-filter-dropdown df_fb-cats">
                        <div class="df_fb-dropdown-value">';
                                // Check if there are any categories 
                                $categories = get_terms( [
                                    'taxonomy' => $catTaxonomy,
                                    'hide_empty' => true, // Only show categories that have posts
                                ] );
                                if ( ! is_wp_error( $categories ) && ! empty( $categories ) ) {
                                    $output .= '<ul>';
                                    $output .= '<li data-filter="all" class="df_fb-active">All</li>';
                                    foreach ( $categories as $category ) {
                                        $output .= '<li data-filter="' . esc_html(strtolower(str_replace(' ', '-', $category->name))) . '">' . esc_html( $category->name ) . '</li>';
                                    }
                                    $output .= '</ul>';
                                } else {
                                    $output .= '<p>No categories found.</p>';
                                }
                        $output .= '</div></div></div>';
                // BODY  CONTENT
                $output .= '<div class="df_fb-body-content '.$postType.'-body">';

                $output .= '<div class="df_fb-posts-wrap">';
                // Query ARG
                    // Set up the query arguments
                    $query_args = [
                        'post_type'      => $postType,
                        'posts_per_page' => '-1',
                        'post_status'    => 'publish',
                        'offset'         =>  '0',
                        'orderby'        => 'date',
                        'order'          => 'desc',
                    ];
                    // Execute the query
                    $query = new WP_Query( $query_args );
                    if ( $query->have_posts() ) {
                        while ( $query->have_posts() ) {
                            $query->the_post();

                            // Fetch the categories for the current post
                            $categories = get_the_terms(get_the_ID(), $catTaxonomy); // Change 'category' if using a custom taxonomy

                            // If categories exist, build the data-filter string with category slugs or names
                            $category_slugs = [];
                            if ($categories && !is_wp_error($categories)) {
                                foreach ($categories as $category) {
                                    $category_slugs[] = $category->slug; // Use $category->name if you want to use category names
                                }
                            }

                            // Convert the category slugs array to a string
                            $data_categories = implode(' ', $category_slugs);

                            $preview_url = get_post_meta( get_the_ID(), 'df_fb_preview_url', true );
                            $download_url = get_post_meta( get_the_ID(), 'df_fb_download_url', true );

                            // Fetch featured image URL
                            $featured_img_url = get_the_post_thumbnail_url( get_the_ID(), 'full' ); // Use 'full' or any other size like 'medium', 'large'
                
                            // Customize the output as needed
                            $output .= '<div class="df_fb-item '.$data_categories.'">';
                            $output .= '<div class="df_fb-item-image">'.get_the_post_thumbnail().'</div>';
                            $output .= '<div class="df_fb-item-content">';
                            $output .= '<h3 class="df_fb-item-title">' . get_the_title() . '</h3>';
                            $output .= '<div class="df_fb-item-excerpt"><p>' . get_the_excerpt() . '</p></div>';
                            $output .= '<div class="df_fb-item-links"><a href="' . $preview_url . '" class="df_fb-filter-btn">Live Preview</a><a href="' . $download_url . '" class="df_fb-filter-btn">Download Now</a></div>';
                            $output .= '</div></div>';
                        }
                    } else {
                        $output .= '<p>No posts found.</p>';
                    }
                $output .= '</div>';

                $output .= '<div class="df_fb-load-more"><button class="df_fb-filter-btn" id="df_fb-load-more-btn">'.__('Load More', DF_FG_TEXT_DOMAIN).'</button></div>
                        </div>';
                  
            }

            if($postType === 'dffilterableblock'){

                // HEADER CONTENT
                $output .= '<div class="df_fb-header '.$postType.'-header"><div class="df_fb-header-title">
                    <h2>'.__("Filter Divi Website Examples", DF_FG_TEXT_DOMAIN).'</h2>
                </div>';

                $output .= '<div class="df_fb-filter-meta">';

                $output .= '<div class="df_fb-filter-dropdown df_fb-cats">
                        <div class="df_fb-dropdown-btn">
                            <p>'.__("Categories", DF_FG_TEXT_DOMAIN).'</p>
                            <img src="'.plugin_dir_url( __FILE__ ) .'images/arrow.png">
                        </div>';

                    // Check if there are any categories 
                    $categories = get_terms( [
                        'taxonomy' => $catTaxonomy,
                        'hide_empty' => true, // Only show categories that have posts
                    ] );
                    if ( ! is_wp_error( $categories ) && ! empty( $categories ) ) {
                        $output .= '<div class="df_fb-dropdown-value"><ul class="df_fb-categories">';
                        $output .= '<li data-filter="all" class="df_fb-active">All</li>';
                        foreach ( $categories as $category ) {
                            $output .= '<li data-filter="' . esc_html(strtolower(str_replace(' ', '-', $category->name))) . '">' . esc_html( $category->name ) . '</li>';
                        }
                        $output .= '</ul></div>';
                    } else {
                        $output .= '<p>No categories found.</p>';
                    }

                $output .= '</div>';

                $output .= '<div class="df_fb-filter-dropdown df_fb-sorts">
                    <div class="df_fb-dropdown-btn">
                        <p>'.__("Sort", DF_FG_TEXT_DOMAIN).'</p>
                        <img src="'.plugin_dir_url( __FILE__ ) .'images/filter-horizontal.png">
                    </div>
                    <div class="df_fb-dropdown-value">
                        <ul>
                            <li data-sort="asc">'.__("Old", DF_FG_TEXT_DOMAIN).'</li>
                            <li data-sort="desc">'.__("New", DF_FG_TEXT_DOMAIN).'</li>
                        </ul>
                    </div>
                </div>';
                $output .= '</div></div>';

                // BODY CONTENT
                $output .= '<div class="df_fb-body-content '.$postType.'-body"><div class="df_fb-posts-wrap">';
                
                $query_args = [
                    'post_type'      => $postType,
                    'posts_per_page' => '-1',
                    'post_status'    => 'publish',
                    'offset'         =>  '0',
                    'orderby'        => 'date',
                    'order'          => 'desc',
                ];
                // Execute the query
                $query = new WP_Query( $query_args );
                if ( $query->have_posts() ) {
                    while ( $query->have_posts() ) {
                        $query->the_post();

                        // Fetch the categories for the current post
                        $categories = get_the_terms(get_the_ID(), $catTaxonomy); // Change 'category' if using a custom taxonomy

                        // If categories exist, build the data-filter string with category slugs or names
                        $category_slugs = [];
                        if ($categories && !is_wp_error($categories)) {
                            foreach ($categories as $category) {
                                $category_slugs[] = $category->slug; // Use $category->name if you want to use category names
                            }
                        }

                        $data_categories = implode(' ', $category_slugs); // Convert the category slugs array to a string

                        $created_timestamp = get_the_date('Y-m-d H:i:s');

                        $preview_url = get_post_meta( get_the_ID(), 'df_fb_custom_url', true );

                        $featured_img_url = get_the_post_thumbnail_url( get_the_ID(), 'full' ); // Use 'full' or any other size like 'medium', 'large'
            
                        // Customize the output as needed
                        $output .= '<div class="df_fb-item '.$data_categories.'" data-created="' . esc_attr($created_timestamp) . '" style="display:block;">';
                        $output .= '<div class="df_fb-item-image">'.get_the_post_thumbnail().'<div class="df_fb-item-overlay"><a href="' . $preview_url . '" class="df_fb-filter-btn">View Website</a></div></div>';
                        $output .= '<div class="df_fb-item-content">';
                        $output .= '<p class="df_fb-item-title">' . get_the_title() . '</p>';
                        $output .= '<div class="df_fb-item-cats"><span>'.$data_categories.'</span></div>';
                        $output .= '</div></div>';
                    }
                } else {
                    $output .= '<p>No posts found.</p>';
                }

                $output .= '</div></div>';
            }

            if($postType === 'page'){

                // HEADER CONTENT
                $output .= '<div class="df_fb-header '.$postType.'-header"><div class="df_fb-filter-dropdown df_fb-cats">
                        <div class="df_fb-dropdown-value">';
                                // Check if there are any categories 
                                $categories = get_terms( [
                                    'taxonomy' => $catTaxonomy,
                                    'hide_empty' => true, // Only show categories that have posts
                                ] );
                                if ( ! is_wp_error( $categories ) && ! empty( $categories ) ) {
                                    $output .= '<ul>';
                                    $output .= '<li data-filter="all" class="df_fb-active">All</li>';
                                    foreach ( $categories as $category ) {
                                        $output .= '<li data-filter="' . esc_html(strtolower(str_replace(' ', '-', $category->name))) . '"
                                                        data-name="' . esc_attr($category->name) . '" 
                                                        data-description="' . esc_attr($category->description) . '"
                                                    >' . esc_html( $category->name ) . '</li>';
                                    }
                                    $output .= '</ul>';
                                } else {
                                    $output .= '<p>No categories found.</p>';
                                }
                $output .= '</div></div></div>';

                // BODY CONTENT
                $output .= '<div class="df_fb-body-content '.$postType.'-body">';
                $output .= '<div class="df_fb-title-section"><h2></h2><p></p></div>';
                
                $output .= '<div class="df_fb-posts-wrap">';

                    // Set up the query arguments
                    $posts_query_args = [
                        'post_type'      => 'page',         // Only fetch pages
                        'posts_per_page' => '-1',      // Number of posts per page
                        'post_status'    => 'publish',      // Only published pages
                        'post_parent'    => $module_parent_id, // Parent page ID
                        'offset'         => '0',        // Offset for pagination
                        'orderby'        => 'date',         // Order by date
                        'order'          => 'desc' // Ascending or Descending order
                    ];
                    
                    // Fetch specific fields if needed
                    $posts_query_args['_fields'] = ['id', 'title', 'link', 'meta'];
                    
                    // Execute the query
                    $query = new WP_Query( $posts_query_args );
                    if ( $query->have_posts() ) {
                        while ( $query->have_posts() ) {
                            $query->the_post();

                            
                            // Fetch the categories for the current post
                            $categories = get_the_terms(get_the_ID(), $catTaxonomy); // Change 'category' if using a custom taxonomy

                            // If categories exist, build the data-filter string with category slugs or names
                            $category_slugs = [];
                            if ($categories && !is_wp_error($categories)) {
                                foreach ($categories as $category) {
                                    $category_slugs[] = $category->slug; // Use $category->name if you want to use category names
                                }
                            }

                            // Convert the category slugs array to a string
                            $data_categories = implode(' ', $category_slugs);

                            $short_desc = get_post_meta( get_the_ID(), 'module_short_description', true );
                            $module_icon = get_post_meta( get_the_ID(), 'module_icon', true );
                            $icon_alt_text = get_post_meta( get_the_ID(), 'icon_alt_text', true );
                            $badge = get_post_meta( get_the_ID(), 'module_badge_selection', true );

                            // Fetch featured image URL
                            $featured_img_url = get_the_post_thumbnail_url( get_the_ID(), 'full' ); // Use 'full' or any other size like 'medium', 'large'
                
                            // Customize the output as needed
                            $output .= '<div class="df_fb-item '.$data_categories.'">';
                            $output .= '<div class="df_fb-item-image"><img src="'.$module_icon.'" alt="'.$icon_alt_text.'" /></div>';
                            $output .= '<div class="df_fb-item-content">';
                            $output .= '<h3 class="df_fb-item-title">' . get_the_title() . '</h3>';
                            $output .= '<div class="df_fb-item-desc"><p>' . $short_desc . '</p></div>';
                            $output .= '<div class="df_fb-item-links"><a href="'. get_the_permalink() .'" class="">More Info</a></div></div>';

                            if(!empty($badge)){
                                $output .= '<div class="df_fb-item-badge"><span class="df_fb-badge '.$badge.'">'.$badge.'</span></div>';
                            }
                            
                            $output .= '</div>';
                        }
                    } else {
                        $output .= '<p>No posts found.</p>';
                    }
                $output .= '</div>';

                $output .= '</div>';
            }

            $output .= '</div></div>';
  
    return $output;
}
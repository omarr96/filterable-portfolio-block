// WordPress dependencies
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

// Internal dependencies
import { appendCategoryItem, removeSpecificClass, findActiveItem } from './view/utils';
import './view/frontendScripts';

domReady( function() {
    const queryBlocks = document.querySelectorAll( '.wp-block-create-block-df-filterable-block[data-attributes]' );
	[].map.call( queryBlocks, async function( queryBlock ) {

        let step = 1;
        let selectedCategory = '*'; 
        let selectedOrder = 'desc'; 
        let isAppend = false; // to trigger loadmore and sorting combination

        const blockAttributes = JSON.parse( queryBlock.dataset.attributes );
        const perPage = Number.parseInt( blockAttributes.query.perPage );
       // const perPage = 2;

        const headerCategories = queryBlock.querySelector('.df_fb-cats .df_fb-dropdown-value');
        const catTitle = queryBlock.querySelector('.df_fb-cats .df_fb-dropdown-btn');

        const sortingOptions = queryBlock.querySelector('.df_fb-sorts .df_fb-dropdown-value');
        const sortTitle = queryBlock.querySelector('.df_fb-sorts .df_fb-dropdown-btn');

        const bodyPosts = queryBlock.querySelector('.df_fb-items-wrapper');
        const loadMoreBtn = queryBlock.querySelector('#df_fb-load-more-btn');
        const preloaderSec = queryBlock.querySelector('#df_fb-preloader');

        // Collect all categories
		const categoriesQueryArgs = { per_page: -1, hide_empty: true };
		const categoriesUrl = addQueryArgs( '/wp/v2/df_filter_category', categoriesQueryArgs );
		await apiFetch( { path: categoriesUrl } ).then( function( categories ) {
			if ( !! categories && categories.length ) {
				const categoryRoot = document.createElement( 'ul' );
				// create all category element
				appendCategoryItem( categoryRoot, '*', __( 'All', 'df-filterable-block' ) );
				// store all categories in line
				const cleanCategories = [].map.call( categories, function( category ) {
					if ( category.count && 1 !== category.id ) {
						appendCategoryItem( categoryRoot, category.id, __( category.name, 'df-filterable-block' ) );
					}
					return { id: category.id, name: category.name, slug: category.slug };
				} );
				categoryRoot.setAttribute( 'class', 'df_fb-categories' );
				categoryRoot.setAttribute( 'data-categories', JSON.stringify( cleanCategories ) );
				headerCategories.appendChild( categoryRoot );
			}
		} );

        if( headerCategories.querySelector('.df_fb-categories') ){
            // Take an action with click event on categories
			const allCategoriesFilterItem = headerCategories.querySelectorAll( '.df_fb-categories li' );
			[].map.call( allCategoriesFilterItem, function( filterItem ) {
				filterItem.addEventListener( 'click', async function( event ) {
					// event.preventDefault();
                    catTitle.querySelector('p').innerText = event.currentTarget.innerText;

					if ( ! event.currentTarget.classList.contains( 'active' ) ) {
						removeSpecificClass( allCategoriesFilterItem, 'active' );
						event.currentTarget.classList.add( 'active' );
					}
                    // reset style
                    catTitle.classList.remove('df_fb-rotate-icon');
                    headerCategories.classList.remove('df_fb-show');

                    step = 1; // reset step
                    selectedCategory = event.currentTarget && event.currentTarget.dataset.value;
					await assemblePostPerQuery( selectedCategory, step, selectedOrder );
				} );
			} );
        }

        if( sortingOptions ){
             // Take an action with click event on sorting options
			const allSortingFilterItem = sortingOptions.querySelectorAll( 'ul li' );

			[].map.call( allSortingFilterItem, function( filterItem ) {
				filterItem.addEventListener( 'click', async function( event ) {
					// event.preventDefault();
                    sortTitle.querySelector('p').innerText = event.currentTarget.innerText;

					if ( ! event.currentTarget.classList.contains( 'active' ) ) {
						removeSpecificClass( allSortingFilterItem, 'active' );
						event.currentTarget.classList.add( 'active' );
					}
                    // reset style
                    sortingOptions.classList.remove('df_fb-show');
                    selectedOrder = event.currentTarget && event.currentTarget.dataset.value;
                    if( step > 1 ){ isAppend = true; }
                    
					await assemblePostPerQuery( selectedCategory, step, selectedOrder );
				} );
			} );
        }

        // Collect all posts ( portfolio websites )
        const assemblePostPerQuery = async function( selectedCategory = '*', step = 1, order = 'desc' ){

            let _perPage = perPage;
            let offset = (step - 1) * perPage;

            if ( selectedCategory && step == 1 || isAppend ) { 
                bodyPosts.innerHTML = '';  // reset innerhtml to generate new posts
                preloaderSec.style.display='flex'; // bring preloader again
            } 

            if( isAppend ){
                _perPage = perPage * step;
                offset = 0;
            }

            const postsQueryArgs = { per_page: _perPage, status: 'publish', _embed: true, ...(selectedCategory !== '*' && { df_filter_category: selectedCategory }), offset: offset, orderby: 'date',  order: order }; 
            const postsUrl = addQueryArgs('/wp/v2/dffilterableblock', postsQueryArgs);
            await apiFetch({ path: postsUrl }).then(function(posts) {

                if (!!posts && posts.length) {

                    preloaderSec.style.display='none'; // hide preloader

                    loadMoreBtn.disabled  = false;
                    loadMoreBtn.textContent = __( 'Load More', 'df-filterable-block' );

                    if( posts.length < perPage ){
                        loadMoreBtn.style.display  = 'none';
                    }else{
                        loadMoreBtn.style.display  = 'inline-block';
                    }

                    // Iterate through posts and create list items
                    posts.forEach(function(post) {
                        const postItem = document.createElement('div');
                        postItem.setAttribute('class', 'df_fb-item');

                        const ImageWrap = document.createElement('div');
                        ImageWrap.setAttribute('class', 'df_fb-item-image');

                        const imageElem = document.createElement('img');
                        imageElem.setAttribute('src', post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url);
                        imageElem.setAttribute('alt', post.title.rendered);
                        ImageWrap.appendChild(imageElem);

                        const OverlayWrap = document.createElement('div');
                        OverlayWrap.setAttribute('class', 'df_fb-item-overlay');

                        const linkElem = document.createElement('a');
                        linkElem.setAttribute('class', 'df_fb-filter-btn');
                        linkElem.setAttribute('href', post.meta.df_fb_custom_url || '#' );
                        linkElem.innerText = __( 'View Website', 'df-filterable-block' ); 
                        OverlayWrap.appendChild(linkElem);

                        ImageWrap.appendChild(OverlayWrap);

                        const contentWrap = document.createElement('div');
                        contentWrap.setAttribute('class', 'df_fb-item-content');

                        const titleElem = document.createElement('h6');
                        titleElem.setAttribute('class', 'df_fb-item-title');
                        titleElem.innerText = post.title.rendered;

                        const catsWrap = document.createElement('div');
                        catsWrap.setAttribute('class', 'df_fb-item-cats');

                        const catSpan = document.createElement('span');

                        post._embedded['wp:term'] && post._embedded['wp:term'][0].map((category) => (
                            catSpan.innerText = category.name
                        ))
                        
                        catsWrap.appendChild(catSpan);
                        contentWrap.appendChild(titleElem);
                        contentWrap.appendChild(catsWrap);

                        postItem.appendChild(ImageWrap);
                        postItem.appendChild(contentWrap);
                        
                        bodyPosts.appendChild(postItem);
                    });
                    
                } else {
                    //  disable load more button if no posts found
                    loadMoreBtn.disabled  = true;
                    loadMoreBtn.textContent = __( 'No more posts to load', 'df-filterable-block' );
                }
            });

        }

        // load more button
        loadMoreBtn.addEventListener('click', function() {
            const category = findActiveItem( headerCategories, '*' );
            const order = findActiveItem( sortingOptions, 'desc' );
            step++;
            isAppend = false;
            assemblePostPerQuery(category, step, order);
        });

        // call main function
        assemblePostPerQuery();

    })
});
// WordPress dependencies
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { useEntityRecords } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

// Internal dependencies
import { appendCategoryItem, removeSpecificClass } from './view/utils';
import './view/frontendScripts';

domReady( function() {
    const queryBlocks = document.querySelectorAll( '.wp-block-create-block-df-filterable-block[data-attributes]' );
	[].map.call( queryBlocks, async function( queryBlock ) {

        let step = 1;
        const blockAttributes = JSON.parse( queryBlock.dataset.attributes );
        const perPage = Number.parseInt( blockAttributes.query.perPage );
       // const perPage = 2;

        const headerCategories = queryBlock.querySelector('.df_fb-cats .df_fb-dropdown-value');
        const catTitle = queryBlock.querySelector('.df_fb-cats .df_fb-dropdown-btn');

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

                    step= 1; // reset step (to start from first)

					await assemblePostPerQuery( event.currentTarget && event.currentTarget.dataset.value, step );
				} );
			} );
        }

        // Collect all posts ( portfolio websites )
        const assemblePostPerQuery = async function( selectedCategory, step = 1 ){

            if ( selectedCategory && step == 1) { 
                bodyPosts.innerHTML = '';  // reset innerhtml to generate new posts
                preloaderSec.style.display='flex'; // bring preloader again
            } 

            const offset = (step - 1) * perPage;

            const postsQueryArgs = { per_page: perPage, status: 'publish', _embed: true, ...(selectedCategory !== '*' && { df_filter_category: selectedCategory }), offset: offset }; 
            const postsUrl = addQueryArgs('/wp/v2/dffilterableblock', postsQueryArgs);
            await apiFetch({ path: postsUrl }).then(function(posts) {

                if (!!posts && posts.length) {

                    preloaderSec.style.display='none'; // hide preloader

                    loadMoreBtn.disabled  = false;
                    loadMoreBtn.textContent = "Load More";

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
                        imageElem.setAttribute('src', post._embedded['wp:featuredmedia'][0].source_url);
                        imageElem.setAttribute('alt', post.title.rendered);
                        ImageWrap.appendChild(imageElem);

                        const OverlayWrap = document.createElement('div');
                        OverlayWrap.setAttribute('class', 'df_fb-item-overlay');

                        const linkElem = document.createElement('a');
                        linkElem.setAttribute('class', 'df_fb-filter-btn');
                        linkElem.setAttribute('href', post.meta.df_fb_custom_url || '#' );
                        linkElem.innerText = 'View Website';
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
                    loadMoreBtn.textContent = "No more posts to load";
                }
            });

        }

        assemblePostPerQuery();

        // find active category
        function findActiveCategory () {
            const activeCat = headerCategories.querySelector('ul li.active');
            if(activeCat){
                const dataValue = activeCat.getAttribute('data-value');
                return dataValue;
            }
           return '*';
        }

        // function callLoadMore(selectedCategory){

        //     const POSTS_QUERY = {per_page: -1, status: 'publish', _embed: true, ...(selectedCategory !== '*' && { df_filter_category: selectedCategory })};
	    //     const postsUrl = addQueryArgs('/wp/v2/dffilterableblock', POSTS_QUERY);
        //     apiFetch({ path: postsUrl }).then(function(posts) {
        //         if ( posts.length > perPage ){
        //             loadMoreBtn.style.display = 'inline-block';
        //         }
        //     });  
        // }

        // load more button
        loadMoreBtn.addEventListener('click', function() {
            const selectedCategory = findActiveCategory();
            step++;
            assemblePostPerQuery(selectedCategory, step);
        });

    })
});
// WordPress dependencies
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

(function(){
	// Select the table element
	const parentContainer = document.querySelectorAll('.wp-block-create-block-df-filterable-block');

	if( parentContainer.length > 0 ) {
		[...parentContainer].forEach(function(parentElem) {

			const catDropdown = parentElem.querySelector(".df_fb-cats .df_fb-dropdown-btn");
            const catDropdownBody = parentElem.querySelector(".df_fb-cats .df_fb-dropdown-value");

            if( catDropdown ){
                catDropdown.addEventListener('click', function(){
                    this.classList.toggle('df_fb-rotate-icon');
                    catDropdownBody.classList.toggle('df_fb-show');
                });

                // Close the dropdown when clicking outside of it
                document.addEventListener('click', function(event) {
                    // Check if the clicked element is outside of the dropdown
                    if (!catDropdown.contains(event.target) && !catDropdownBody.contains(event.target)) {
                        catDropdown.classList.remove('df_fb-rotate-icon');
                        catDropdownBody.classList.remove('df_fb-show');
                    }
                });
            }

		})
	}
})()
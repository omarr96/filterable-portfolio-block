
export const appendCategoryItem = function( root, id, name ) {
	// create all category element
	const allCategoryElement = document.createElement( 'li' );

	if ( '*' === id ) {
		allCategoryElement.setAttribute( 'class', 'active' );
		allCategoryElement.setAttribute( 'data-value', '*' );
	} else {
		allCategoryElement.setAttribute( 'data-value', id );
	}

	allCategoryElement.innerHTML = name; 

	//allCategoryElement.appendChild( AnchorElement );
	root.appendChild( allCategoryElement );
};

// Remove active class from another item
export const removeSpecificClass = function( root, className ) {
	[].map.call( root, function( otherItem ) {
		otherItem.classList.remove( className );
	} );
};

// find active items from list
export const findActiveItem = ( param, val ) => {
	const activeCat = param.querySelector('ul li.active');
	if(activeCat){ return activeCat.getAttribute('data-value'); }
	return val;
}


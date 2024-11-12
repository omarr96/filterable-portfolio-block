(function(){
	// Select the table element
	const parentContainer = document.querySelectorAll('.wp-block-create-block-df-filterable-block');

  //  console.log('parentContainer', parentContainer);

	if( parentContainer.length > 0 ) {
		[...parentContainer].forEach(function(parentElem) {

            // layout filter
            const filterItems = parentElem.querySelectorAll(".df_fb-cats ul li");
            const dfItemsContainer = parentElem.querySelector(".df_fb-posts-wrap");
            const dfPosts = parentElem.querySelectorAll(".df_fb-item");
            const dfItems = Array.from(parentElem.querySelectorAll(".df_fb-item")); // Convert to array for sorting

            // for module page only -->
            const titleElement = parentElem.querySelector(".df_fb-title-section h2");
            const descriptionElement = parentElem.querySelector(".df_fb-title-section p");
            // -->

            function filterItemsByCategory(filterValue) {

                dfItems.forEach((dfItem) => {
                    const shouldShow = filterValue === "all" || !filterValue || dfItem.classList.contains(filterValue);

                    if (shouldShow) {
                        // Fade in and scale up effect
                        dfItem.style.display = "block";
                       // dfItem.style.opacity = 0; // Start transparent
                        dfItem.style.transform = "scale(0)"; // Start with scale 0 (invisible)
                        dfItem.style.transition = "opacity 0.3s ease, transform 0.3s ease"; // Apply both opacity and scale transitions
                
                        setTimeout(() => {
                           // dfItem.style.opacity = 1; // Fade in
                            dfItem.style.transform = "scale(1)"; // Scale up to normal size
                        }, 200); // Slight delay to apply the transition
                    } else {
                        // Fade out and scale down effect
                        dfItem.style.transition = "opacity 0.3s ease, transform 0.3s ease"; // Apply both opacity and scale transitions
                      //  dfItem.style.opacity = 0; // Fade out
                        dfItem.style.transform = "scale(0)"; // Scale down to 0
                
                        setTimeout(() => {
                            dfItem.style.display = "none"; // Hide the item after scaling down and fading out
                        }, 300); // Match this timeout to the duration of the transition
                    }
                //   if (filterValue === "all" || !filterValue) {
                //     dfItem.style.display = "block"; // Show all items if "all" or no filter selected

                //   } else {
                //     dfItem.style.display = dfItem.classList.contains(filterValue) ? "block" : "none";
                //   }
                });
            }
            
            function sortItems(order) {
                // Get currently visible items
                const visibleItems = Array.from(dfItemsContainer.querySelectorAll(".df_fb-item"))
                .filter(item => item.style.display === "block");
            
                // Sort based on text content or other criteria
                visibleItems.sort((a, b) => {
                    const aText = a.textContent.trim();
                    const bText = b.textContent.trim();
            
                    if (order === "asc") {
                        return aText.localeCompare(bText); // Ascending order
                    } else {
                        return bText.localeCompare(aText); // Descending order
                    }
                });
        
                // Append sorted items back to the container
                visibleItems.forEach(item => dfItemsContainer.appendChild(item));
            }
            
            // Event listeners for filter buttons
            filterItems.forEach((item) => {
                item.addEventListener("click", () => {

                    // update module title section -->
                    if( titleElement && descriptionElement ){
                        const categoryName = item.getAttribute("data-name");
                        const categoryDescription = item.getAttribute("data-description");
                        titleElement.textContent = categoryName;
                        descriptionElement.textContent = categoryDescription;
                    }
                    // -->

                    filterItems.forEach((el) => el.classList.remove("df_fb-active"));
                    item.classList.add("df_fb-active");
            
                    const filterValue = item.getAttribute("data-filter");
                    filterItemsByCategory(filterValue);
                });
            });
            
            // Event listeners for sort buttons
            parentElem.querySelectorAll(".df_fb-sorts ul li").forEach((button) => {
                button.addEventListener("click", () => {
                    const sortOrder = button.getAttribute("data-sort");
                    sortItems(sortOrder);
                });
            });

			const catDropdown = parentElem.querySelector(".df_fb-cats .df_fb-dropdown-btn");
            const catDropdownBody = parentElem.querySelector(".df_fb-cats .df_fb-dropdown-value");

            const sortsDropdown = parentElem.querySelector(".df_fb-sorts .df_fb-dropdown-btn");
            const sortsDropdownBody = parentElem.querySelector(".df_fb-sorts .df_fb-dropdown-value");

            // category dropdown controller
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

            // sorting dropdown controller
            if( sortsDropdown ){
                sortsDropdown.addEventListener('click', function(){
                    this.classList.toggle('df_fb-rotate-icon');
                    sortsDropdownBody.classList.toggle('df_fb-show');
                });

                // Close the dropdown when clicking outside of it
                document.addEventListener('click', function(event) {
                    // Check if the clicked element is outside of the dropdown
                    if (!sortsDropdown.contains(event.target) && !sortsDropdownBody.contains(event.target)) {
                        sortsDropdown.classList.remove('df_fb-rotate-icon');
                        sortsDropdownBody.classList.remove('df_fb-show');
                    }
                });
            }

		})
	}

    
})()

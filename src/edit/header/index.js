// WordPress dependencies
import { useEntityRecords } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

// Internal Dependencies
import ShowCaseHeader from './showcase';
import LayoutHeader from './layout';
import ModuleHeader from './module';

export default function Header( { attributes, setAttributes } ) {

    const postType = attributes.query.postType;
    const catTaxonomy = attributes.query.taxonomy;

    const CATEGORIES_QUERY = { 
      per_page: -1, 
      hide_empty: true,
      status: 'publish',
    };
	  const { records: categories, isResolving } = useEntityRecords( 'taxonomy', catTaxonomy, CATEGORIES_QUERY );
    
    return (
      <div className={`df_fb-header ${postType}-header`}>
          { postType === 'dffilterableblock' && <ShowCaseHeader categories = {categories} isLoading = {isResolving} />}
          { postType === 'dffilterablelayout' && <LayoutHeader categories = {categories} isLoading = {isResolving} />}
          { postType === 'page' && <ModuleHeader categories = {categories} isLoading = {isResolving} />}
      </div>
    )
}

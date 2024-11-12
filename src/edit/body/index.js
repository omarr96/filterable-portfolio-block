// WordPress dependencies
import { Spinner } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// internal components
import ShowcaseBody from './showcase';
import LayoutBody from './layout';
import ModuleBody from './module';

export default function Body( { attributes, setAttributes } ) {

    const { query } = attributes;
    const _postType = query.postType;

    console.log('query: ', query);

    const POSTS_QUERY = { 
        per_page: _postType === 'page' ? -1 : query.perPage, 
        hide_empty: true, 
        context: 'view', 
        status: 'publish',
        _embed: true,
        ...(_postType === 'page' && 
            {
                _fields: ['id', 'title', 'link', 'meta'],
                parent: query.parent,
                meta_key: ['module_icon', 'module_short_description', 'module_badge_selection']
            }
        )
    };

	const { records: posts, isResolving } = useEntityRecords( 'postType', _postType, POSTS_QUERY );

    return (
        <div className={`df_fb-body-content ${_postType}-body`}>
            { _postType === 'dffilterableblock' && <ShowcaseBody posts={posts} isLoading={isResolving} />}
            { _postType === 'dffilterablelayout' && <LayoutBody posts={posts} isLoading={isResolving} />}
            { _postType === 'page' && <ModuleBody posts={posts} isLoading={isResolving} />}
        </div>
    )
}

// WordPress dependencies
import { Spinner } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function body( { attributes, setAttributes } ) {

    const { query } = attributes;

    const POSTS_QUERY = { per_page: query.perPage, hide_empty: true, context: 'view', status: 'publish', _embed: true };
	const { records: portfolios, isResolving } = useEntityRecords( 'postType', 'dffilterableblock', POSTS_QUERY );

    console.log('portfolios:', portfolios);

    useEffect( () => {
		setAttributes( { portfolios } );
	}, [ portfolios ] );

  return (
    <div className='df_fb-body-content'>
        <div className='df_fb-items-wrapper'>
            {isResolving ? <Spinner/> : (
                !! portfolios && portfolios.length !== 0 ? (
                    <>
                        {[].map.call( portfolios, function( post ) {
                            return(
                                <div className='df_fb-item'>
                                    <div className='df_fb-item-image'>
                                        <img src={post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url} alt={post.title.rendered} />
                                        {/* overlay on hover */}
                                        <div className='df_fb-item-overlay'>
                                            <a href={ post.meta.df_fb_custom_url || '#'} className='df_fb-filter-btn'>{ __('View Website', 'df-filterable-block') }</a>
                                        </div>
                                    </div>
                                    <div className='df_fb-item-content'>
                                        <h6 className='df_fb-item-title'>{__( post.title.rendered, 'df-filterable-block' )}</h6>
                                        <div className='df_fb-item-cats'>
                                            {post._embedded['wp:term'] && post._embedded['wp:term'][0].map((category) => (
                                            <span key={category.id}>{__( category.name, 'df-filterable-block' )}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        } )}
                    </>
                ) : null
            )}
        </div>
    </div>
  )
}

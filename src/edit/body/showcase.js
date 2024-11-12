// WordPress dependencies
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function ShowcaseBody( { posts, isLoading } ) {

  return (
    <>
        <div className='df_fb-posts-wrap'>
            {isLoading ? <Spinner/> : (
                !! posts && posts.length !== 0 ? (
                    <>
                        {[].map.call( posts, function( post ) {
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
                                        <p className='df_fb-item-title'>{__( post.title.rendered, 'df-filterable-block' )}</p>
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
                ) : (
                    <div> No Data Found !!!</div>
                )
            )}
        </div>
    </>
  )
}

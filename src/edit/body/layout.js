// WordPress dependencies
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function LayoutBody( { posts, isLoading } ) {

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
                                        <img src={post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url} alt={post.title.rendered} />
                                    </div>
                                    <div className='df_fb-item-content'>
                                        <h3 className='df_fb-item-title'>{__( post.title.rendered, 'df-filterable-block' )}</h3>
                                        <div  className='df_fb-item-excerpt' dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                                        <div className='df_fb-item-links'>
                                            <a href={ post.meta.df_fb_preview_url || '#'} className='df_fb-filter-btn'>{ __('Live Preview', 'df-filterable-block') }</a>
                                            <a href={ post.meta.df_fb_download_url || '#'} className='df_fb-filter-btn'>{ __('Download Now', 'df-filterable-block') }</a>
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

// WordPress dependencies
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function ModuleBody( { posts, isLoading } ) {

    return (
        <>
            <div className='df_fb-title-section'>
                <h2>All Modules</h2>
                <p>In General Modules pack we are offering more than 14 modules that you can use effortlessly to customize your site. </p>
            </div>
            <div className='df_fb-posts-wrap'>
                {isLoading ? <Spinner/> : (
                    !! posts && posts.length !== 0 ? (
                        <>
                            {[].map.call( posts, function( post ) {
                                return(
                                    <div className='df_fb-item'>
                                        <div className='df_fb-item-image'>
                                            <img src={post.meta.module_icon} alt={post.meta.icon_alt_text} />
                                        </div>
                                        <div className='df_fb-item-content'>
                                            <h3 className='df_fb-item-title'>{__( post.title.rendered, 'df-filterable-block' )}</h3>
                                            <div  className='df_fb-item-desc'> {__( post.meta.module_short_description, 'df-filterable-block' )}</div>
                                            <div className='df_fb-item-links'> <a href={ post.link || '#' } className=''>{ __('More Info', 'df-filterable-block') }</a></div>
                                        </div>
                                        { post.meta.module_badge_selection && <div className='df_fb-item-badge'><span className={`df_fb-badge ${post.meta.module_badge_selection}`}>{ __( post.meta.module_badge_selection, 'df-filterable-block') }</span></div>}
                                    </div>
                                )
                            } )}
                        </>
                    ) : (<div> No Data Found !!! Please set your modules "parent page" id in the Block Editor Option Panel.</div>)
                )}
            </div>
            
        </>
    )
}

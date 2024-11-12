// WordPress dependencies
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Internal Dependencies
import search from '../../images/search.png';
import arrow from '../../images/arrow.png';

export default function ModuleHeader( { categories, isLoading } ) {

    return (
        <>
             <div className='df_fb-filter-dropdown df_fb-cats'>
                <div className='df_fb-dropdown-btn'>
                    <p>{ __('Categories', 'df-filterable-block') }</p>
                    <img src={arrow} alt='arrow icon' />
                </div>
                {/* generate custom taxonomy cats here */}
                <div className='df_fb-dropdown-value'>
                    {isLoading ? <Spinner/> : (
                        !! categories && categories.length !== 0 ? (
                            <ul>
                                <li key={'*'} data-value={'*'} className={'df_fb-active'}>{__( 'All', 'df-filterable-block' )}</li>
                                <>
                                    {[].map.call( categories, function( Category ) {
                                        if ( Category.id !== 1 ) {
                                            return <li key={Category.id} data-value={Category.id}>
                                                {__( Category.name, 'df-filterable-block' )}
                                            </li>;
                                        }
                                        return null;
                                    } )}
                                </>
                            </ul>
                        ) : <div> No Data Found !!!</div>
                    )}
                </div>
            </div>
        </>
    )
}

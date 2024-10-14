// wordpress dependencies
import { __ } from '@wordpress/i18n';

// Internal Dependencies
import arrow from '../images/arrow.png';
import filter from '../images/filter-horizontal.png';

export default function Header( { attributes } ) {
  return (
    <div className='df_fb-header'>
        <div className='df_fb-header-title'>
            <h2>{__( 'Filter Divi Website Examples', 'df-filterable-block' )}</h2>
        </div>
        <div className='df_fb-filter-meta'>
            {/* dropdown filter */}
            <div className='df_fb-filter-dropdown df_fb-cats'>
                <div className='df_fb-dropdown-btn'>
                    <p>{ __('Categories', 'df-filterable-block') }</p>
                    <img src={arrow} alt='arrow icon' />
                </div>
                {/* generate custom taxonomy cats here */}
                <div className='df_fb-dropdown-value'></div>
            </div>
            {/* sorting filter */}
            <div className='df_fb-filter-dropdown df_fb-sorts'>
                <div className='df_fb-dropdown-btn'>
                    <p> { __('Sort', 'df-filterable-block') }</p>
                    <img src={filter} alt='arrow icon' />
                </div>
                <div className='df_fb-dropdown-value'>
                    <ul>
                        <li data-value = 'asc'>{ __('Old', 'df-filterable-block') }</li>
                        <li data-value = 'desc'>{ __('New ', 'df-filterable-block') }</li>
                    </ul>
                </div>
            </div>

            {/* <button className='df_fb-filter-btn'> { __('Apply', 'df-filterable-block') }</button> */}
        </div>
    </div>
  )
}

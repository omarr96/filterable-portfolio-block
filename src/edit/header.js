// WordPress dependencies
import { Spinner } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
// external support
import classnames from 'classnames';

// Internal Dependencies
import arrow from '../images/arrow.png';
import filter from '../images/filter-horizontal.png';

export default function Header( { attributes, setAttributes } ) {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const CATEGORIES_QUERY = { per_page: -1, hide_empty: true, context: 'view' };
	const { records: categories, isResolving } = useEntityRecords( 'taxonomy', 'df_filter_category', CATEGORIES_QUERY );

    useEffect( () => {
		setAttributes( { categories } );
	}, [ categories ] );

    const handleClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

  return (
    <div className='df_fb-header'>
        <div className='df_fb-header-title'>
            <h2>{ __('Filter Divi Website Examples', 'df-filterable-block') }</h2>
        </div>
        <div className='df_fb-filter-meta'>
            {/* dropdown filter */}
            <div className='df_fb-filter-dropdown df_fb-cats'>
                <div className='df_fb-dropdown-btn' onClick={handleClick}>
                    <p>{ __('Categories', 'df-filterable-block') }</p>
                    <img src={arrow} alt='arrow icon' />
                </div>
                <div 
                    className={ classnames(
                        'df_fb-dropdown-value',
                        { 'df_fb-show' : isDropdownOpen }
                    )}
                >
                    {isResolving ? <Spinner/> : (
						!! categories && categories.length !== 0 ? (
							<ul className={'df_fb-categories'}>
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
						) : null
					)}
                  
                </div>
            </div>
            {/* sorting filter */}
            <div className='df_fb-filter-dropdown df_fb-sorts'>
                <div className='df_fb-dropdown-btn'>
                    <p>{ __('Sort', 'df-filterable-block') }</p>
                    <img src={filter} alt='arrow icon' />
                </div>
                <div className='df_fb-dropdown-value'>
                    <ul>
                        <li>{ __('Old', 'df-filterable-block') }</li>
                        <li>{ __('New', 'df-filterable-block') }</li>
                    </ul>
                </div>
            </div>

            {/* <button className='df_fb-filter-btn'>{ __('Apply', 'df-filterable-block') }</button> */}
        </div>
    </div>
  )
}

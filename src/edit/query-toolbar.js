// WordPress dependencies
import {
	ToolbarGroup,
	Dropdown,
	ToolbarButton,
	BaseControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { settings } from '@wordpress/icons';

export default function QueryToolbar({
	attributes: { query },
	setQuery,
    type
}) {

  return (
    <>
        <ToolbarGroup>
                <Dropdown
                    contentClassName="block-library-query-toolbar__popover"
                    renderToggle={ ( { onToggle } ) => (
                        <ToolbarButton
                            icon={ settings }
                            label={ __( 'Display settings', 'df-filterable-block' ) }
                            onClick={ onToggle }
                        />
                    ) }
                    renderContent={ () => (
                        <>
                            <BaseControl>
                                <NumberControl
                                    __unstableInputWidth="60px"
                                    label={ __( 'Items per Page', 'df-filterable-block' ) }
                                    labelPosition="edge"
                                    min={ 1 }
                                    max={ 100 }
                                    onChange={ ( value ) => {
                                        if (
                                            isNaN( value ) ||
                                            value < 1 ||
                                            value > 100
                                        ) {
                                            return;
                                        }
                                        setQuery( {
                                            perPage: value,
                                        } );
                                    } }
                                    step="1"
                                    value={ query.perPage }
                                    isDragEnabled={ false }
                                />
                                { type === 'page' && 
                                    <NumberControl
                                        __unstableInputWidth="120px"
                                        label={ __( 'Parent Page ID', 'df-filterable-block' ) }
                                        labelPosition="edge"
                                        min={ 1 }
                                        onChange={ ( value ) => {
                                            if (isNaN( value )) {
                                                return;
                                            }
                                            setQuery( {
                                                parent: value,
                                            } );
                                        } }
                                        step="1"
                                        value={ query.parent }
                                        isDragEnabled={ false }
                                    />
                                }
                                
                            </BaseControl>
                        </>
                    ) }
                />
            </ToolbarGroup>
    </>
  )
}

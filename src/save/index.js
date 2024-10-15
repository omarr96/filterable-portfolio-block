// WordPress dependencies
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
// import arrow from '../images/arrow.png';
// import filter from '../images/filter-horizontal.png';
import Header from './header';
import Body from './body';

export default function save( { attributes } ) {

    const blockProps = useBlockProps.save();
    const extractAttributes = {
		query: { ...attributes.query },
	};

	return (
		<div {...blockProps} data-attributes={JSON.stringify( extractAttributes )}>
            <div className="df_fb-loader-wrapper"><div className="df_fb-loader"></div></div>
            <div className={'df_fb-wrapper'}>
                <Header attributes={attributes} />
                <Body attributes={attributes} />
            </div>
		</div>
	);
}

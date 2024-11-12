/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	BlockControls,
	useBlockProps
} from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import '../editor.scss';

// internal components
import Header from './header';
import Body from './body';
import QueryToolbar from './query-toolbar';
import Preview from './preview';

export default function Edit( { attributes, setAttributes } ) {

	const { query } = attributes;
	const updateQuery = ( newQuery ) => setAttributes( { query: { ...query, ...newQuery } } );

	const isPreview = query.postType;

	console.log('attributes: ', attributes);
	
	return (
		<>
			<BlockControls>
				{isPreview && <QueryToolbar
					attributes={ attributes }
					setQuery={ updateQuery }
					type = { query.postType }
				/>}
			</BlockControls>

			<div { ...useBlockProps() }>
				<div className={'df_fb-wrapper'}>
					{
						isPreview ? 
						<>
							<Header attributes={attributes} setAttributes={setAttributes}/>
							<Body attributes={attributes} setAttributes={setAttributes}/>
						</>
						: 
						<Preview attributes={attributes} setQuery={ updateQuery }/>
					}
				</div>
			</div>
		</>
		
	);
}

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

import LayoutImage from '../images/layouts.gif';
import ShowcaseImage from '../images/customershowcase.gif';
import ModuleImage from '../images/modules.gif';

export default function Preview( {
	attributes: { query },
	setQuery
} ) {

    return (
        <div className='df_fb-preview-wrap'>
            <div className='df_fb-postType-items'>
                <div className='df_fb-card'>
                    <div className='df_fb-preview-placeholder'>
                        <img src={ShowcaseImage} alt="showcase placeholder" />
                    </div>
                    <h3 className='df_fb-card-title'>Customer Showcase</h3>
                    <Button 
                        className='df_fb-card-btn' 
                        onClick={ () => { 
                            setQuery( {
                                postType: 'dffilterableblock',
                                taxonomy: 'df_filter_category',
                            } )
                        }}
                    >Insert Block</Button>
                </div>
                <div className='df_fb-card'>
                    <div className='df_fb-preview-placeholder'>
                        <img src={LayoutImage} alt="layout placeholder" />
                    </div>
                    <h3 className='df_fb-card-title'>Layouts</h3>
                    <Button 
                        className='df_fb-card-btn' 
                        onClick={ () => { 
                            setQuery( {
                                postType: 'dffilterablelayout',
                                taxonomy: 'df_layout_category',
                            } )
                        }}
                    >Insert Block</Button>
                </div>
                <div className='df_fb-card'>
                    <div className='df_fb-preview-placeholder'>
                        <img src={ModuleImage} alt="module placeholder" />
                    </div>
                    <h3 className='df_fb-card-title'>Modules</h3>
                    <Button 
                        className='df_fb-card-btn' 
                        onClick={ () => { 
                            setQuery( {
                                postType: 'page',
                                taxonomy: 'difl_page_category'
                            } )
                        }}
                    >Insert Block</Button>
                </div>
            </div>
        </div>
    )
}

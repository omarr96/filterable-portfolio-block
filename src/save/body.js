// wordpress dependencies
import { __ } from '@wordpress/i18n';

import PreloaderGif from '../images/preloader-gif.gif';

export default function Body( { attributes } ) {
  return (
    <div className='df_fb-body-content'>
        {/* preloader section*/}
        <div id="df_fb-preloader">
          <img src={PreloaderGif} alt="preloader img" />
        </div>
        <div className='df_fb-items-wrapper'>
            {/* generate posts here */}
        </div>
        {/* load more */}
        <div className="df_fb-load-more">
          <button id="df_fb-load-more-btn" className="df_fb-filter-btn">{ __('Load More', 'df-filterable-block') }</button>
        </div>
    </div>
  )
}

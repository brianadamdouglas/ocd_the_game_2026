Image.prototype.load = function( url, callback ) {
	/* console.log(url); */
    const thisImg = this;
    const xmlHTTP = new XMLHttpRequest();

    thisImg.completedPercentage = 0;

    xmlHTTP.open( 'GET', url , true );
    xmlHTTP.responseType = 'arraybuffer';

    xmlHTTP.onload = (e) => {
        const h = xmlHTTP.getAllResponseHeaders();
        const m = h.match( /^Content-Type\:\s*(.*?)$/mi );
        const mimeType = m[ 1 ] || 'image/png';
            // Remove your progress bar or whatever here. Load is done.

        const blob = new Blob( [ xmlHTTP.response ], { type: mimeType });
        thisImg.src = window.URL.createObjectURL( blob );
        if ( callback ) callback( thisImg );
    };

    xmlHTTP.onprogress = (e) => {
        if ( e.lengthComputable )
            thisImg.completedPercentage = parseInt( ( e.loaded / e.total ) * 100 );
            /* console.log([thisImg.src,e.loaded,e.total]);  */
            //g_eventHandler.dispatchAnEventOneTarget("displayLoadingProgress",{total:e.loaded});
            //g_loadTotal += e.loaded;
            
        // Update your progress bar here. Make sure to check if the progress value
        // has changed to avoid spamming the DOM.
        // Something like: 
        // if ( prevValue != thisImage completedPercentage ) display_progress();
    };

    xmlHTTP.onloadstart = () => {
        // Display your progress bar here, starting at 0
        thisImg.completedPercentage = 0;
    };

    xmlHTTP.onloadend = (e) => {
        // You can also remove your progress bar here, if you like.
        thisImg.completedPercentage = 100;
        // Use the actual response size or loaded bytes
        const bytesLoaded = e.loaded || xmlHTTP.response.byteLength || e.total || 0;
        g_eventHandler.dispatchAnEvent("displayProgress",{bytes:bytesLoaded});
    };

    xmlHTTP.send();
};



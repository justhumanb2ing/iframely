function hasOembedLinks(meta) {
    // Allow misspelled discovery links.
    if (meta && meta.alternative && !meta.alternate) {
        meta.alternate = meta.alternative;
        delete meta.alternative;
    }

    var alternate = meta && meta.alternate;
    if (alternate && !(alternate instanceof Array)) {
        alternate = [alternate];
        meta.alternate = alternate;
    }

    return !!(alternate && alternate.some(function(link) {
        return link && /^(application|text)\/(xml|json)\+oembed$/i.test(link.type);
    }));
}

export default {

    getData: function(url, meta, __noOembedLinks, options, cb) {

        return cb(
            meta.robots
            && /noindex/i.test(meta.robots)
            && !meta.description
            && !meta.og
            && !meta.twitter
            && /* !oembedLinks */ !hasOembedLinks(meta)
            && /* !iframelyTargeted */ !Object.keys(meta).some(key => key.indexOf('iframely') === 0)
            && !options.allowNoIndex
            ? {
               responseStatusCode: 403,
               message: "The robots directive of this page prevents Iframely from parsing it"
            } : null);
    }

};

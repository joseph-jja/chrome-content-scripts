const PROTOCOL_SEP = '://';

function parseHostProtocol(inUrl) {
    if (!inUrl) {
        return {};
    }

    let host, protocol, domainlessHost, fqdnDomainHost;

    // we have a URL but it has no protocol
    if (inUrl.indexOf(PROTOCOL_SEP) > -1) {
        host = inUrl.split(PROTOCOL_SEP);
        if (!host) {
            return {};
        }
    } else {
        host = inUrl;
    }

    if (Array.isArray(host)) {
        if (host.length > 1) {
            protocol = host[0];
            host = host[1];
        } else {
            host = host[0];
        }
    }

    // by here we have host
    const idx = host.indexOf('/');
    if (idx > -1) {
        // remove everything after the first remaining /
        // ie foo.com/ becomes foo.com
        host = host.substring(0, idx);
    }

    if (host && host.length > 0) {
        const hostParts = host.split('.');
        if (hostParts.length > 0) {
            // www.foo.com then we want foo.com and foo
            domainlessHost = hostParts[hostParts.length - 2];
            fqdnDomainHost = `${hostParts[hostParts.length - 2]}.${hostParts[hostParts.length - 1]}`;
        }
    }

    // return fqdn (fully qualified domain name)
    return {
        host,
        protocol,
        domainlessHost,
        fqdnDomainHost
    };
}

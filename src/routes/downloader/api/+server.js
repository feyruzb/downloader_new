import ytdl from 'ytdl-core';

/** @type {import('./$types').RequestHandler} */
export const GET = (event) => {
	const url = event.url.searchParams.get('url');
	const format = event.url.searchParams.get('format');
	const res = event.url.searchParams.get('res'); 

    if (!url || !res) {
        return new Response('Missing url parameter', { status: 400 });
    }

    let quality;
    switch (res) {
        case '1080p':
            quality = '137';
            break;
        case '720p':
            quality = '136';
            break;
        case '480p':
            quality = '135';
            break;
        case '360p':
            quality = '134';
            break;
    }

    if (!quality) {
        return new Response('Invalid res parameter', { status: 400 });
    }

	const stream = ytdl(url, { quality });
	// @ts-ignore
	return new Response(stream);
};

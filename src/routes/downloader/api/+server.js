import ytdl from 'ytdl-core';
import ffmpeg from 'ffmpeg-static';
import { fstat, readFile, readFileSync, stat, statSync, unlink, unlinkSync } from 'fs';
import * as cp from 'child_process'

/** @type {import('./$types').RequestHandler} */
export const GET = async (event) => {
	const url = event.url.searchParams.get('url');
	const format = event.url.searchParams.get('format');
	const res = event.url.searchParams.get('res');
  
  let quality = {
    '1080p': '137',
    '720p': '136',
    '480p': '135',
    '360p': '134'
  };

	if (!url || !format) {
		return new Response('Missing url or format parameter', { status: 400 });
	}

	if (format === 'MP4' && !quality[res]) {
		return new Response('Invalid res parameter', { status: 400 });
	}

	const audio = ytdl(url, { quality: 'highestaudio' });

	if (format === 'MP3') {
		// @ts-ignore
		return new Response(audio);
	}

  const video = ytdl(url, { quality: quality[res] });
  
  return await new Promise((resolve, reject) => {
    unlinkSync("out.mp4");

    const ffmpegProcess = cp.spawn(
      ffmpeg,
      [
        // Remove ffmpeg's console spamming
        // '-loglevel',
        // '8',
        '-hide_banner',
        // Redirect/Enable progress messages
        '-progress',
        'pipe:3',
        // Set inputs
        '-i',
        'pipe:4',
        '-i',
        'pipe:5',
        // Map audio & video from streams
        '-map',
        '0:a',
        '-map',
        '1:v',
        // Keep encoding
        '-c:v',
        'copy',

        '-c:a',
        'aac',
        // Define output file
        'out.mp4'
      ],
      {
        windowsHide: true,
        stdio: [
          /* Standard: stdin, stdout, stderr */
          'inherit',
          'inherit',
          'inherit',
          /* Custom: pipe:3, pipe:4, pipe:5 */
          'pipe',
          'pipe',
          'pipe'
        ]
      }
    );
  
  
  
    ffmpegProcess.on('close', () => {
      console.log('done');
      // Cleanup
      process.stdout.write('\n\n\n\n');
      
      resolve(new Response(readFileSync("out.mp4")));
    });
  
    // Link streams
    // FFmpeg creates the transformer streams and we just have to insert / read data
    ffmpegProcess.stdio[3].on('data', (chunk) => {
      console.log(chunk);
    });
    audio.pipe(ffmpegProcess.stdio[4]);
    video.pipe(ffmpegProcess.stdio[5]);
  })

};

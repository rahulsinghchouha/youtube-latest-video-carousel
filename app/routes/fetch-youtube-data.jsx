import { json } from "@remix-run/node";
import prisma from "../db.server";
import {millify} from "millify"
import { fetchChannelData } from "../utils/utilFunctions";
import { decrypt } from "../utils/encryption";

export const action = async ({ request }) => {
  const url = new URL(request.url);
	const store = url.searchParams.get("shop");
	const entry = await prisma.youTubeAPI.findUnique({
		where: { storeName: store },
	});
	if(!entry){
		return json({success: false, uninitialized: true});
	}
	const playlistId = entry.playlistId || "";
	const channelName = entry.channelName || "";
  const maxResults = 5;
  const YOUTUBE_API_KEY = decrypt(entry.apiKey);

  try {
		if(!entry.lastFetchData || (new Date() - new Date(entry.lastFetchTimeStamp)) > 24 * 60 * 60 * 1000){

			const apiUrl = playlistId ? `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}&maxResults=${maxResults}` : `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet&type=video&channelId=${channelName}&maxResults=${maxResults}&order=date`;
			const response = await fetch(apiUrl);
			if(!response.ok){
				const errorData = await response.json();
				const errorReason = errorData?.error?.details[0]?.reason;
				switch (errorReason) {
					case 'API_KEY_INVALID':
						return json({ code:"API_KEY_INVALID", msg: 'Invalid API key. Please provide a valid API key.'  }, { status: 400 });
					case 'QUOTA_EXCEEDED':
						return json({ code:"QUOTA_EXCEEDED", msg: 'Quota exceeded. Please try again later.'  }, { status: 400 });
					default:
						return json({ code:errorReason, msg: errorData.error.message  }, { status: 400 });
				}
			}
	
			const data = await response.json();
			const channelData = await fetchChannelData(YOUTUBE_API_KEY, channelName);
	
			if (data.items && data.items.length > 0) {
				const videosIdString = data.items.map(item => playlistId ? item.snippet.resourceId.videoId : item.id.videoId).join(",");
				const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videosIdString}&key=${YOUTUBE_API_KEY}`;
				const videosResponse = await fetch(videosUrl);
				const videosData = await videosResponse.json();
				const videos = videosData.items.map(video => ({
					videoId: video.id,
					title: video.snippet.title,
					thumbnail: video.snippet.thumbnails.high.url,
					likes: millify(video.statistics.likeCount),
					views: millify(video.statistics.viewCount),
					comments: millify(video.statistics.commentCount),
					description: video.snippet.description,
					publishedAt: video.snippet.publishedAt,
				}));
				await prisma.youTubeAPI.update({
					where: {storeName: store},
					data:{
						lastFetchTimeStamp: new Date(),
						lastFetchData: {videos, channel: channelData}
					}
				})
				return json({ videos, channel: channelData }, { status: 200 });
			} else {
				return new Response(JSON.stringify({ videos: [] }), { 
					status: 200,
					headers:{
						"Content-Type": "application/json; charset=utf-8",
					}
				});
			}
		} else {
			return json({...entry.lastFetchData}, {status: 200})
		}
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
};

export default function FetchLoaderScript() {
  return null;
}
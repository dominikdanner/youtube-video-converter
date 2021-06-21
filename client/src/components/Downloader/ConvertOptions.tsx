import { FC, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import '../../style/Downloader.css'
import { DownloadOptions } from '../../types/DownloadOptions'

const socket: Socket = io('http://192.168.0.27:5000')

const getLocalStorageSong = () => {
	return {
		filename: localStorage.getItem('filename'),
		format: localStorage.getItem('format'),
		videoId: localStorage.getItem('videoId'),
		thumbnail: localStorage.getItem('thumbnail'),
		author: localStorage.getItem('author'),
		authorURL: localStorage.getItem('authorURL')
	}
}

const requestDownload = (vidId: string, title: string, format: string) => {
	console.log(`Request to: ${vidId}`)
	const options: DownloadOptions = {
		filename: title,
		format: format
	}
	socket.emit('song-download', vidId, options)
	socket.once('song-ready', (id: string) => {
		console.log(`Exepted ID: ${id}`)
		document.location.href = `http://localhost:4000/api/ytdl/${id}.${options.format}`
	})
}

export const ConverterOptions: FC = () => {
	const [state, setState] = useState(false)
	const Song = getLocalStorageSong()

	return(
		<div className="container">
			<div className="download-box">
				<h1><span>Youtube</span> Video Converter</h1>
				<p className="short">Download Music and Video in your format</p>
				<div className="content">
					<div className="video-card">
						<a href={`https://www.youtube.com/watch?v=${Song.videoId}`} target="_blank" rel="noreferrer"><img src={Song.thumbnail} alt="thumbnail"></img></a>
						<div className="video-details">
							<h4>{Song.filename}</h4>
							<p>{Song.author}</p>
							<button className="options-btn" onClick={() => {
								const el = document.getElementById('popup-options')
								el.style.display = "block"
								if(state) {
									el.classList.remove('popup-on')
									el.classList.add('popup-off')
									setState(false)
								} else {
									setState(true)
									el.classList.remove('popup-off')
									el.classList.add('popup-on')
								}
							}}>Options</button>
						</div>
					</div>
					<button className="download-btn" onClick={() => requestDownload(Song.videoId, Song.filename, 'mp3')}>Download</button>
				</div>
				<div style={{display:"none"}} id="popup-options">
					<div className="options-container">
						<select>
							<option>MP3</option>
							<option>MP4</option>
							<option>WAV</option>
							<option>AVI</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	)
}
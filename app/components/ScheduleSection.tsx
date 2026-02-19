
"use client";


import React, { useState, useEffect, useRef } from "react";
import { Plus, Calendar, Trash2, Share2, Image as ImageIcon, X } from "lucide-react";
import { saveMedia, getMedia, deleteMedia } from "../lib/scheduleDb";

// --- Types ---
interface ScheduledPost {
	id: string;
	date: string; // YYYY-MM-DD
	time: string; // HH:mm
	mediaType: "image" | "video";
	caption: string;
}

type ScheduleMap = Record<string, ScheduledPost[]>;

// --- MediaPreview Component ---
function MediaPreview({ postId, type }: { postId: string; type: "image" | "video" }) {
	const [url, setUrl] = useState<string>("");
	useEffect(() => {
		let active = true;
		getMedia(postId).then(media => {
			if (media && active) {
				const objectUrl = URL.createObjectURL(media.blob);
				setUrl(objectUrl);
			}
		});
		return () => {
			setUrl("");
		};
	}, [postId]);
	if (!url) return <div className="w-full h-full bg-gray-700 animate-pulse rounded" />;
	return type === "image"
		? <img src={url} alt="Scheduled" className="object-cover w-full h-full" />
		: <video src={url} controls className="object-cover w-full h-full" />;
}

function getTodayISO() {
	const now = new Date();
	return now.toISOString().slice(0, 10);
}

function getMonthDays(year: number, month: number) {
	const days: string[] = [];
	const date = new Date(year, month, 1);
	while (date.getMonth() === month) {
		days.push(date.toISOString().slice(0, 10));
		date.setDate(date.getDate() + 1);
	}
	return days;
}

type ScheduleSectionProps = {
	isDark?: boolean;
};

export default function ScheduleSection({ isDark = false }: ScheduleSectionProps) {
	const [schedule, setSchedule] = useState<ScheduleMap>({});
	const [selectedDay, setSelectedDay] = useState(getTodayISO());
	const [showAdd, setShowAdd] = useState(false);
	const [mediaFile, setMediaFile] = useState<File | null>(null);
	const [mediaPreview, setMediaPreview] = useState<string>("");
	const [mediaType, setMediaType] = useState<"image" | "video" | "">("");
	const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
	const [caption, setCaption] = useState("");
	// Helper to get the next 15-minute slot as HH:mm
	function getNextSlot() {
		const now = new Date();
		now.setMinutes(now.getMinutes() + 15 - (now.getMinutes() % 15));
		return now.toTimeString().slice(0, 5);
	}

	const [time, setTime] = useState(() => getNextSlot());
	const [month, setMonth] = useState(() => new Date().getMonth());
	const [year, setYear] = useState(() => new Date().getFullYear());
	const [error, setError] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let saved = null;
		if (typeof window !== "undefined") {
			saved = localStorage.getItem("schedule");
		}
		if (saved) setSchedule(JSON.parse(saved));
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("schedule", JSON.stringify(schedule));
		}
	}, [schedule]);

	useEffect(() => {
		if (!mediaFile) {
			setMediaPreview("");
			setMediaType("");
			setMediaBlob(null);
			return;
		}
		setMediaType(mediaFile.type.startsWith("image") ? "image" : "video");
		setMediaBlob(mediaFile);
		const url = URL.createObjectURL(mediaFile);
		setMediaPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [mediaFile]);

	// Notification registration (PWA-compatible, placeholder)
	useEffect(() => {
		// TODO: Register push notifications for scheduled posts
	}, [schedule]);

	const handleAddPost = async () => {
		if (!mediaFile || !mediaBlob || !caption.trim() || !time) {
			setError("Please select media, enter a caption, and pick a time.");
			return;
		}
		if (selectedDay === getTodayISO()) {
			const now = new Date();
			const [h, m] = time.split(":").map(Number);
			if (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes())) {
				setError("Time must be in the future.");
				return;
			}
		}
		const id = Date.now().toString();
		await saveMedia(id, mediaBlob, mediaType as "image" | "video");
		const post: ScheduledPost = {
			id,
			date: selectedDay,
			time,
			mediaType: mediaType as "image" | "video",
			caption: caption.trim(),
		};
		setSchedule((prev) => {
			const dayPosts = prev[selectedDay] ? [...prev[selectedDay], post] : [post];
			return { ...prev, [selectedDay]: dayPosts };
		});
		setShowAdd(false);
		setMediaFile(null);
		setMediaPreview("");
		setMediaBlob(null);
		setCaption("");
		setTime("");
		setError("");
	};

	const handleDeletePost = async (postId: string) => {
		await deleteMedia(postId);
		setSchedule((prev) => {
			const dayPosts = prev[selectedDay]?.filter((p) => p.id !== postId) || [];
			const newSchedule = { ...prev, [selectedDay]: dayPosts };
			if (dayPosts.length === 0) delete newSchedule[selectedDay];
			return newSchedule;
		});
	};

	const handleShare = async (post: ScheduledPost) => {
		// Copy caption to clipboard first
		try {
			if (typeof window !== "undefined" && navigator.clipboard) {
				await navigator.clipboard.writeText(post.caption);
			}
		} catch (e) {
			// ignore
		}
		// Get media from IndexedDB
		const media = await getMedia(post.id);
		if (media) {
			const file = new File([media.blob], `media.${media.type === 'image' ? 'jpg' : 'mp4'}`, { type: media.blob.type });
			// Try Web Share API with file (if supported)
			if (typeof window !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
				try {
					await navigator.share({
						files: [file],
						// Don't set text: WhatsApp Status ignores it, but chats may use it
					});
					alert('Media shared! Caption is already copied. After sharing to WhatsApp Status, just paste the caption.');
					return;
				} catch (e) {
					// fallback below
				}
			}
			// Fallback: download file and instruct user
			if (typeof window !== "undefined") {
				const url = URL.createObjectURL(media.blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `media.${media.type === 'image' ? 'jpg' : 'mp4'}`;
				document.body.appendChild(a);
				a.click();
				setTimeout(() => {
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
					alert('Media downloaded. Please upload it to WhatsApp Status manually. The caption is already copied—just paste it after uploading!');
				}, 100);
			}
		} else {
			alert('Media not found.');
		}
	};

	const monthDays = getMonthDays(year, month);

	return (
		<div className="min-h-screen bg-gray-950 lg:pl-72">
			<div className="p-4 max-w-2xl mx-auto">
				<div className="mb-6 flex items-center gap-3">
					<Calendar size={28} className="text-blue-400" strokeWidth={2.5} />
					<h2 className="text-3xl font-bold text-white">Schedule</h2>
				</div>
				{/* Month/Quick Picker */}
				<div className="flex items-center gap-2 mb-4">
					<button
						onClick={() => {
							if (month === 0) {
								setMonth(11);
								setYear(y => y - 1);
							} else {
								setMonth(m => m - 1);
							}
						}}
						className="px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700"
					>◀</button>
					<span className="font-semibold text-white">{new Date(year, month).toLocaleString(undefined, { month: "long", year: "numeric" })}</span>
					<button
						onClick={() => {
							if (month === 11) {
								setMonth(0);
								setYear(y => y + 1);
							} else {
								setMonth(m => m + 1);
							}
						}}
						className="px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700"
					>▶</button>
					<button onClick={() => { setMonth(new Date().getMonth()); setYear(new Date().getFullYear()); setSelectedDay(getTodayISO()); }} className="ml-2 px-3 py-1 rounded bg-blue-700 text-white">Today</button>
				</div>
				{/* Calendar Grid */}
				<div className="grid grid-cols-7 gap-1 mb-6">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
						<div key={d} className="text-xs text-center text-gray-400 pb-1">{d}</div>
					))}
					{Array(new Date(year, month, 1).getDay()).fill(null).map((_, i) => (
						<div key={"empty-" + i}></div>
					))}
					{monthDays.map((d) => {
						const dateObj = new Date(d);
						const isToday = d === getTodayISO();
						const isSelected = d === selectedDay;
						const hasPosts = !!schedule[d]?.length;
						return (
							<button
								key={d}
								onClick={() => setSelectedDay(d)}
								className={`aspect-square w-9 rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all border-2 ${isSelected ? "bg-blue-700 text-white border-blue-400" : isToday ? "bg-gray-800 text-blue-400 border-blue-700" : "bg-gray-800 text-gray-300 border-gray-800 hover:bg-gray-700"}`}
								disabled={d < getTodayISO()}
								style={{ opacity: d < getTodayISO() ? 0.4 : 1 }}
							>
								{dateObj.getDate()}
								{hasPosts && <span className="block w-2 h-2 mt-0.5 rounded-full bg-green-500"></span>}
							</button>
						);
					})}
				</div>
				{/* Add Post Button */}
				<button
					onClick={() => setShowAdd(true)}
					className="w-full mb-6 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-98 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
				>
					<Plus size={24} strokeWidth={2.5} />
					Add Scheduled Post
				</button>
				{/* Add Post Modal */}
				{showAdd && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
						<div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl relative">
							<button
								onClick={() => setShowAdd(false)}
								className="absolute top-3 right-3 text-gray-400 hover:text-white"
								aria-label="Close"
							>
								<X size={22} />
							</button>
							<h3 className="text-xl font-bold mb-4 text-white">New Scheduled Post</h3>
							<div className="space-y-4">
								{/* Media Upload Area */}
								<div className="flex flex-col items-center gap-2">
									<label htmlFor="media-upload" className="w-full cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-blue-500 bg-gray-800 rounded-xl p-6 text-blue-400 hover:bg-blue-900/30 transition-all">
										{mediaPreview ? (
											<>
												{mediaType === "image" ? (
													<img src={mediaPreview} alt="Preview" className="max-h-40 rounded-lg mb-2" />
												) : (
													<video src={mediaPreview} controls className="max-h-40 rounded-lg mb-2" />
												)}
												<span className="text-xs text-white">Tap to change media</span>
											</>
										) : (
											<>
												<ImageIcon size={32} />
												<span className="mt-2 text-blue-400 font-semibold">Tap to upload image or video</span>
											</>
										)}
									</label>
									<input
										id="media-upload"
										type="file"
										accept="image/*,video/*"
										ref={fileInputRef}
										onChange={e => {
											const file = e.target.files?.[0] || null;
											setMediaFile(file);
										}}
										className="hidden"
									/>
									{mediaPreview && (
										<button
											onClick={() => { setMediaFile(null); setMediaPreview(""); setMediaType(""); }}
											className="mt-1 px-3 py-1 rounded bg-red-700 text-white text-xs font-semibold hover:bg-red-800"
										>Remove Media</button>
									)}
								</div>
								{/* Caption */}
								<input
									type="text"
									value={caption}
									onChange={e => setCaption(e.target.value)}
									placeholder="Enter caption"
									className="w-full px-4 py-3 rounded-xl border bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
								/>
								{/* Time Picker */}
								<div className="flex flex-col gap-1">
									<label className="text-sm text-gray-300 mb-1 flex items-center gap-2">
										<span>Time to post</span>
										<span title="Pick a time" className="inline-flex items-center justify-center">
											<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-blue-400"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
										</span>
									</label>
									<input
										type="time"
										value={time}
										min={getNextSlot()}
										step={900}
										onChange={e => {
											setTime(e.target.value);
											setError("");
										}}
										className="w-full px-4 py-3 rounded-xl border-2 border-blue-500 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg font-semibold cursor-pointer"
										style={{ WebkitAppearance: 'none', appearance: 'none' }}
									/>
									<div className="text-xs text-gray-400 mt-1">Select a time (in 15-minute steps) for your post. The default is the next available slot.</div>
									{error && <span className="text-xs text-red-400 mt-1">{error}</span>}
								</div>
								<button
									onClick={handleAddPost}
									className="w-full py-3 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-98 bg-blue-600 hover:bg-blue-700 text-white"
								>
									Add Post
								</button>
							</div>
						</div>
					</div>
				)}
				{/* Daily View */}
				<div className="mt-8">
					<h4 className="text-lg font-bold text-white mb-3">Scheduled Posts for {new Date(selectedDay).toLocaleDateString()}</h4>
					{schedule[selectedDay]?.length ? (
						<div className="space-y-4">
							{schedule[selectedDay].map((post) => (
								<div key={post.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-md">
									<div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center">
										{/* Show preview from IndexedDB */}
										<MediaPreview postId={post.id} type={post.mediaType} />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="text-blue-400 font-semibold text-sm">{post.time}</span>
										</div>
										<p className="text-white font-medium break-words mb-2">{post.caption}</p>
										<div className="flex gap-2 mt-2">
											<button
												onClick={() => handleShare(post)}
												className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all bg-green-700 text-white hover:bg-green-800"
											>
												<Share2 size={18} /> Share to WhatsApp
											</button>
											<button
												onClick={() => handleDeletePost(post.id)}
												className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all bg-gray-800 text-red-400 hover:bg-red-900/40"
											>
												<Trash2 size={18} /> Delete
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-500 flex flex-col items-center">
							<div className="mb-4">
								<span className="text-4xl">📅</span>
							</div>
							<div className="mb-4">No posts scheduled for this day.</div>
							<button
								onClick={() => setShowAdd(true)}
								className="py-3 px-6 rounded-xl font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white text-lg mt-2"
							>
								+ Add Scheduled Post
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

"use client";

import { useState, useEffect } from "react";
import { Plus, UserCheck, Trash2, Edit2, X, Check } from "lucide-react";
import Image from "next/image";
import { defaultTemplates } from "./ShortcutTemplatesSection";

interface FollowUp {
	id: string;
	customerName: string;
	waNumber: string;
	items: string;
	dateAdded: string;
	notes?: string;
}

interface MessageTemplate {
	id: string;
	title: string;
	message: string;
}

export default function FollowUpsSection() {
	const [followUps, setFollowUps] = useState<FollowUp[]>([]);
	const [newCustomerName, setNewCustomerName] = useState("");
	const [newWaNumber, setNewWaNumber] = useState("");
	const [newItems, setNewItems] = useState("");
	const [newNotes, setNewNotes] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editCustomerName, setEditCustomerName] = useState("");
	const [editWaNumber, setEditWaNumber] = useState("");
	const [editItems, setEditItems] = useState("");
	const [editNotes, setEditNotes] = useState("");
	const [templates, setTemplates] = useState<MessageTemplate[]>([]);
	const [activeFollowUpId, setActiveFollowUpId] = useState<string | null>(null);
	const [selectedTemplateById, setSelectedTemplateById] = useState<Record<string, string>>({});

	useEffect(() => {
		const savedFollowUps = localStorage.getItem("followUps");
		if (savedFollowUps) setFollowUps(JSON.parse(savedFollowUps));
	}, []);

	useEffect(() => {
		if (followUps.length > 0) {
			localStorage.setItem("followUps", JSON.stringify(followUps));
		} else {
			localStorage.removeItem("followUps");
		}
	}, [followUps]);

	useEffect(() => {
		const savedTemplates = localStorage.getItem("messageTemplates");
		if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
		else setTemplates(defaultTemplates);
	}, []);

	const sanitizeWaNumber = (value: string) => value.replace(/\D/g, "").slice(0, 11);
	const isValidWaNumber = (value: string) => /^\d{11}$/.test(value);
	const normalizeWaNumber = (value: string) => {
		const digits = sanitizeWaNumber(value);
		if (!isValidWaNumber(digits)) return null;
		return `234${digits.slice(1)}`;
	};
	const formatDisplayDate = (dateStr: string): string => {
		const date = new Date(dateStr);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = String(date.getFullYear()).slice(-2);
		return `${day}/${month}/${year}`;
	};

	const handleAdd = () => {
		if (!newCustomerName.trim() || !newItems.trim() || !isValidWaNumber(newWaNumber)) {
			alert("Please fill all required fields with a valid WhatsApp number.");
			return;
		}
		const followUp: FollowUp = {
			id: Date.now().toString(),
			customerName: newCustomerName.trim(),
			waNumber: newWaNumber.trim(),
			items: newItems.trim(),
			dateAdded: new Date().toISOString(),
			notes: newNotes.trim() || undefined,
		};
		setFollowUps([followUp, ...followUps]);
		setNewCustomerName("");
		setNewWaNumber("");
		setNewItems("");
		setNewNotes("");
		setIsAdding(false);
	};

	const startEdit = (followUp: FollowUp) => {
		setEditingId(followUp.id);
		setEditCustomerName(followUp.customerName);
		setEditWaNumber(followUp.waNumber || "");
		setEditItems(followUp.items);
		setEditNotes(followUp.notes || "");
	};
	const saveEdit = (id: string) => {
		if (!editCustomerName.trim() || !editItems.trim() || !isValidWaNumber(editWaNumber)) {
			alert("Please fill all required fields with a valid WhatsApp number.");
			return;
		}
		setFollowUps(followUps.map(fu =>
			fu.id === id
				? {
					...fu,
					customerName: editCustomerName.trim(),
					waNumber: editWaNumber.trim(),
					items: editItems.trim(),
					notes: editNotes.trim() || undefined,
				}
				: fu
		));
		setEditingId(null);
	};
	const cancelEdit = () => setEditingId(null);
	const deleteFollowUp = (id: string) => setFollowUps(followUps.filter(fu => fu.id !== id));

	const toggleTemplatePanel = (id: string) => {
		setActiveFollowUpId(activeFollowUpId === id ? null : id);
	};
	const handleSendNow = (followUp: FollowUp) => {
		const templateId = selectedTemplateById[followUp.id];
		const template = templates.find(t => t.id === templateId);
		if (!template) {
			alert("Please select a message template before sending. The default template is not allowed for sending—choose a template from the dropdown.");
			return;
		}
		const normalized = normalizeWaNumber(followUp.waNumber);
		if (!normalized) {
			alert("Please enter a valid WhatsApp number (11 digits).");
			return;
		}
		const encodedMessage = encodeURIComponent(template.message);
		window.open(`https://wa.me/${normalized}?text=${encodedMessage}`, "_blank", "noopener,noreferrer");
	};

	return (
		<div className="min-h-screen bg-gray-950 lg:pl-72">
			<div className="p-6 lg:p-8 max-w-7xl mx-auto">
				{/* Top Section (Always Visible) */}
				<div className="mb-4">
					{/* Header */}
					<div className="mb-6">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-3 rounded-xl bg-purple-900/30">
								<UserCheck size={28} className="text-purple-400" strokeWidth={2.5} />
							</div>
							<h1 className="text-3xl lg:text-4xl font-bold text-white">Follow-Ups</h1>
						</div>
						<p className="text-gray-400 text-lg">
							Track customers with pending deals
						</p>
					</div>
					{/* Stats Card */}
					<div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-800/50 rounded-2xl p-6 mb-6 shadow-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-purple-300 mb-1">
									Pending Follow-Ups
								</p>
								<p className="text-4xl font-bold text-white">{followUps.length}</p>
							</div>
							<div className="p-4 rounded-xl bg-purple-900/40">
								<UserCheck size={32} className="text-purple-400" strokeWidth={2.5} />
							</div>
						</div>
					</div>
					{/* Add New Follow-Up Button */}
					{!isAdding && (
						<button
							onClick={() => setIsAdding(true)}
							className="w-full mb-6 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-98 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
						>
							<Plus size={24} strokeWidth={2.5} />
							Add New Follow-Up
						</button>
					)}
					{/* Add New Form */}
					{isAdding && (
						<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 shadow-xl">
							<h3 className="text-xl font-bold mb-4 text-white">New Follow-Up</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2 text-gray-300">Customer Name *</label>
									<input type="text" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} placeholder="Enter customer name" className="w-full px-4 py-3 rounded-xl border bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
								</div>
								<div>
									<label className="block text-sm font-medium mb-2 text-gray-300">WhatsApp Number (11 digits) *</label>
									<input type="tel" inputMode="numeric" value={newWaNumber} onChange={e => setNewWaNumber(sanitizeWaNumber(e.target.value))} placeholder="09040991849" className="w-full px-4 py-3 rounded-xl border bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2 text-gray-300">Items of Interest *</label>
										<input type="text" value={newItems} onChange={e => setNewItems(e.target.value)} placeholder="e.g., iPhone 13, Sneakers, etc." className="w-full px-4 py-3 rounded-xl border bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
									</div>
									<div>
										<label className="block text-sm font-medium mb-2 text-gray-300">Notes (Optional)</label>
										<textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Additional notes..." rows={2} className="w-full px-4 py-3 rounded-xl border bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none" />
									</div>
								</div>
								<div className="flex gap-3 pt-2">
									<button onClick={handleAdd} className="flex-1 py-3 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-98 bg-purple-600 hover:bg-purple-700 text-white">Add Follow-Up</button>
									<button onClick={() => { setIsAdding(false); setNewCustomerName(""); setNewWaNumber(""); setNewItems(""); setNewNotes(""); }} className="py-3 px-6 rounded-xl font-bold transition-all bg-gray-800 hover:bg-gray-700 text-gray-300">Cancel</button>
								</div>
							</div>
						</div>
					)}
					{/* Follow-Ups List */}
					<div className="space-y-4">
						{followUps.length === 0 ? (
							<div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center shadow-md flex flex-col items-center">
								<UserCheck size={64} className="mx-auto mb-4 text-gray-700" strokeWidth={1.5} />
								<p className="text-xl font-medium text-gray-500">No follow-ups yet</p>
								<p className="mt-2 text-gray-600">Add customers who need follow-up</p>
								<button
									onClick={() => setIsAdding(true)}
									className="py-3 px-6 rounded-xl font-bold transition-all bg-purple-600 hover:bg-purple-700 text-white text-lg mt-6"
								>
									+ Add New Follow-Up
								</button>
							</div>
						) : (
							followUps.map((followUp) => (
								<div key={followUp.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all">
									{editingId === followUp.id ? (
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium mb-2 text-gray-300">Customer Name</label>
												<input type="text" value={editCustomerName} onChange={e => setEditCustomerName(e.target.value)} className="w-full px-4 py-2 rounded-xl border bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none" />
											</div>
											<div>
												<label className="block text-sm font-medium mb-2 text-gray-300">WhatsApp Number</label>
												<input type="tel" inputMode="numeric" value={editWaNumber} onChange={e => setEditWaNumber(sanitizeWaNumber(e.target.value))} placeholder="09040991849" className="w-full px-4 py-2 rounded-xl border bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none" />
											</div>
											<div>
												<label className="block text-sm font-medium mb-2 text-gray-300">Items of Interest</label>
												<input type="text" value={editItems} onChange={e => setEditItems(e.target.value)} className="w-full px-4 py-2 rounded-xl border bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none" />
											</div>
											<div>
												<label className="block text-sm font-medium mb-2 text-gray-300">Notes</label>
												<textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} className="w-full px-4 py-2 rounded-xl border bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
											</div>
											<div className="flex gap-2">
												<button onClick={() => saveEdit(followUp.id)} className="flex-1 py-2 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"><Check size={18} />Save</button>
												<button onClick={cancelEdit} className="py-2 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300"><X size={18} />Cancel</button>
											</div>
										</div>
									) : (
										<div>
											<div className="flex items-start justify-between mb-3">
												<div className="flex-1">
													<button type="button" onClick={() => toggleTemplatePanel(followUp.id)} className="text-left text-lg font-bold text-white mb-1 hover:underline">
														{followUp.customerName}
													</button>
													<p className="text-sm text-gray-400">Added: {formatDisplayDate(followUp.dateAdded)}</p>
													<p className="text-sm text-gray-400">WA: {followUp.waNumber || "Not set"}</p>
												</div>
												<div className="flex gap-2">
													<button onClick={() => startEdit(followUp)} className="p-2 rounded-lg transition-all bg-gray-800 hover:bg-gray-700 text-blue-400"><Edit2 size={18} /></button>
													<button onClick={() => deleteFollowUp(followUp.id)} className="p-2 rounded-lg transition-all bg-gray-800 hover:bg-red-900/30 text-red-400"><Trash2 size={18} /></button>
												</div>
											</div>
											{activeFollowUpId === followUp.id && (
												<div className="bg-gray-800/70 rounded-xl p-4 mb-3 border border-gray-700">
													<div className="grid gap-3 md:grid-cols-[1fr_auto]">
														<div>
															<label className="block text-sm font-medium mb-2 text-gray-300">Choose template</label>
															<select value={selectedTemplateById[followUp.id] || ""} onChange={e => setSelectedTemplateById(prev => ({ ...prev, [followUp.id]: e.target.value }))} className="w-full px-4 py-2 rounded-xl border bg-gray-900 border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none">
																<option value="" disabled>{templates.length === 0 ? "No templates available" : "Select a template"}</option>
																{templates.map(template => (
																	<option key={template.id} value={template.id}>{template.title}</option>
																))}
															</select>
														</div>
														<div className="flex items-end">
															<button onClick={() => handleSendNow(followUp)} disabled={!followUp.waNumber || templates.length === 0} className={`w-full md:w-auto px-5 py-2 rounded-xl font-bold transition-all ${followUp.waNumber && templates.length > 0 ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-700 text-gray-400"}`}>Send now</button>
														</div>
													</div>
												</div>
											)}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
												<div className="bg-gray-800/50 rounded-xl p-4">
													<p className="text-sm font-medium text-gray-400 mb-1">Items of Interest</p>
													<p className="font-semibold text-white">{followUp.items}</p>
												</div>
												<div className="bg-purple-900/20 border border-purple-800/30 rounded-xl p-4">
													<p className="text-sm font-medium text-purple-400 mb-1">Notes</p>
													<p className="text-sm text-gray-300">{followUp.notes || <span className="italic opacity-60">No notes</span>}</p>
												</div>
											</div>
											{/* WhatsApp Message Now Button */}
											<div className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
												<button onClick={() => toggleTemplatePanel(followUp.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-98 bg-green-700 text-white hover:bg-green-800"><Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} className="mr-1" />Message Now</button>
												{activeFollowUpId === followUp.id && (
													<div className="bg-gray-800/70 rounded-xl p-4 border border-gray-700 mt-2 w-full md:w-auto">
														<div className="mb-2 font-semibold text-sm">Choose a template to copy or send:</div>
														<div className="flex flex-col md:flex-row gap-2">
															<select value={selectedTemplateById[followUp.id] || ""} onChange={e => setSelectedTemplateById(prev => ({ ...prev, [followUp.id]: e.target.value }))} className="px-4 py-2 rounded-xl border bg-gray-900 border-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none">
																<option value="" disabled>{templates.length === 0 ? "No templates available" : "Select a template"}</option>
																{templates.map(template => (
																	<option key={template.id} value={template.id}>{template.title}</option>
																))}
															</select>
															<button onClick={() => {
																const templateId = selectedTemplateById[followUp.id];
																const template = templates.find(t => t.id === templateId);
																if (template) navigator.clipboard.writeText(template.message);
															}} disabled={!selectedTemplateById[followUp.id]} className={`px-4 py-2 rounded-xl font-semibold transition-all ${selectedTemplateById[followUp.id] ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-gray-700 text-gray-400"}`}>Copy Template</button>
															<button onClick={() => handleSendNow(followUp)} disabled={!followUp.waNumber || templates.length === 0 || !selectedTemplateById[followUp.id]} className={`px-4 py-2 rounded-xl font-semibold transition-all ${followUp.waNumber && templates.length > 0 && selectedTemplateById[followUp.id] ? "bg-green-700 text-white hover:bg-green-800" : "bg-gray-700 text-gray-400"}`}>Open Chat Now</button>
														</div>
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
